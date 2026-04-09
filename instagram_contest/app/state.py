"""Process-wide references set at startup (FastAPI lifespan + Telegram bot)."""

from telegram import Bot

_bot: Bot | None = None


def set_bot(bot: Bot) -> None:
    global _bot
    _bot = bot


def get_bot() -> Bot:
    if _bot is None:
        raise RuntimeError("Telegram Bot is not initialized yet")
    return _bot
