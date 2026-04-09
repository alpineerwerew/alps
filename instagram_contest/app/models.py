from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


class Participant(Base):
    """One row per Instagram username (contest uniqueness)."""

    __tablename__ = "participants"
    __table_args__ = (UniqueConstraint("username", name="uq_participants_username"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    first_mentioned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow
    )
    last_mentioned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow, onupdate=_utcnow
    )
    mention_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    media_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    story_or_media_url: Mapped[str | None] = mapped_column(Text, nullable=True)


class MentionEvent(Base):
    """Audit log of every webhook mention-related notification we process."""

    __tablename__ = "mention_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow
    )
    field_name: Mapped[str | None] = mapped_column(String(64), nullable=True)
    username: Mapped[str | None] = mapped_column(String(255), nullable=True)
    mention_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    media_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    raw_excerpt: Mapped[str | None] = mapped_column(Text, nullable=True)
