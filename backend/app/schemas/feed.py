from datetime import datetime
from pydantic import BaseModel
from app.schemas.common import BaseSchema
from app.core.constants import ReactionType


class FeedPostCreate(BaseModel):
    title: str | None = None
    content: str
    image_id: int | None = None
    image_label: str | None = None


class CommentCreate(BaseModel):
    content: str
    parent_id: int | None = None


class ReactionCreate(BaseModel):
    reaction_type: ReactionType


class ReactionToggleResponse(BaseSchema):
    post_id: int
    likes: int
    dislikes: int
    my_reaction: ReactionType | None = None


class CommentResponse(BaseSchema):
    id: int
    author_name: str
    author_role: str
    author_avatar: str | None = None
    content: str
    created_at: datetime
    replies: list["CommentResponse"] = []


class PostAuthor(BaseModel):
    name: str
    role: str
    avatar_url: str | None = None


class FeedPostResponse(BaseSchema):
    id: int
    author: PostAuthor
    title: str | None = None
    content: str
    image_url: str | None = None
    image_label: str | None = None
    likes: int
    dislikes: int
    comments_count: int
    views: int
    post_type: str
    created_at: datetime
    my_reaction: ReactionType | None = None