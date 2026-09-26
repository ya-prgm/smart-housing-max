from sqlalchemy import String, Text, ForeignKey, Boolean, Integer, JSON, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, SoftDeleteMixin


class FeedPost(Base, TimestampMixin, SoftDeleteMixin):
    """Публикация в ленте дома (от Председателя или УК)"""
    __tablename__ = "feed_posts"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    house_id: Mapped[int] = mapped_column(ForeignKey("houses.id", ondelete="CASCADE"), nullable=False, index=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    post_type: Mapped[str] = mapped_column(String(20), default="uk", nullable=False)  # "uk" | "chairman"
    author_title: Mapped[str] = mapped_column(String(255), nullable=False)  # "Елена Смирнова" или "УК «ЖилКомФорт»"
    author_badge: Mapped[str | None] = mapped_column(String(50), nullable=True)  # "Председатель", "Официально"
    
    title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    image_label: Mapped[str | None] = mapped_column(String(100), nullable=True)  # "Фотоотчет приёмки"
    schedule_data: Mapped[dict | None] = mapped_column(JSON, nullable=True)     # График работ
    
    views_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_pinned: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    comments: Mapped[list["FeedPostComment"]] = relationship(back_populates="post", cascade="all, delete-orphan")
    reactions: Mapped[list["FeedPostReaction"]] = relationship(back_populates="post", cascade="all, delete-orphan")


class FeedPostComment(Base, TimestampMixin):
    """Древовидные комментарии к посту (с поддержкой ответов parent_id)"""
    __tablename__ = "feed_post_comments"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("feed_posts.id", ondelete="CASCADE"), nullable=False, index=True)
    parent_id: Mapped[int | None] = mapped_column(ForeignKey("feed_post_comments.id", ondelete="CASCADE"), nullable=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    content: Mapped[str] = mapped_column(Text, nullable=False)
    attachment_data: Mapped[dict | None] = mapped_column(JSON, nullable=True)  # PDF или прикрепленная камера

    post: Mapped["FeedPost"] = relationship(back_populates="comments")
    replies: Mapped[list["FeedPostComment"]] = relationship(backref="parent", remote_side=[id])


class FeedPostReaction(Base, TimestampMixin):
    """Лайки и дизлайки (ровно 1 реакция от пользователя на пост)"""
    __tablename__ = "feed_post_reactions"
    __table_args__ = (UniqueConstraint("post_id", "user_id", name="uq_post_user_reaction"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("feed_posts.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reaction_type: Mapped[str] = mapped_column(String(10), nullable=False)  # "like" | "dislike"

    post: Mapped["FeedPost"] = relationship(back_populates="reactions")