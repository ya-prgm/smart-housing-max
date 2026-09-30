from typing import Sequence
from sqlalchemy import select, update, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification
from app.repositories.base import BaseRepository


class NotificationRepository(BaseRepository[Notification]):
    def __init__(self, db: AsyncSession):
        super().__init__(Notification, db)

    async def get_user_notifications(self, user_id: int, limit: int = 50, offset: int = 0) -> Sequence[Notification]:
        stmt = (
            select(Notification)
            .where(Notification.user_id == user_id)
            .order_by(Notification.id.desc())
            .limit(limit)
            .offset(offset)
        )
        res = await self.db.execute(stmt)
        return res.scalars().all()

    async def get_unread_count(self, user_id: int) -> int:
        stmt = (
            select(func.count(Notification.id))
            .where(Notification.user_id == user_id, Notification.is_read == False)
        )
        return (await self.db.execute(stmt)).scalar() or 0

    async def mark_all_read(self, user_id: int) -> int:
        stmt = (
            update(Notification)
            .where(Notification.user_id == user_id, Notification.is_read == False)
            .values(is_read=True)
        )
        res = await self.db.execute(stmt)
        await self.db.flush()
        return res.rowcount

    async def mark_read(self, notification_id: int, user_id: int) -> bool:
        stmt = (
            update(Notification)
            .where(Notification.id == notification_id, Notification.user_id == user_id)
            .values(is_read=True)
        )
        res = await self.db.execute(stmt)
        await self.db.flush()
        return res.rowcount > 0

    async def bulk_create(self, notifications: list[Notification]) -> None:
        self.db.add_all(notifications)
        await self.db.flush()
