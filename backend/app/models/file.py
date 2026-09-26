from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy import String, BigInteger, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin
from app.core.constants import FileContext

if TYPE_CHECKING:
    from app.models.user import User


class File(Base, TimestampMixin):
    __tablename__ = "files"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    uploader_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    original_name: Mapped[str] = mapped_column(String(255), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=False)
    storage_path: Mapped[str] = mapped_column(String(1024), nullable=False)
    context: Mapped[FileContext] = mapped_column(Enum(FileContext, name="file_context_enum"), default=FileContext.TICKET, nullable=False)

    uploader: Mapped[User] = relationship()