import enum
from sqlalchemy import String, Text, ForeignKey, Boolean, Integer, Enum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, SoftDeleteMixin


class QuestionType(str, enum.Enum):
    SINGLE = "single"      # Один вариант (радио)
    MULTIPLE = "multiple"  # Несколько вариантов (чекбоксы)
    TEXT = "text"          # Открытый текст


class PollStatus(str, enum.Enum):
    ACTIVE = "active"        # Активен
    COMPLETED = "completed"  # Завершен
    ARCHIVED = "archived"    # В архиве


class Poll(Base, TimestampMixin, SoftDeleteMixin):
    """Опрос дома (Голосование ОСС)"""
    __tablename__ = "polls"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    house_id: Mapped[int] = mapped_column(ForeignKey("houses.id", ondelete="CASCADE"), nullable=False, index=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    author_role_badge: Mapped[str] = mapped_column(String(50), default="Председатель ТСЖ", nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)  # "Установка шлагбаума и видеонаблюдения"
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

    questions: Mapped[list["PollQuestion"]] = relationship(back_populates="poll", cascade="all, delete-orphan")
    responses: Mapped[list["PollResponse"]] = relationship(back_populates="poll", cascade="all, delete-orphan")


class PollQuestion(Base):
    """Вопрос в опросе"""
    __tablename__ = "poll_questions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    poll_id: Mapped[int] = mapped_column(ForeignKey("polls.id", ondelete="CASCADE"), nullable=False, index=True)
    
    order_num: Mapped[int] = mapped_column(Integer, default=1, nullable=False)  # 1 из 4
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    subtext: Mapped[str | None] = mapped_column(Text, nullable=True)
    question_type: Mapped[QuestionType] = mapped_column(Enum(QuestionType, name="question_type_enum"), nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)

    poll: Mapped["Poll"] = relationship(back_populates="questions")
    options: Mapped[list["PollOption"]] = relationship(back_populates="question", cascade="all, delete-orphan")


class PollOption(Base):
    """Вариант ответа к вопросу"""
    __tablename__ = "poll_options"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    question_id: Mapped[int] = mapped_column(ForeignKey("poll_questions.id", ondelete="CASCADE"), nullable=False, index=True)
    
    order_num: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    option_text: Mapped[str] = mapped_column(String(255), nullable=False)  # "Да, полностью поддерживаю"
    subtext: Mapped[str | None] = mapped_column(Text, nullable=True)

    question: Mapped["PollQuestion"] = relationship(back_populates="options")


class PollResponse(Base, TimestampMixin):
    """Фиксация участия жителя в опросе с электронной подписью ПЭП"""
    __tablename__ = "poll_responses"
    __table_args__ = (UniqueConstraint("poll_id", "user_id", name="uq_poll_user_response"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    poll_id: Mapped[int] = mapped_column(ForeignKey("polls.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    apartment_id: Mapped[int] = mapped_column(ForeignKey("apartments.id", ondelete="CASCADE"), nullable=False)
    
    signature_hash: Mapped[str] = mapped_column(String(64), nullable=False)  # Хеш ПЭП для протокола

    poll: Mapped["Poll"] = relationship(back_populates="responses")
    answers: Mapped[list["PollResponseAnswer"]] = relationship(cascade="all, delete-orphan")


class PollResponseAnswer(Base):
    """Конкретный ответ на вопрос"""
    __tablename__ = "poll_response_answers"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    response_id: Mapped[int] = mapped_column(ForeignKey("poll_responses.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id: Mapped[int] = mapped_column(ForeignKey("poll_questions.id", ondelete="CASCADE"), nullable=False)
    selected_option_id: Mapped[int | None] = mapped_column(ForeignKey("poll_options.id", ondelete="CASCADE"), nullable=True)
    text_answer: Mapped[str | None] = mapped_column(Text, nullable=True)