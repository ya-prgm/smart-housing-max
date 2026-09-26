from __future__ import annotations
from sqlalchemy import String, Text, ForeignKey, Boolean, Integer, Enum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, SoftDeleteMixin
from app.core.constants import PollQuestionType, QuestionType, PollStatus


class Poll(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "polls"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    house_id: Mapped[int] = mapped_column(ForeignKey("houses.id", ondelete="CASCADE"), nullable=False, index=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    author_role_badge: Mapped[str] = mapped_column(String(50), default="Председатель ТСЖ", nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    
    status: Mapped[PollStatus] = mapped_column(
        Enum(PollStatus, name="poll_status_enum"),
        default=PollStatus.ACTIVE,
        nullable=False,
    )
    estimated_time: Mapped[str] = mapped_column(String(50), default="~3 мин", nullable=False)
    deadline_text: Mapped[str] = mapped_column(String(50), default="До 25 мая", nullable=False)
    protocol_number: Mapped[str | None] = mapped_column(String(50), default="№ 48-ОСС", nullable=True)

    questions: Mapped[list[PollQuestion]] = relationship("PollQuestion", back_populates="poll", cascade="all, delete-orphan")
    responses: Mapped[list[PollResponse]] = relationship("PollResponse", back_populates="poll", cascade="all, delete-orphan")


class PollQuestion(Base):
    __tablename__ = "poll_questions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    poll_id: Mapped[int] = mapped_column(ForeignKey("polls.id", ondelete="CASCADE"), nullable=False, index=True)
    
    order_num: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    subtext: Mapped[str | None] = mapped_column(Text, nullable=True)
    question_type: Mapped[PollQuestionType] = mapped_column(Enum(PollQuestionType, name="question_type_enum"), nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)

    poll: Mapped[Poll] = relationship("Poll", back_populates="questions")
    options: Mapped[list[PollOption]] = relationship("PollOption", back_populates="question", cascade="all, delete-orphan")


class PollOption(Base):
    __tablename__ = "poll_options"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    question_id: Mapped[int] = mapped_column(ForeignKey("poll_questions.id", ondelete="CASCADE"), nullable=False, index=True)
    
    order_num: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    option_text: Mapped[str] = mapped_column(String(255), nullable=False)
    subtext: Mapped[str | None] = mapped_column(Text, nullable=True)

    question: Mapped[PollQuestion] = relationship("PollQuestion", back_populates="options")


class PollResponse(Base, TimestampMixin):
    __tablename__ = "poll_responses"
    __table_args__ = (UniqueConstraint("poll_id", "user_id", name="uq_poll_user_response"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    poll_id: Mapped[int] = mapped_column(ForeignKey("polls.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    apartment_id: Mapped[int] = mapped_column(ForeignKey("apartments.id", ondelete="CASCADE"), nullable=False)
    
    signature_hash: Mapped[str] = mapped_column(String(64), nullable=False)

    poll: Mapped[Poll] = relationship("Poll", back_populates="responses")
    answers: Mapped[list[PollResponseAnswer]] = relationship("PollResponseAnswer", cascade="all, delete-orphan")


class PollResponseAnswer(Base):
    __tablename__ = "poll_response_answers"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    response_id: Mapped[int] = mapped_column(ForeignKey("poll_responses.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id: Mapped[int] = mapped_column(ForeignKey("poll_questions.id", ondelete="CASCADE"), nullable=False)
    selected_option_id: Mapped[int | None] = mapped_column(ForeignKey("poll_options.id", ondelete="CASCADE"), nullable=True)
    text_answer: Mapped[str | None] = mapped_column(Text, nullable=True)