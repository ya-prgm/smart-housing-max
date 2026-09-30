from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.notification_repo import NotificationRepository
from app.models.notification import Notification
from app.models.user import User
from app.core.constants import NotificationCategory
from app.schemas.notification import NotificationResponse
from app.bot.client import bot_client
from app.utils.formatters import format_russian_datetime


class NotificationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = NotificationRepository(db)

    async def get_user_notifications(self, user_id: int, limit: int = 50, offset: int = 0) -> list[NotificationResponse]:
        items = await self.repo.get_user_notifications(user_id=user_id, limit=limit, offset=offset)
        return [
            NotificationResponse(
                id=n.id,
                category=n.category.value,
                author_name=n.author_name,
                author_badge=n.author_badge,
                title=n.title,
                text=n.text,
                is_read=n.is_read,
                action_url=n.action_url,
                created_at=n.created_at,
                time_formatted=format_russian_datetime(n.created_at),
            )
            for n in items
        ]

    async def mark_all_read(self, user_id: int) -> int:
        count = await self.repo.mark_all_read(user_id)
        await self.db.commit()
        return count

    async def mark_read(self, notification_id: int, user_id: int) -> bool:
        res = await self.repo.mark_read(notification_id, user_id)
        await self.db.commit()
        return res

    async def get_unread_count(self, user_id: int) -> int:
        return await self.repo.get_unread_count(user_id)

    async def send_test_notification(self, user: User, custom_text: str | None = None) -> bool:
        text = custom_text or "Тестовое уведомление из сервиса «Мой Дом»! Интеграция с ботом работает корректно."
        notif = Notification(
            user_id=user.id,
            category=NotificationCategory.SYSTEM,
            author_name="Сервис «Мой Дом»",
            author_badge="Система",
            title="Тестовое уведомление",
            text=text,
            is_read=False,
            action_url="/notifications",
        )
        self.db.add(notif)
        await self.db.commit()

        if user.max_user_id and bot_client.is_configured:
            await bot_client.send_message(
                user_id=user.max_user_id,
                text=f"🔔 **Тестовое уведомление**\n\n{text}",
                attachments=[bot_client._build_app_button("🏠 Открыть «Мой Дом»")],
            )
            return True
        return False
