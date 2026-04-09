"""
Appels Instagram Graph API (token Page / IG) pour enrichir les webhooks.

- Story mentions (Messagerie) : résolution du **username** à partir de l’IGSID expéditeur.

BONUS / DANGER — AUTO_FOLLOW (instagram_auto_follow_enabled):
  Meta may restrict or ban automation. Do NOT enable without legal review.
  Example (commented): POST /{ig-user-id}/following?user_id={target_id}
  See: https://developers.facebook.com/docs/instagram-platform/
"""

import logging
from typing import Any

import httpx

from app.config import get_settings

logger = logging.getLogger(__name__)


async def graph_get(path: str, params: dict[str, str] | None = None) -> dict[str, Any] | None:
    settings = get_settings()
    token = settings.instagram_access_token
    base = settings.instagram_graph_base.rstrip("/")
    ver = settings.instagram_graph_version.strip("/")
    url = f"{base}/{ver}/{path.lstrip('/')}"
    q = {"access_token": token}
    if params:
        q.update(params)
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            r = await client.get(url, params=q)
            data = r.json()
            if r.status_code >= 400:
                logger.warning("Graph API error %s: %s", r.status_code, data)
                return None
            if isinstance(data, dict) and data.get("error"):
                logger.warning("Graph API error body: %s", data)
                return None
            return data if isinstance(data, dict) else None
    except httpx.HTTPError as e:
        logger.exception("Graph HTTP error: %s", e)
        return None


async def username_from_ig_scoped_id(igsid: str) -> str | None:
    """
    Résout le @username à partir de l’ID Instagram « scoped » (expéditeur dans messaging).
    Nécessite un token avec les permissions prévues par Meta pour la Messagerie Instagram.
    """
    if not igsid or not str(igsid).strip():
        return None
    data = await graph_get(str(igsid).strip(), {"fields": "id,username,name"})
    if not data:
        return None
    u = data.get("username")
    return u.strip() if isinstance(u, str) and u.strip() else None


# Conservés pour d’éventuels scripts / extensions (hors webhook Story-only).
async def enrich_from_comment(comment_id: str) -> tuple[str | None, str | None, str | None]:
    fields = "id,from{id,username},media{id,media_type,permalink,media_product_type}"
    data = await graph_get(comment_id, {"fields": fields})
    if not data:
        return None, None, None
    from_ = data.get("from") or {}
    username = from_.get("username")
    media = data.get("media") or {}
    media_id = media.get("id")
    permalink = media.get("permalink")
    return (username, permalink, str(media_id) if media_id else None)


async def enrich_from_media(media_id: str) -> tuple[str | None, str | None]:
    fields = "id,media_type,permalink,media_product_type,timestamp,owner{username,id}"
    data = await graph_get(media_id, {"fields": fields})
    if not data:
        return None, None
    owner = data.get("owner") or {}
    username = owner.get("username")
    permalink = data.get("permalink")
    return username, permalink


# BONUS: keyword DM filter — requires subscribing to `messages` and matching sender to mentioner; not implemented here.
# BONUS: export CSV — see telegram_bot /export when ENABLE_CSV_EXPORT_COMMAND=true.


# BONUS — EXTREMELY DANGEROUS, likely against Meta policies / automation limits:
# async def auto_follow_mentioned_user(target_user_id: str) -> None:
#     settings = get_settings()
#     if not settings.instagram_auto_follow_enabled:
#         return
#     # You would need the authenticated IG user id and a supported edge — many follow flows are disallowed.
#     # Do not ship this without Meta review and legal advice.
#     raise NotImplementedError("Intentionally not implemented — ban risk")
