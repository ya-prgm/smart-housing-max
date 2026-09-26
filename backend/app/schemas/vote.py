from datetime import datetime
from pydantic import BaseModel
from app.schemas.common import BaseSchema
from app.core.constants import PollStatus, PollQuestionType


class PollAnswerSubmission(BaseModel):
    question_id: int
    selected_option_id: int | None = None
    text_answer: str | None = None


class PollSubmitRequest(BaseModel):
    answers: list[PollAnswerSubmission]


class PollOptionResponse(BaseSchema):
    id: int
    order_num: int
    option_text: str
    subtext: str | None = None


class PollQuestionResponse(BaseSchema):
    id: int
    order_num: int
    question_text: str
    subtext: str | None = None
    question_type: PollQuestionType
    image_url: str | None = None
    options: list[PollOptionResponse] = []


class PollDetailResponse(BaseSchema):
    id: int
    author_role_badge: str
    title: str
    description: str
    image_url: str | None = None
    status: PollStatus
    created_at: datetime
    deadline: datetime | None = None
    protocol_number: str | None = None
    total_questions: int
    is_completed_by_me: bool
    questions: list[PollQuestionResponse] = []


class PollCardResponse(BaseSchema):
    id: int
    author_title: str
    status: PollStatus
    title: str
    description: str
    created_at: datetime
    deadline: datetime | None = None
    questions_count: int
    participants_count: int
    is_completed: bool