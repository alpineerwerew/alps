"""
Telegram bot: admin notifications + contest commands.

Uses python-telegram-bot v21+ (async).
"""

from __future__ import annotations

import logging
import time
from io import BytesIO

from telegram import InlineKeyboardButton, InlineKeyboardMarkup, InputFile, Update
from telegram.ext import Application, CallbackQueryHandler, CommandHandler, ContextTypes

from app.config import get_settings
from app.database import get_session_factory
from app.participants import (
    clear_participants,
    count_participants,
    list_participants_ordered,
    list_participants_page,
    participants_to_csv_rows,
    pick_winner,
    recent_first_mentions,
)
from app.state import set_bot

logger = logging.getLogger(__name__)

PAGE_SIZE = 10

# Pending clear confirmations: user_id -> monotonic expiry
_pending_clear_until: dict[int, float] = {}


def _is_admin(user_id: int | None) -> bool:
    if user_id is None:
        return False
    return user_id == get_settings().telegram_admin_id


def build_application() -> Application:
    settings = get_settings()
    app = Application.builder().token(settings.telegram_token).build()

    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CommandHandler("help", cmd_help))
    app.add_handler(CommandHandler("participants", cmd_participants))
    app.add_handler(CommandHandler("tirage", cmd_tirage))
    app.add_handler(CommandHandler("clear", cmd_clear))
    app.add_handler(CommandHandler("stats", cmd_stats))
    if settings.enable_csv_export_command:
        app.add_handler(CommandHandler("export", cmd_export))

    app.add_handler(CallbackQueryHandler(on_callback))

    return app


async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.effective_user or not _is_admin(update.effective_user.id):
        return
    await update.message.reply_text(
        "Bot concours Instagram — commandes: /participants /tirage /clear /stats"
        + (" /export" if get_settings().enable_csv_export_command else "")
    )


