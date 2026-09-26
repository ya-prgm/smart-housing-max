from datetime import datetime
from pydantic import BaseModel
from app.schemas.common import BaseSchema


class TicketCreate(BaseModel):
    house_id: int
    recipient_type: str = "uk"
    recipient_name: str = "ООО «ЖилКомФорт»"
    category: str = "Сантехника"
    topic_code: str = "2.16"
    title: str
    description: str
    is_public_in_feed: bool = True
    attachment_urls: list[str] = []


class TicketSupportResponse(BaseSchema):
    ticket_id: int
    votes_count: int
    is_supported_by_me: bool


class TicketResponse(BaseSchema):
    id: int
    code: str
    category: str
    title: str
    description: str
    status: str
    priority: str
    created_at: datetime
    date_formatted: str
    is_my: bool
    votes_count: int
    is_voted: bool
    resolved_label: str | None = None
    recipient_name: str