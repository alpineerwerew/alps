import csv
import io
import random
from datetime import datetime, timezone
from typing import Sequence

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import MentionEvent, Participant


async def log_mention_event(
    session: AsyncSession,
    *,
    field_name: str | None,
    username: str | None,
    mention_id: str | None,
    media_id: str | None,
    raw_excerpt: str | None,
) -> None:
    session.add(
        MentionEvent(
            field_name=field_name,
            username=username,
            mention_id=mention_id,
            media_id=media_id,
            raw_excerpt=raw_excerpt,
        )
    )
    await session.commit()


async def upsert_participant(
    session: AsyncSession,
    *,
    username: str,
    mention_id: str | None,
    media_id: str | None,
    story_or_media_url: str | None,
) -> tuple[bool, Participant]:
    """
    Insert or update participant. Returns (is_new, row).
    """
    uname = username.strip().lstrip("@").lower()
    result = await session.execute(select(Participant).where(Participant.username == uname))
    existing = result.scalar_one_or_none()
    now = datetime.now(timezone.utc)
    if existing:
        existing.last_mentioned_at = now
        if mention_id:
            existing.mention_id = mention_id
        if media_id:
            existing.media_id = media_id
        if story_or_media_url:
            existing.story_or_media_url = story_or_media_url
        await session.commit()
        await session.refresh(existing)
        return False, existing

    p = Participant(
        username=uname,
        first_mentioned_at=now,
        last_mentioned_at=now,
        mention_id=mention_id,
        media_id=media_id,
        story_or_media_url=story_or_media_url,
    )
    session.add(p)
    await session.commit()
    await session.refresh(p)
    return True, p


async def count_participants(session: AsyncSession) -> int:
    r = await session.execute(select(func.count()).select_from(Participant))
    return int(r.scalar_one())


async def list_participants_ordered(session: AsyncSession) -> Sequence[Participant]:
    r = await session.execute(select(Participant).order_by(Participant.first_mentioned_at.asc()))
    return r.scalars().all()


async def list_participants_page(
    session: AsyncSession, offset: int, limit: int
) -> Sequence[Participant]:
    r = await session.execute(
        select(Participant)
        .order_by(Participant.first_mentioned_at.asc())
        .offset(offset)
        .limit(limit)
    )
    return r.scalars().all()


async def recent_first_mentions(session: AsyncSession, n: int = 5) -> Sequence[Participant]:
    r = await session.execute(
        select(Participant).order_by(Participant.first_mentioned_at.desc()).limit(n)
    )
    return r.scalars().all()


async def clear_participants(session: AsyncSession) -> int:
    r = await session.execute(select(Participant))
    rows = r.scalars().all()
    n = len(rows)
    for row in rows:
        await session.delete(row)
    await session.commit()
    return n


def pick_winner(participants: Sequence[Participant], seed: int | None) -> Participant | None:
    if not participants:
        return None
    rng = random.Random(seed)
    return rng.choice(list(participants))


def participants_to_csv_rows(participants: Sequence[Participant]) -> str:
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(
        ["username", "first_mentioned_at", "last_mentioned_at", "mention_id", "media_id", "story_or_media_url"]
    )
    for p in participants:
        w.writerow(
            [
                p.username,
                p.first_mentioned_at.isoformat(),
                p.last_mentioned_at.isoformat(),
                p.mention_id or "",
                p.media_id or "",
                p.story_or_media_url or "",
            ]
        )
    return buf.getvalue()
