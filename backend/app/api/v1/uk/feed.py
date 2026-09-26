from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import require_roles
from app.models.user import User, UserRole
from app.models.feed import FeedPost
from app.models.file import File as FileModel
from app.models.audit import AuditLog
from app.core.constants import JournalAction, JournalEntityType, ReactionType, PostType
from app.schemas.uk import UkFeedPostCreate
from app.schemas.feed import FeedPostResponse, PostAuthor
from app.schemas.common import StatusResponse

router = APIRouter()


@router.get("", response_model=list[FeedPostResponse])
async def get_uk_feed(
    house_id: int = Query(default=1),
    current_user: User = Depends(require_roles(UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(FeedPost)
        .where(FeedPost.house_id == house_id, FeedPost.is_deleted == False)
        .options(
            selectinload(FeedPost.comments),
            selectinload(FeedPost.reactions),
            selectinload(FeedPost.author),
        )
        .order_by(desc(FeedPost.is_pinned), desc(FeedPost.id))
    )
    posts = (await db.execute(stmt)).scalars().all()

    results = []
    for p in posts:
        likes = sum(1 for r in p.reactions if r.reaction_type == "like")
        dislikes = sum(1 for r in p.reactions if r.reaction_type == "dislike")

        results.append(
            FeedPostResponse(
                id=p.id,
                author=PostAuthor(
                    name=p.author_title,
                    role=p.author.role if p.author else UserRole.UK_STAFF,
                    avatar_url=p.author.avatar_url if p.author else None,
                ),
                title=p.title,
                content=p.content,
                image_url=p.image_url,
                image_label=p.image_label,
                likes=likes,
                dislikes=dislikes,
                comments_count=len(p.comments),
                views=p.views_count,
                post_type=PostType.ANNOUNCEMENT if p.post_type == "uk" else PostType.INFO,
                created_at=p.created_at,
                my_reaction=None,
            )
        )
    return results


@router.get("/{post_id}", response_model=FeedPostResponse)
async def get_uk_post_details(
    post_id: int,
    current_user: User = Depends(require_roles(UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(FeedPost)
        .where(FeedPost.id == post_id, FeedPost.is_deleted == False)
        .options(
            selectinload(FeedPost.reactions),
            selectinload(FeedPost.comments),
            selectinload(FeedPost.author),
        )
    )
    p = (await db.execute(stmt)).scalars().first()
    if not p:
        raise HTTPException(status_code=404, detail="Пост не найден")

    likes = sum(1 for r in p.reactions if r.reaction_type == "like")
    dislikes = sum(1 for r in p.reactions if r.reaction_type == "dislike")

    return FeedPostResponse(
        id=p.id,
        author=PostAuthor(
            name=p.author_title,
            role=p.author.role if p.author else UserRole.UK_STAFF,
            avatar_url=p.author.avatar_url if p.author else None,
        ),
        title=p.title,
        content=p.content,
        image_url=p.image_url,
        image_label=p.image_label,
        likes=likes,
        dislikes=dislikes,
        comments_count=len(p.comments),
        views=p.views_count,
        post_type=PostType.ANNOUNCEMENT if p.post_type == "uk" else PostType.INFO,
        created_at=p.created_at,
        my_reaction=None,
    )


@router.post("", response_model=StatusResponse, status_code=201)
async def create_uk_feed_post(
    payload: UkFeedPostCreate,
    current_user: User = Depends(require_roles(UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    img_url = None
    if payload.image_id:
        f = await db.get(FileModel, payload.image_id)
        if f:
            img_url = f"/api/v1/files/{f.id}"

    post = FeedPost(
        house_id=payload.house_id,
        author_id=current_user.id,
        post_type="uk",
        author_title="ООО УК «ЖилКомФорт»",
        author_badge="УК",
        title=payload.title,
        content=payload.content,
        image_url=img_url,
        image_label=payload.image_label,
        views_count=1,
    )
    db.add(post)
    await db.flush()

    db.add(AuditLog(
        user_id=current_user.id,
        action=JournalAction.CREATE,
        entity_type=JournalEntityType.POST,
        entity_id=post.id,
        house_id=payload.house_id,
        details={"title": payload.title},
    ))

    await db.commit()
    return StatusResponse(status="ok", message="Публикация добавлена")