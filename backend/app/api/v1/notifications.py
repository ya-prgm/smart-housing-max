from fastapi import APIRouter, Depends
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.notification import Notification
from app.schemas.notification import NotificationResponse
from app.schemas.common import StatusResponse

router = APIRouter()


@router.get("", response_model=list[NotificationResponse])
async def get_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.id.desc())
    )
    res = await db.execute(stmt)
    notifications = res.scalars().all()

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
            time_formatted=n.created_at.strftime("%d %b, %H:%M"),
        )
        for n in notifications
    ]


@router.post("/mark-all-read", response_model=StatusResponse)
async def mark_all_read(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        update(Notification)
        .where(Notification.user_id == current_user.id, Notification.is_read == False)
        .values(is_read=True)
    )
    await db.execute(stmt)
    await db.commit()
    return StatusResponse(status="ok", message="Все уведомления прочитаны")