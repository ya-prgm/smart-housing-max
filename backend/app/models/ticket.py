import enum
from sqlalchemy import String, Text, ForeignKey, Boolean, Integer, Enum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, SoftDeleteMixin


class TicketStatus(str, enum.Enum):
    ACTIVE = "active"             # Активно
    IN_PROGRESS = "in_progress"   # В работе
    COMPLETED = "completed"       # Выполнено
    REJECTED = "rejected"         # Отклонено


class TicketPriority(str, enum.Enum):
    NORMAL = "normal"             # Обычный
    HIGH = "high"                 # Высокий
    EMERGENCY = "emergency"       # Аварийный


class Ticket(Base, TimestampMixin, SoftDeleteMixin):
    """Обращение в УК или Председателю МКД"""
    __tablename__ = "tickets"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)  # "#4812"
    
    house_id: Mapped[int] = mapped_column(ForeignKey("houses.id", ondelete="CASCADE"), nullable=False, index=True)
    apartment_id: Mapped[int] = mapped_column(ForeignKey("apartments.id", ondelete="CASCADE"), nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    recipient_type: Mapped[str] = mapped_column(String(50), default="uk", nullable=False)  # "uk" | "chairman" | "rso"
    recipient_name: Mapped[str] = mapped_column(String(255), default="ООО «ЖилКомФорт»", nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)  # "Сантехника"
    topic_code: Mapped[str] = mapped_column(String(20), default="2.16", nullable=False)  # "2.16"
    title: Mapped[str] = mapped_column(String(255), nullable=False)  # "Капает стояк ГВС на кухне"
    description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[TicketStatus] = mapped_column(
        Enum(TicketStatus, name="ticket_status_enum"),
        default=TicketStatus.ACTIVE,
        nullable=False,
        index=True,
    )
    priority: Mapped[TicketPriority] = mapped_column(
        Enum(TicketPriority, name="ticket_priority_enum"),
        default=TicketPriority.NORMAL,
        nullable=False,
    )
    resolved_label: Mapped[str | None] = mapped_column(String(100), nullable=True)  # "Решено УК • 19 чел"
    is_public_in_feed: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    supports: Mapped[list["TicketSupport"]] = relationship(back_populates="ticket", cascade="all, delete-orphan")
    attachments: Mapped[list["TicketAttachment"]] = relationship(back_populates="ticket", cascade="all, delete-orphan")


class TicketSupport(Base, TimestampMixin):
    """Голоса «У меня тоже» (Строго 1 голос от 1 жителя за 1 заявку)"""
    __tablename__ = "ticket_supports"
    __table_args__ = (UniqueConstraint("ticket_id", "user_id", name="uq_ticket_user_support"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ticket_id: Mapped[int] = mapped_column(ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    ticket: Mapped["Ticket"] = relationship(back_populates="supports")


class TicketAttachment(Base):
    """Прикрепленные к заявке фото/акты"""
    __tablename__ = "ticket_attachments"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ticket_id: Mapped[int] = mapped_column(ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False, index=True)
    file_url: Mapped[str] = mapped_column(String(1024), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)  # "стояк_ванная.jpg"
    mime_type: Mapped[str] = mapped_column(String(100), default="image/jpeg", nullable=False)

    ticket: Mapped["Ticket"] = relationship(back_populates="attachments")