from datetime import datetime
from app.schemas.common import BaseSchema
from app.core.constants import NotificationCategory


class NotificationResponse(BaseSchema):
    id: int
    category: NotificationCategory
    author_name: str
    author_badge: str | None = None
    title: str
    text: str
    is_read: bool
    action_url: str | None = None
    created_at: datetime