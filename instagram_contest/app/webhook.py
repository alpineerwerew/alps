"""
Instagram (Meta) webhooks: verification (GET) and **Story mentions only** (POST).

Ce projet ne comptabilise **que** les mentions en Story via la **Messagerie Instagram** :
événement `messages` avec une pièce jointe `type: story_mention` (URL CDN dans `payload.url`).
Les webhooks Graph `mentions` (commentaires / légendes) sont ignorés.

Réf. : https://developers.facebook.com/docs/messenger-platform/instagram/features/webhook/

Signature: X-Hub-Signature-256 = sha256=HMAC_SHA256(raw_body, app_secret)
"""

from __future__ import annotations

import hashlib
import hmac
import json
import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import PlainTextResponse

from app.config import get_settings
from app.database import get_session_factory
from app.instagram_enrichment import username_from_ig_scoped_id
from app.notifications import notify_admin_story_mention
from app.participants import log_mention_event, upsert_participant
from app.rate_limit import rate_limited_webhook

logger = logging.getLogger(__name__)

router = APIRouter(tags=["webhook"])


def verify_meta_signature(body: bytes, signature_header: str | None, app_secret: str) -> bool:
    if not signature_header or not signature_header.startswith("sha256="):
        return False
    expected = hmac.new(app_secret.encode("utf-8"), body, hashlib.sha256).hexdigest()
    received = signature_header.removeprefix("sha256=")
    return hmac.compare_digest(expected, received)


@dataclass(frozen=True)
class StoryMentionEvent:
    """Une mention de ton compte dans la Story d’un utilisateur (Messagerie Instagram)."""

    sender_igsid: str | None
    message_mid: str | None
    story_cdn_url: str | None
    timestamp_ms: int | None
    entry_time: int | None


def _story_mention_from_message_dict(message: dict[str, Any]) -> tuple[str | None, list[str]]:
    """
    Retourne (première URL CDN story_mention, liste des types d’attachments vus).
    Ne retourne une URL que si au moins un attachment est explicitement story_mention.
    """
    seen_types: list[str] = []
    story_url: str | None = None
    for att in message.get("attachments") or []:
        if not isinstance(att, dict):
            continue
        t = str(att.get("type") or "").lower()
        seen_types.append(t or "?")
        if t != "story_mention":
            continue
        payload = att.get("payload")
        if isinstance(payload, dict):
            u = payload.get("url")
            if isinstance(u, str) and u.strip():
                story_url = story_url or u.strip()
    return story_url, seen_types


def _parse_messaging_event(evt: dict[str, Any], entry_time: int | None) -> StoryMentionEvent | None:
    """
    Filtre strict : uniquement les messages entrants avec attachment story_mention.
    Ignore is_echo, is_deleted, texte seul, share, reply_to.story seul, etc.
    """
    msg = evt.get("message")
    if not isinstance(msg, dict):
        return None
    if msg.get("is_echo") or msg.get("is_deleted") or msg.get("is_unsupported"):
        return None

    story_url, types = _story_mention_from_message_dict(msg)
    if story_url is None:
        return None

    sender = evt.get("sender")
    sid = None
    if isinstance(sender, dict) and sender.get("id") is not None:
        sid = str(sender["id"])

    mid = msg.get("mid")
    mid_s = str(mid) if mid is not None else None

    ts = evt.get("timestamp")
    ts_ms = int(ts) if isinstance(ts, int) else None

    return StoryMentionEvent(
        sender_igsid=sid,
        message_mid=mid_s,
        story_cdn_url=story_url,
        timestamp_ms=ts_ms,
        entry_time=entry_time,
    )


def iter_story_mention_events(payload: dict[str, Any]) -> list[StoryMentionEvent]:
    """Parcourt object=instagram : entry[].messaging[] et entry[].changes[] (field messages)."""
    out: list[StoryMentionEvent] = []
    if payload.get("object") != "instagram":
        return out

    for entry in payload.get("entry") or []:
        if not isinstance(entry, dict):
            continue
        entry_time = entry.get("time")
        et = int(entry_time) if isinstance(entry_time, int) else None

        for evt in entry.get("messaging") or []:
            if not isinstance(evt, dict):
                continue
            parsed = _parse_messaging_event(evt, et)
            if parsed:
                out.append(parsed)

        for change in entry.get("changes") or []:
            if not isinstance(change, dict):
                continue
            if str(change.get("field") or "").lower() != "messages":
                continue
            value = change.get("value")
            if isinstance(value, dict):
                parsed = _parse_messaging_event(value, et)
                if parsed:
                    out.append(parsed)

    return out


