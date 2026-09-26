from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy import String, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User


class AuditLog(Base, TimestampMixin):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    entity_type: Mapped[str] = mapped_column(String(50), nullable=False)
    entity_id: Mapped[int | None] = mapped_column(nullable=True)
    house_id: Mapped[int | None] = mapped_column(ForeignKey("houses.id", ondelete="CASCADE"), nullable=True, index=True)
    details: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    user: Mapped[User] = relationship()