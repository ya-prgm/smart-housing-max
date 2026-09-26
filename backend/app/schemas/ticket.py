from datetime import datetime
from pydantic import BaseModel
from app.schemas.common import BaseSchema
from app.schemas.topic import RecipientItem
from app.core.constants import TicketStatus, TicketPriority


class TicketCreate(BaseModel):
    topic_code: str
    title: str
    description: str
    recipient_codes: list[str] = []
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
    size: int
    mime_type: str


class TicketResponse(BaseSchema):
    id: int
    code: str
    category: str
    topic_code: str
    topic_title: str
    title: str
    description: str
    status: TicketStatus
    priority: TicketPriority
    created_at: datetime
    resolved_at: datetime | None = None
    is_my: bool
    votes_count: int
    is_voted: bool
    recipients: list[RecipientItem] = []
    house_address: str
    author_full_name: str | None = None
    attachments: list[TicketAttachmentResponse] = []