import logging
from typing import Any
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.bot.client import bot_client

logger = logging.getLogger(__name__)


async def _bind_user_id_if_needed(max_user_id: int, db: AsyncSession, force_role: str | None = None) -> User | None:
    stmt = select(User).where(User.max_user_id == max_user_id).options(selectinload(User.apartments), selectinload(User.pin))
    user = (await db.execute(stmt)).scalars().first()
    if user and not force_role and (user.apartments or user.esia_access_token):
        return user

    target_id = 2 if force_role == "chairman" else 1
    target = (await db.execute(
        select(User).where(User.id == target_id).options(selectinload(User.apartments), selectinload(User.pin))
    )).scalars().first()
    if target:
        if user and user.id != target.id:
            user.max_user_id = 900000000 + user.id
            await db.flush()
        target.max_user_id = max_user_id
        await db.commit()
        return target

    return user


async def handle_bot_update(update_data: dict[str, Any], db: AsyncSession) -> dict[str, Any]:
    update_type = update_data.get("update_type")
    logger.info("Received MAX bot update: %s", update_type)

    if update_type == "bot_started":
        user_info = update_data.get("user") or {}
        max_user_id = user_info.get("user_id")
        first_name = user_info.get("first_name", "")
        if max_user_id:
            await _bind_user_id_if_needed(max_user_id, db)
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
            await _bind_user_id_if_needed(max_user_id, db)
            await bot_client.send_start_welcome(user_id=max_user_id, user_name=first_name)
        elif cmd in ("/help", "помощь", "справка"):
            await bot_client.send_help(user_id=max_user_id)
        elif cmd in ("/app", "приложение", "открыть"):
            await bot_client.send_start_welcome(user_id=max_user_id, user_name=first_name)
        elif cmd in ("/link_resident", "/resident"):
            user = await _bind_user_id_if_needed(max_user_id, db, force_role="resident")
            msg_text = f"✅ Ваш MAX аккаунт привязан к жителю: {user.full_name} (кв. 48, ул. Баумана, д. 12). Сюда будут приходить уведомления о публикациях, опросах и заявках." if user else "Ошибка привязки"
            await bot_client.send_message(user_id=max_user_id, text=msg_text)
        elif cmd in ("/link_chairman", "/chairman"):
            user = await _bind_user_id_if_needed(max_user_id, db, force_role="chairman")
            msg_text = f"✅ Ваш MAX аккаунт привязан к председателю: {user.full_name} (ул. Баумана, д. 12). Сюда будут приходить системные уведомления и отчеты." if user else "Ошибка привязки"
            await bot_client.send_message(user_id=max_user_id, text=msg_text)
        elif cmd in ("/whoami", "/status", "/профиль"):
            stmt = select(User).where(User.max_user_id == max_user_id)
            user = (await db.execute(stmt)).scalars().first()
            if user:
                role_label = "Председатель" if user.role.value == "chairman" else "Житель"
                msg_text = f"👤 **Ваш профиль в «Мой Дом»:**\n\n• Имя: **{user.full_name}**\n• Роль: **{role_label}**\n• MAX ID: `{max_user_id}`\n• Уведомления: {'Включены' if user.notifications_enabled else 'Отключены'}"
            else:
                msg_text = f"Учетная запись для MAX ID `{max_user_id}` еще не привязана. Напишите `/link_resident` или откройте мини-приложение."
            await bot_client.send_message(user_id=max_user_id, text=msg_text)
        else:
            await _bind_user_id_if_needed(max_user_id, db)
            fallback_text = (
                f"Здравствуйте{f', {first_name}' if first_name else ''}!\n\n"
                f"Сервис «Мой Дом» работает как мини-приложение внутри MAX. "
                f"Для управления обращениями, голосованиями и просмотра дома нажмите кнопку ниже:"
            )
            attachments = [bot_client._build_app_button("🏠 Открыть «Мой Дом»")]
            await bot_client.send_message(user_id=max_user_id, text=fallback_text, attachments=attachments)

        return {"status": "ok", "handled": "message_created"}

    return {"status": "ok", "unhandled_type": update_type}
