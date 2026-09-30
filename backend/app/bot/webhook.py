import logging
from typing import Any
from fastapi import APIRouter, Depends, Body, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.core.config import settings
from app.api.deps import get_current_user
from app.models.user import User
from app.bot.client import bot_client
from app.bot.handlers import handle_bot_update
from app.services.notification_service import NotificationService

logger = logging.getLogger(__name__)

router = APIRouter()


class WebhookSetupRequest(BaseModel):
    webhook_url: str | None = None


class TestNotificationRequest(BaseModel):
    message: str | None = None


@router.post("/webhook")
async def receive_max_webhook(
    update_data: dict[str, Any] = Body(...),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await handle_bot_update(update_data, db)
    except Exception as exc:
        logger.exception("Error processing webhook: %s", exc)
        return {"status": "error", "detail": str(exc)}


@router.get("/info")
async def get_bot_status():
    bot_info = None
    if bot_client.is_configured:
        bot_info = await bot_client.get_me()

    return {
        "is_configured": bot_client.is_configured,
        "api_url": bot_client.api_url,
        "app_url": bot_client.app_url,
        "bot_info": bot_info,
    }


@router.post("/setup")
async def setup_bot(
    payload: WebhookSetupRequest | None = None,
    current_user: User = Depends(get_current_user),
):
    if not bot_client.is_configured:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="MAX_BOT_TOKEN не задан в переменных окружения",
        )

    commands_res = await bot_client.set_commands()

    webhook_res = None
    url = (payload.webhook_url if payload and payload.webhook_url else f"{settings.APP_URL}/api/v1/bot/webhook")
    webhook_res = await bot_client.set_webhook(url)

    return {
        "status": "ok",
        "commands": commands_res,
        "webhook": webhook_res,
        "webhook_url": url,
    }


@router.delete("/webhook")
async def delete_bot_webhook(
    webhook_url: str | None = Query(default=None),
    current_user: User = Depends(get_current_user),
):
    if not bot_client.is_configured:
        raise HTTPException(status_code=400, detail="MAX_BOT_TOKEN не задан")

    url = webhook_url or f"{settings.APP_URL}/api/v1/bot/webhook"
    res = await bot_client.delete_webhook(url)
    return {"status": "ok", "result": res}


@router.post("/test-notification")
async def send_test_notification(
    payload: TestNotificationRequest | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = NotificationService(db)
    custom_msg = payload.message if payload else None
    sent_to_bot = await service.send_test_notification(current_user, custom_msg)
    return {
        "status": "ok",
        "saved_to_db": True,
        "sent_to_bot": sent_to_bot,
        "max_user_id": current_user.max_user_id,
        "bot_configured": bot_client.is_configured,
    }
