from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy import String, Integer, Float, ForeignKey, Boolean, Numeric, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin
from app.core.constants import ManagementType, ProviderCategory

if TYPE_CHECKING:
    from app.models.user import UserApartment


class House(Base, TimestampMixin):
    __tablename__ = "houses"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    
    address: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    city: Mapped[str] = mapped_column(String(100), default="Казань", nullable=False)
    district: Mapped[str] = mapped_column(String(150), nullable=False)
    postal_code: Mapped[str | None] = mapped_column(String(10), nullable=True)
    fias_code: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    cadastral_number: Mapped[str | None] = mapped_column(String(64), nullable=True)
    oktmo: Mapped[str | None] = mapped_column(String(20), nullable=True)
    
    year_built: Mapped[int] = mapped_column(Integer, default=1998, nullable=False)
    wear_percentage: Mapped[int] = mapped_column(Integer, default=23, nullable=False)
    total_area: Mapped[float] = mapped_column(Float, default=4116.0, nullable=False)
    living_area: Mapped[float] = mapped_column(Float, default=3253.9, nullable=False)
    floors: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    entrances: Mapped[int] = mapped_column(Integer, default=4, nullable=False)
    apartments_count: Mapped[int] = mapped_column(Integer, default=120, nullable=False)
    project_series: Mapped[str | None] = mapped_column(String(64), default="86-08.86", nullable=True)
    wall_material: Mapped[str | None] = mapped_column(String(100), default="Стены кирпичные", nullable=True)
    
    management_type: Mapped[ManagementType] = mapped_column(
        Enum(ManagementType, name="management_type_enum"),
        default=ManagementType.UK,
        nullable=False,
    )
    uk_name: Mapped[str] = mapped_column(String(255), default="ООО УК «ЖилКомФорт»", nullable=False)
    uk_inn: Mapped[str] = mapped_column(String(20), default="1655389201", nullable=False)
    chairman_name: Mapped[str | None] = mapped_column(String(255), default="Елена Смирнова", nullable=True)
    dispatcher_phone: Mapped[str] = mapped_column(String(30), default="+7 (800) 200-12-34", nullable=False)
    emergency_phone: Mapped[str] = mapped_column(String(30), default="+7 (843) 210-00-00", nullable=False)
    
    apartments: Mapped[list[Apartment]] = relationship(back_populates="house", cascade="all, delete-orphan")
    providers: Mapped[list[HouseServiceProvider]] = relationship(back_populates="house", cascade="all, delete-orphan")


class Apartment(Base, TimestampMixin):
    __tablename__ = "apartments"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    house_id: Mapped[int] = mapped_column(ForeignKey("houses.id", ondelete="CASCADE"), nullable=False, index=True)
    
    number: Mapped[str] = mapped_column(String(10), nullable=False)
    entrance: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    floor: Mapped[int] = mapped_column(Integer, default=4, nullable=False)
    area: Mapped[float] = mapped_column(Float, default=54.2, nullable=False)
    
    personal_account: Mapped[str] = mapped_column(String(30), unique=True, index=True, nullable=False)
    debt_amount: Mapped[float] = mapped_column(Numeric(10, 2), default=4820.00, nullable=False)
    payment_deadline: Mapped[str] = mapped_column(String(50), default="до 10 мая", nullable=False)
    is_debt_free: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    house: Mapped[House] = relationship(back_populates="apartments")
    users: Mapped[list[UserApartment]] = relationship(back_populates="apartment")


class HouseServiceProvider(Base):
    __tablename__ = "house_service_providers"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    house_id: Mapped[int] = mapped_column(ForeignKey("houses.id", ondelete="CASCADE"), nullable=False, index=True)
    
    category: Mapped[ProviderCategory] = mapped_column(Enum(ProviderCategory, name="provider_category_enum"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    service_description: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    brand_badge: Mapped[str | None] = mapped_column(String(50), nullable=True)

    house: Mapped[House] = relationship(back_populates="providers")