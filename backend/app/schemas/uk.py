from datetime import datetime
from pydantic import BaseModel
from app.schemas.common import BaseSchema
from app.core.constants import UserRole, TicketStatus, PollQuestionType


class RecentActivityItem(BaseModel):
    type: str
    house_address: str
    title: str
    created_at: datetime


class UkDashboardResponse(BaseSchema):
    total_houses: int
    total_apartments: int
    total_residents_in_app: int
    active_tickets: int
    active_polls: int
    new_posts_today: int
    tickets_by_status: dict[str, int]
    recent_activity: list[RecentActivityItem]


class ResidentResponse(BaseSchema):
    id: int
    max_user_id: int
    full_name: str
    role: UserRole
    house_address: str
    apartment_number: str
    personal_account: str
    registered_at: datetime
    last_active_at: datetime | None = None


class ResidentUpdateRequest(BaseModel):
    role: UserRole
    house_id: int
    apartment_id: int


class TicketStatusUpdateRequest(BaseModel):
    status: TicketStatus
    comment: str | None = None


class UkFeedPostCreate(BaseModel):
    house_id: int
    title: str | None = None
    content: str
    image_id: int | None = None
    image_label: str | None = None


class UkPollOptionCreate(BaseModel):
    option_text: str
    subtext: str | None = None


class UkPollQuestionCreate(BaseModel):
    question_text: str
    subtext: str | None = None
    question_type: PollQuestionType
    options: list[UkPollOptionCreate] = []


class UkPollCreate(BaseModel):
    house_id: int
    title: str
    description: str
    deadline: datetime
    questions: list[UkPollQuestionCreate]


class JournalEventResponse(BaseSchema):
    id: int
    action: str
    entity_type: str
    entity_id: int | None
    user_name: str | None
    house_address: str | None
    details: dict | None
    created_at: datetime