async def cmd_help(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await cmd_start(update, context)


async def cmd_participants(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.effective_user or not _is_admin(update.effective_user.id):
        return
    await _send_participants_page(update, context, page=0)


async def _send_participants_page(update: Update, context: ContextTypes.DEFAULT_TYPE, page: int) -> None:
    async with get_session_factory()() as session:
        total = await count_participants(session)
        if total == 0:
            await update.effective_message.reply_text("Aucun participant pour le moment.")
            return
        total_pages = max(1, (total + PAGE_SIZE - 1) // PAGE_SIZE)
        page = max(0, min(page, total_pages - 1))
        offset = page * PAGE_SIZE
        rows = await list_participants_page(session, offset, PAGE_SIZE)

    lines = [f"Participants: {total} (page {page + 1}/{total_pages})", ""]
    for i, p in enumerate(rows, start=page * PAGE_SIZE + 1):
        lines.append(f"{i}. @{p.username} — {p.first_mentioned_at.isoformat()}")
    keyboard = []
    nav = []
    if page > 0:
        nav.append(InlineKeyboardButton("◀", callback_data=f"p:{page - 1}"))
    if page < total_pages - 1:
        nav.append(InlineKeyboardButton("▶", callback_data=f"p:{page + 1}"))
    if nav:
        keyboard.append(nav)
    await update.effective_message.reply_text(
        "\n".join(lines),
        reply_markup=InlineKeyboardMarkup(keyboard) if keyboard else None,
    )


async def cmd_tirage(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.effective_user or not _is_admin(update.effective_user.id):
        return
    settings = get_settings()
    seed: int | None = None
    if context.args:
        try:
            seed = int(context.args[0])
        except ValueError:
            await update.message.reply_text("Usage: /tirage [seed_entier]")
            return
    else:
        seed = settings.contest_default_random_seed

    async with get_session_factory()() as session:
        all_p = await list_participants_ordered(session)
    winner = pick_winner(all_p, seed)
    if not winner:
        await update.message.reply_text("Aucun participant à tirer.")
        return
    seed_info = f"seed={seed}" if seed is not None else "seed=aléatoire (non fixé)"
    await update.message.reply_text(
        f"Gagnant: @{winner.username}\n{seed_info}\n"
        f"Première mention: {winner.first_mentioned_at.isoformat()}"
    )


async def cmd_clear(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.effective_user or not _is_admin(update.effective_user.id):
        return
    uid = update.effective_user.id
    _pending_clear_until[uid] = time.monotonic() + 120.0
    kb = InlineKeyboardMarkup(
        [
            [
                InlineKeyboardButton("Confirmer suppression", callback_data="c:y"),
                InlineKeyboardButton("Annuler", callback_data="c:n"),
            ]
        ]
    )
    await update.message.reply_text(
        "Vider toute la liste des participants ? Cette action est irréversible.",
        reply_markup=kb,
    )


async def cmd_stats(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.effective_user or not _is_admin(update.effective_user.id):
        return
    async with get_session_factory()() as session:
        total = await count_participants(session)
        recent = await recent_first_mentions(session, 5)
    lines = [f"Nombre de participants: {total}", "", "Derniers ajouts (première mention):"]
    if not recent:
        lines.append("—")
    else:
        for p in recent:
            lines.append(f"@{p.username} — {p.first_mentioned_at.isoformat()}")
    await update.message.reply_text("\n".join(lines))


async def cmd_export(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not get_settings().enable_csv_export_command:
        return
    if not update.effective_user or not _is_admin(update.effective_user.id):
        return
    async with get_session_factory()() as session:
        rows = await list_participants_ordered(session)
    csv_text = participants_to_csv_rows(rows)
    bio = BytesIO(csv_text.encode("utf-8"))
    await update.message.reply_document(
        document=InputFile(bio, filename="participants.csv"),
        caption="Export CSV participants",
    )


async def on_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    q = update.callback_query
    if not q or not q.data or not update.effective_user:
        return
    if not _is_admin(update.effective_user.id):
        await q.answer("Non autorisé", show_alert=True)
        return
    data = q.data
    if data.startswith("p:"):
        try:
            page = int(data.split(":", 1)[1])
        except ValueError:
            await q.answer()
            return
        await q.answer()
        async with get_session_factory()() as session:
            total = await count_participants(session)
        total_pages = max(1, (total + PAGE_SIZE - 1) // PAGE_SIZE)
        page = max(0, min(page, total_pages - 1))
        offset = page * PAGE_SIZE
        async with get_session_factory()() as session:
            rows = await list_participants_page(session, offset, PAGE_SIZE)
        lines = [f"Participants: {total} (page {page + 1}/{total_pages})", ""]
        for i, p in enumerate(rows, start=offset + 1):
            lines.append(f"{i}. @{p.username} — {p.first_mentioned_at.isoformat()}")
        keyboard = []
        nav = []
        if page > 0:
            nav.append(InlineKeyboardButton("◀", callback_data=f"p:{page - 1}"))
        if page < total_pages - 1:
            nav.append(InlineKeyboardButton("▶", callback_data=f"p:{page + 1}"))
        if nav:
            keyboard.append(nav)
        await q.edit_message_text(
            text="\n".join(lines),
            reply_markup=InlineKeyboardMarkup(keyboard) if keyboard else None,
        )
        return

    if data == "c:y":
        uid = update.effective_user.id
        until = _pending_clear_until.get(uid)
        if until is None or time.monotonic() > until:
            await q.answer("Confirmation expirée — relance /clear", show_alert=True)
            return
        _pending_clear_until.pop(uid, None)
        async with get_session_factory()() as session:
            n = await clear_participants(session)
        await q.answer()
        await q.edit_message_text(text=f"Liste vidée ({n} entrées supprimées).")
        return

    if data == "c:n":
        _pending_clear_until.pop(update.effective_user.id, None)
        await q.answer()
        await q.edit_message_text(text="Annulé — la liste n'a pas été modifiée.")
        return

    await q.answer()


def wire_bot_reference(application: Application) -> None:
    set_bot(application.bot)
