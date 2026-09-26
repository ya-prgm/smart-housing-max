from sqlalchemy import (
    String,
    Integer,
    Text,
    ForeignKey,
    Table,
    Column,
    Computed,
    Index,
)
from sqlalchemy.dialects.postgresql import TSVECTOR
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

topic_recipient_map = Table(
    "topic_recipient_map",
    Base.metadata,
    Column("topic_id", Integer, ForeignKey("ticket_topics.id", ondelete="CASCADE"), primary_key=True),
    Column("recipient_id", Integer, ForeignKey("ticket_recipients.id", ondelete="CASCADE"), primary_key=True),
)

ticket_recipient_map = Table(
    "ticket_recipient_map",
    Base.metadata,
    Column("ticket_id", Integer, ForeignKey("tickets.id", ondelete="CASCADE"), primary_key=True),
    Column("recipient_id", Integer, ForeignKey("ticket_recipients.id", ondelete="CASCADE"), primary_key=True),
)


class TicketRecipient(Base):
    __tablename__ = "ticket_recipients"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    short_name: Mapped[str] = mapped_column(String(100), nullable=False)
    full_name: Mapped[str] = mapped_column(String(500), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)

    topics: Mapped[list["TicketTopic"]] = relationship(
        secondary=topic_recipient_map,
        back_populates="recipients",
    )


class TicketTopic(Base, TimestampMixin):
    __tablename__ = "ticket_topics"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    section_num: Mapped[int] = mapped_column(Integer, nullable=False)
    section_title: Mapped[str] = mapped_column(String(255), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    keywords: Mapped[str] = mapped_column(Text, default="", nullable=False)

    search_vector: Mapped[TSVECTOR | None] = mapped_column(
        TSVECTOR,
        Computed(
            "to_tsvector('russian', coalesce(code, '') || ' ' || coalesce(title, '') || ' ' || coalesce(keywords, ''))",
            persisted=True,
        ),
        nullable=True,
    )

    recipients: Mapped[list["TicketRecipient"]] = relationship(
        secondary=topic_recipient_map,
        back_populates="topics",
    )

    __table_args__ = (
        Index("ix_ticket_topics_search", "search_vector", postgresql_using="gin"),
    )