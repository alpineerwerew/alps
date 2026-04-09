"""Admin Telegram notifications (decoupled from command handlers)."""

import logging

from app.config import get_settings
from app.state import get_bot

logger = logging.getLogger(__name__)


async def notify_admin_story_mention(
    *,
    username: str | None,
    when,
    story_cdn_url: str | None,
    is_new_participant: bool,
    message_mid: str | None,
    sender_igsid: str | None,
) -> None:
    settings = get_settings()
    bot = get_bot()
    lines = [
        "Mention en Story (Messagerie Instagram, pièce jointe story_mention)",
    ]
    if username:
        lines.append(f"@{username} t'a mentionné dans sa Story")
    else:
        lines.append("Story mention reçue — username non résolu (vérifie token / permissions Graph)")
    lines.append(f"Date (UTC): {when.isoformat()}")
    if story_cdn_url:
        lines.append(f"URL CDN Story (éphémère, ne pas archiver le média hors cadre Meta) : {story_cdn_url}")
    if message_mid:
        lines.append(f"message mid: {message_mid}")
    if sender_igsid:
        lines.append(f"sender IGSID: {sender_igsid}")
    if username:
        lines.append(
            "Nouveau participant enregistré ✓"
            if is_new_participant
            else "Participant déjà connu (liste mise à jour)"
        )
    text = "\n".join(lines)
    try:
        await bot.send_message(chat_id=settings.telegram_admin_id, text=text)
    except Exception:
        logger.exception("Failed to send Telegram notification to admin")
