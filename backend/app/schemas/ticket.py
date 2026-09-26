from datetime import datetime
from pydantic import BaseModel
from app.schemas.common import BaseSchema
from app.core.constants import TicketStatus, TicketPriority, RecipientType


class TicketCreate(BaseModel):
    recipient_type: RecipientType = RecipientType.UK
    recipient_name: str = "ООО «ЖилКомФорт»"
    category: str = "Сантехника"
    topic_code: str = "2.16"
    title: str
    description: str
    is_public_in_feed: bool = True
    attachment_ids: list[int] = []


class TicketSupportResponse(BaseSchema):
    ticket_id: int
    votes_count: int
    is_supported_by_me: bool


class TicketAttachmentResponse(BaseSchema):
    id: int
    url: str
    filename: str


class TicketResponse(BaseSchema):
    id: int
    code: str
    category: str
    title: str
    description: str
    status: TicketStatus
    priority: TicketPriority
    created_at: datetime
    is_my: bool
    votes_count: int
    is_voted: bool
    recipient_name: str
    house_address: str | None = None
    author_full_name: str | None = None
    attachments: list[TicketAttachmentResponse] = []