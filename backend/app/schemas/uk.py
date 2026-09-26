from datetime import datetime
from pydantic import BaseModel
from app.schemas.common import BaseSchema
from app.core.constants import (
    UserRole,
    TicketStatus,
    PollQuestionType,
    PollStatus,
    JournalAction,
    JournalEntityType,
    PostType,
    ActivityType,
)


class TicketsByStatus(BaseModel):
    active: int = 0
    in_progress: int = 0
    completed: int = 0
    rejected: int = 0


class RecentActivityItem(BaseModel):
    type: ActivityType
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
    tickets_by_status: TicketsByStatus
    recent_activity: list[RecentActivityItem]


class ResidentResponse(BaseSchema):
    id: int
    max_user_id: int
    full_name: str
    role: UserRole
    house_address: str | None = None
    apartment_number: str | None = None
    personal_account: str | None = None
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
    post_type: PostType = PostType.ANNOUNCEMENT
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


class UkPollUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    deadline: datetime | None = None


class UkPollStatusUpdate(BaseModel):
    status: PollStatus


class JournalEventResponse(BaseSchema):
    id: int
    action: JournalAction
    entity_type: JournalEntityType
    entity_id: int | None = None
    user_name: str | None = None
    house_address: str | None = None
    details: dict | None = None
    created_at: datetime


class UkDocumentResponse(BaseSchema):
    id: int
    house_id: int
    house_address: str
    title: str
    file_url: str
    size: int
    mime_type: str
    created_at: datetime


class UkDocumentCreate(BaseModel):
    house_id: int
    title: str
    file_id: int