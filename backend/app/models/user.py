import enum
from datetime import datetime
from sqlalchemy import String, BigInteger, Enum, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class UserRole(str, enum.Enum):
    RESIDENT = "resident"       # Житель
    CHAIRMAN = "chairman"       # Председатель Совета МКД / ТСЖ
    UK_STAFF = "uk_staff"       # Сотрудник управляющей компании


class OwnershipType(str, enum.Enum):
    OWNER = "owner"             # Собственник
    TENANT = "tenant"           # Наниматель / Арендатор
    REGISTERED = "registered"   # Зарегистрирован / Прописан


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    max_user_id: Mapped[int] = mapped_column(BigInteger, unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    snils: Mapped[str | None] = mapped_column(String(20), nullable=True)  # СНИЛС (замаскированный)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role_enum"),
        default=UserRole.RESIDENT,
        nullable=False,
        index=True,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    apartments: Mapped[list["UserApartment"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class UserApartment(Base, TimestampMixin):
    """Связь пользователя с квартирой (подтверждение ГИС ЖКХ / ЕСИА)"""
    __tablename__ = "user_apartments"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    apartment_id: Mapped[int] = mapped_column(ForeignKey("apartments.id", ondelete="CASCADE"), nullable=False, index=True)
    
    ownership_type: Mapped[OwnershipType] = mapped_column(
        Enum(OwnershipType, name="ownership_type_enum"),
        default=OwnershipType.OWNER,
        nullable=False,
    )
    is_verified_esia: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)  # Основная квартира в шапке

    user: Mapped["User"] = relationship(back_populates="apartments")
    apartment: Mapped["Apartment"] = relationship(back_populates="users")


class RefreshToken(Base):
    """Хранение refresh-токенов в БД с ротацией для защиты по ГОСТ/OWASP"""
    __tablename__ = "refresh_tokens"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    user: Mapped["User"] = relationship(back_populates="refresh_tokens")