async def _process_story_mention(ev: StoryMentionEvent) -> None:
    username: str | None = None
    if ev.sender_igsid:
        username = await username_from_ig_scoped_id(ev.sender_igsid)

    ts: datetime
    if ev.timestamp_ms is not None:
        ts = datetime.fromtimestamp(ev.timestamp_ms / 1000.0, tz=timezone.utc)
    elif ev.entry_time is not None:
        ts = datetime.fromtimestamp(float(ev.entry_time), tz=timezone.utc)
    else:
        ts = datetime.now(timezone.utc)

    mention_key = ev.message_mid or f"story:{ev.sender_igsid}:{int(ts.timestamp())}"
    excerpt = json.dumps(
        {
            "sender_igsid": ev.sender_igsid,
            "mid": ev.message_mid,
            "story_url_present": bool(ev.story_cdn_url),
        },
        ensure_ascii=False,
    )[:4000]

    async with get_session_factory()() as session:
        await log_mention_event(
            session,
            field_name="messages:story_mention",
            username=username,
            mention_id=mention_key,
            media_id=ev.sender_igsid,
            raw_excerpt=excerpt,
        )

    is_new = False
    if username:
        async with get_session_factory()() as session:
            is_new, _ = await upsert_participant(
                session,
                username=username,
                mention_id=mention_key,
                media_id=ev.sender_igsid,
                story_or_media_url=ev.story_cdn_url,
            )
    else:
        logger.warning(
            "Story mention sans username Graph (sender_igsid=%s mid=%s)",
            ev.sender_igsid,
            ev.message_mid,
        )

    await notify_admin_story_mention(
        username=username,
        when=ts,
        story_cdn_url=ev.story_cdn_url,
        is_new_participant=is_new if username else False,
        message_mid=ev.message_mid,
        sender_igsid=ev.sender_igsid,
    )


@router.get("/webhook")
async def instagram_webhook_verify(
    hub_mode: str | None = Query(None, alias="hub.mode"),
    hub_challenge: str | None = Query(None, alias="hub.challenge"),
    hub_verify_token: str | None = Query(None, alias="hub.verify_token"),
) -> PlainTextResponse:
    settings = get_settings()
    if hub_mode == "subscribe" and hub_verify_token == settings.verify_token and hub_challenge:
        logger.info("Webhook verified successfully")
        return PlainTextResponse(content=hub_challenge)
    logger.warning("Webhook verification failed (mode or token mismatch)")
    raise HTTPException(status_code=403, detail="Verification failed")


@router.post("/webhook")
async def instagram_webhook_receive(request: Request) -> dict[str, str]:
    rate_limited_webhook(request)
    body = await request.body()
    settings = get_settings()

    sig = request.headers.get("X-Hub-Signature-256")
    if settings.meta_app_secret:
        if not verify_meta_signature(body, sig, settings.meta_app_secret):
            logger.warning("Invalid webhook signature")
            raise HTTPException(status_code=403, detail="Invalid signature")
    else:
        if sig:
            logger.warning(
                "META_APP_SECRET is not set — X-Hub-Signature-256 cannot be verified. "
                "Set META_APP_SECRET in production."
            )

    try:
        payload = json.loads(body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as e:
        logger.warning("Invalid JSON webhook body: %s", e)
        raise HTTPException(status_code=400, detail="Invalid JSON") from e

    if not isinstance(payload, dict):
        raise HTTPException(status_code=400, detail="Invalid payload")

    events = iter_story_mention_events(payload)
    if not events:
        logger.debug(
            "Webhook ignoré (pas de story_mention dans messages): object=%s",
            payload.get("object"),
        )
        return {"status": "ignored"}

    for ev in events:
        try:
            await _process_story_mention(ev)
        except Exception:
            logger.exception("Échec traitement story_mention mid=%s", ev.message_mid)

    return {"status": "ok"}
