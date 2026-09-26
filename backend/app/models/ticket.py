from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy import String, Text, ForeignKey, Boolean, Enum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, SoftDeleteMixin
from app.models.topic import ticket_recipient_map, TicketRecipient, TicketTopic
from app.core.constants import TicketStatus, TicketPriority

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.house import House
    from app.models.file import File


class Ticket(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "tickets"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    
    house_id: Mapped[int] = mapped_column(ForeignKey("houses.id", ondelete="CASCADE"), nullable=False, index=True)
    apartment_id: Mapped[int] = mapped_column(ForeignKey("apartments.id", ondelete="CASCADE"), nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id: Mapped[int] = mapped_column(ForeignKey("ticket_topics.id", ondelete="RESTRICT"), nullable=False, index=True)
    
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    
    status: Mapped[TicketStatus] = mapped_column(
        Enum(TicketStatus, name="ticket_status_enum"),
        default=TicketStatus.ACTIVE,
        nullable=False,
        index=True,
    )
    priority: Mapped[TicketPriority] = mapped_column(
        Enum(TicketPriority, name="ticket_priority_enum"),
        default=TicketPriority.MEDIUM,
        nullable=False,
    )
    is_public_in_feed: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    house: Mapped[House] = relationship()
    author: Mapped[User] = relationship()
    topic: Mapped[TicketTopic] = relationship()
    recipients: Mapped[list[TicketRecipient]] = relationship(secondary=ticket_recipient_map)
    supports: Mapped[list[TicketSupport]] = relationship(back_populates="ticket", cascade="all, delete-orphan")
    attachments: Mapped[list[TicketAttachment]] = relationship(back_populates="ticket", cascade="all, delete-orphan")
    history: Mapped[list[TicketStatusHistory]] = relationship(back_populates="ticket", cascade="all, delete-orphan")


class TicketSupport(Base, TimestampMixin):
    __tablename__ = "ticket_supports"
    __table_args__ = (UniqueConstraint("ticket_id", "user_id", name="uq_ticket_user_support"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ticket_id: Mapped[int] = mapped_column(ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    ticket: Mapped[Ticket] = relationship(back_populates="supports")


class TicketAttachment(Base):
    __tablename__ = "ticket_attachments"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ticket_id: Mapped[int] = mapped_column(ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False, index=True)
    file_id: Mapped[int] = mapped_column(ForeignKey("files.id", ondelete="CASCADE"), nullable=False)

    ticket: Mapped[Ticket] = relationship(back_populates="attachments")
    file: Mapped[File] = relationship()


class TicketStatusHistory(Base, TimestampMixin):
    __tablename__ = "ticket_status_history"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ticket_id: Mapped[int] = mapped_column(ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False, index=True)
    changed_by_user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    old_status: Mapped[TicketStatus] = mapped_column(Enum(TicketStatus, name="ticket_status_enum"))
    new_status: Mapped[TicketStatus] = mapped_column(Enum(TicketStatus, name="ticket_status_enum"))
    comment: Mapped[str | None] = mapped_column(String(500), nullable=True)

    ticket: Mapped[Ticket] = relationship(back_populates="history")
    changed_by: Mapped[User] = relationship()