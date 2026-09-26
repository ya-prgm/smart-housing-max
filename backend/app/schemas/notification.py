from datetime import datetime
from app.schemas.common import BaseSchema


class NotificationResponse(BaseSchema):
    id: int
    category: str
    author_name: str
    author_badge: str | None = None
    title: str
    text: str
    is_read: bool
    action_url: str | None = None
    time_formatted: str