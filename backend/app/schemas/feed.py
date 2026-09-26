from datetime import datetime
from pydantic import BaseModel
from app.schemas.common import BaseSchema


class FeedPostCreate(BaseModel):
    house_id: int
    title: str | None = None
    content: str
    image_url: str | None = None
    image_label: str | None = None


class CommentCreate(BaseModel):
    content: str
    parent_id: int | None = None


class ReactionCreate(BaseModel):
    reaction_type: str


class CommentResponse(BaseSchema):
    id: int
    author_name: str
    author_badge: str | None = None
    avatar_text: str
    avatar_bg: str
    text: str
    time_formatted: str
    replies: list["CommentResponse"] = []


class FeedPostResponse(BaseSchema):
    id: int
    author_name: str
    role_badge: str | None = None
    avatar_text: str
    is_org: bool
    time_formatted: str
    subtitle: str | None = None
    title: str | None = None
    content: str
    image: str | None = None
    image_label: str | None = None
    schedule_title: str | None = None
    schedule_rows: list[str] | None = None
    likes: int
    dislikes: int
    comments_count: int
    views: str
    post_type: str
    my_reaction: str | None = None