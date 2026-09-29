from datetime import datetime
from pydantic import BaseModel
from app.schemas.common import BaseSchema
from app.schemas.feed import PostAuthor
from app.core.constants import PollStatus, PollQuestionType


class PollAnswerSubmission(BaseModel):
    question_id: int
    selected_option_id: int | None = None
    selected_option_ids: list[int] | None = None
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
    author: PostAuthor
    title: str
    description: str
    image_url: str | None = None
    status: PollStatus
    created_at: datetime
    deadline: datetime | None = None
    deadline_text: str | None = None
    estimated_time: str | None = None
    protocol_number: str | None = None
    total_questions: int
    is_completed_by_me: bool
    questions: list[PollQuestionResponse] = []


class PollCardResponse(BaseSchema):
    id: int
    author: PostAuthor
    status: PollStatus
    title: str
    description: str
    created_at: datetime
    deadline: datetime | None = None
    deadline_text: str | None = None
    estimated_time: str | None = None
    questions_count: int
    participants_count: int
    is_completed: bool


# -------- Chairman: Create Poll --------

class PollOptionCreate(BaseModel):
    option_text: str
    subtext: str | None = None


class PollQuestionCreate(BaseModel):
    question_text: str
    subtext: str | None = None
    question_type: PollQuestionType = PollQuestionType.SINGLE_CHOICE
    options: list[PollOptionCreate] = []


class PollCreate(BaseModel):
    title: str
    description: str
    deadline_text: str = "До 31 октября"
    estimated_time: str = "~3 мин"
    protocol_number: str | None = None
    questions: list[PollQuestionCreate]


# -------- Chairman: Poll Results --------

class PollOptionResult(BaseSchema):
    id: int
    option_text: str
    votes: int
    percent: float


class PollQuestionResult(BaseSchema):
    id: int
    question_text: str
    question_type: PollQuestionType
    total_answers: int
    options: list[PollOptionResult] = []
    text_answers: list[str] = []


class PollResultsResponse(BaseSchema):
    id: int
    title: str
    description: str
    status: PollStatus
    total_participants: int
    questions: list[PollQuestionResult] = []