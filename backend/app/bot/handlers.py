import logging
from typing import Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.bot.client import bot_client

logger = logging.getLogger(__name__)


async def handle_bot_update(update_data: dict[str, Any], db: AsyncSession) -> dict[str, Any]:
    update_type = update_data.get("update_type")
    logger.info("Received MAX bot update: %s", update_type)

    if update_type == "bot_started":
        user_info = update_data.get("user") or {}
        max_user_id = user_info.get("user_id")
        first_name = user_info.get("first_name", "")
        if max_user_id:
            await bot_client.send_start_welcome(user_id=max_user_id, user_name=first_name)
        return {"status": "ok", "handled": "bot_started"}

    if update_type == "message_created":
        msg = update_data.get("message") or {}
        sender = msg.get("sender") or {}
        max_user_id = sender.get("user_id")
        body = msg.get("body") or {}
        text = (body.get("text") or "").strip()
        first_name = sender.get("first_name", "")

        if not max_user_id:
            return {"status": "ok", "ignored": "no_sender_id"}

        cmd = text.lower()
        if cmd in ("/start", "старт", "начать"):
            await bot_client.send_start_welcome(user_id=max_user_id, user_name=first_name)
        elif cmd in ("/help", "помощь", "справка"):
            await bot_client.send_help(user_id=max_user_id)
        elif cmd in ("/app", "приложение", "открыть"):
            await bot_client.send_start_welcome(user_id=max_user_id, user_name=first_name)
        else:
            fallback_text = (
                f"Здравствуйте{f', {first_name}' if first_name else ''}!\n\n"
                f"Сервис «Мой Дом» работает как мини-приложение внутри MAX. "
                f"Для управления обращениями, голосованиями и просмотра дома нажмите кнопку ниже:"
            )
            attachments = [bot_client._build_app_button("🏠 Открыть «Мой Дом»")]
            await bot_client.send_message(user_id=max_user_id, text=fallback_text, attachments=attachments)

        return {"status": "ok", "handled": "message_created"}

    return {"status": "ok", "unhandled_type": update_type}
