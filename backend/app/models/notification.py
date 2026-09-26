import enum
from sqlalchemy import String, Text, ForeignKey, Boolean, Enum
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class NotificationCategory(str, enum.Enum):
    SYSTEM = "system"            # Система (Оплата ЖКХ, ЕПД)
    CHAIRPERSON = "chairperson"  # Председатель (Новый опрос, итоги встречи)
    UK = "uk"                    # УК (Отключение ГВС, заявка закрыта)


class Notification(Base, TimestampMixin):
    """Уведомления пользователя"""
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    category: Mapped[NotificationCategory] = mapped_column(
        Enum(NotificationCategory, name="notification_category_enum"),
        default=NotificationCategory.SYSTEM,
        nullable=False,
    )
    author_name: Mapped[str] = mapped_column(String(255), nullable=False)  # "УК «ЖилКомфорт»", "Елена Смирнова"
    author_badge: Mapped[str | None] = mapped_column(String(50), nullable=True)  # "УК", "Председатель"
    
    title: Mapped[str] = mapped_column(String(255), nullable=False)  # "Плановое отключение ГВС"
    text: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    action_url: Mapped[str | None] = mapped_column(String(255), nullable=True)  # "/votes/1" или "/tickets/104"