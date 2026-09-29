from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import get_current_user, require_roles
from app.models.user import User, UserRole, UserApartment
from app.models.house import Apartment
from app.models.feed import FeedPost, FeedPostComment, FeedPostReaction
from app.models.file import File as FileModel
from app.core.constants import ReactionType, PostType
from app.schemas.feed import (
    FeedPostCreate,
    FeedPostResponse,
    ReactionCreate,
    ReactionToggleResponse,
    CommentCreate,
    CommentResponse,
    PostAuthor,
)
from app.schemas.common import PaginatedResponse, StatusResponse

router = APIRouter()


def resolve_post_type(raw_type: str) -> PostType:
    if raw_type == "chairman":
        return PostType.ANNOUNCEMENT
    if raw_type == "uk":
        return PostType.REPORT
    try:
        return PostType(raw_type)
    except ValueError:
        return PostType.INFO


@router.get("", response_model=list[FeedPostResponse])
async def get_feed(
    type: str | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Apartment.house_id)
        .join(UserApartment, UserApartment.apartment_id == Apartment.id)
        .where(UserApartment.user_id == current_user.id)
    )
    house_id = (await db.execute(stmt)).scalar() or 1

    post_stmt = (
        select(FeedPost)
        .where(FeedPost.house_id == house_id, FeedPost.is_deleted == False)
        .options(
            selectinload(FeedPost.comments),
            selectinload(FeedPost.reactions),
            selectinload(FeedPost.author),
        )
        .order_by(FeedPost.is_pinned.desc(), FeedPost.id.desc())
    )
    if type == "uk":
        post_stmt = post_stmt.where(
            (FeedPost.post_type.in_(["uk", "report", "info", "emergency"]))
            | (FeedPost.author.has(User.role == UserRole.UK_STAFF))
            | (FeedPost.author_badge.ilike("%УК%"))
            | (FeedPost.author_badge.ilike("%Управляющ%"))
        )
    elif type == "chairman":
        post_stmt = post_stmt.where(
            (FeedPost.post_type.in_(["chairman", "announcement"]))
            | (FeedPost.author.has(User.role == UserRole.CHAIRMAN))
            | (FeedPost.author_badge == "Председатель")
        )

    posts = (await db.execute(post_stmt)).scalars().all()

    results = []
    for p in posts:
        likes = sum(1 for r in p.reactions if r.reaction_type == "like")
        dislikes = sum(1 for r in p.reactions if r.reaction_type == "dislike")
        my_r = next((ReactionType(r.reaction_type) for r in p.reactions if r.user_id == current_user.id), None)

        images = []
        if p.schedule_data and isinstance(p.schedule_data, dict) and "images" in p.schedule_data:
            images = [img for img in p.schedule_data["images"] if img]
        elif p.image_url:
            images = [p.image_url]
        if not images and p.image_url:
            images = [p.image_url]

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
                images=images,
                likes=likes,
                dislikes=dislikes,
                comments_count=len(p.comments),
                views=p.views_count,
                post_type=resolve_post_type(p.post_type),
                created_at=p.created_at,
                my_reaction=my_r,
            )
        )
    return results


@router.get("/{post_id}", response_model=FeedPostResponse)
async def get_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(FeedPost)
        .where(FeedPost.id == post_id, FeedPost.is_deleted == False)
        .options(
            selectinload(FeedPost.comments),
            selectinload(FeedPost.reactions),
            selectinload(FeedPost.author),
        )
    )
    p = (await db.execute(stmt)).scalars().first()
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пост не найден")

    likes = sum(1 for r in p.reactions if r.reaction_type == "like")
    dislikes = sum(1 for r in p.reactions if r.reaction_type == "dislike")
    my_r = next((ReactionType(r.reaction_type) for r in p.reactions if r.user_id == current_user.id), None)

    images = []
    if p.schedule_data and isinstance(p.schedule_data, dict) and "images" in p.schedule_data:
        images = [img for img in p.schedule_data["images"] if img]
    elif p.image_url:
        images = [p.image_url]
    if not images and p.image_url:
        images = [p.image_url]

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
        images=images,
        likes=likes,
        dislikes=dislikes,
        comments_count=len(p.comments),
        views=p.views_count,
        post_type=resolve_post_type(p.post_type),
        created_at=p.created_at,
        my_reaction=my_r,
    )


@router.post("", response_model=StatusResponse, status_code=201)
async def create_feed_post(
    payload: FeedPostCreate,
    current_user: User = Depends(require_roles(UserRole.CHAIRMAN, UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Apartment.house_id)
        .join(UserApartment, UserApartment.apartment_id == Apartment.id)
        .where(UserApartment.user_id == current_user.id)
    )
    house_id = (await db.execute(stmt)).scalar() or 1

    post_images: list[str] = list(payload.images) if payload.images else []
    if payload.image_ids:
        for fid in payload.image_ids:
            f = await db.get(FileModel, fid)
            if f:
                post_images.append(f"/api/v1/files/{f.id}")
    elif payload.image_id:
        f = await db.get(FileModel, payload.image_id)
        if f:
            post_images.append(f"/api/v1/files/{f.id}")

    first_img_url = post_images[0] if post_images else None

    post = FeedPost(
        house_id=house_id,
        author_id=current_user.id,
        post_type=payload.post_type.value,
        author_title=current_user.full_name,
        author_badge="Председатель" if current_user.role == UserRole.CHAIRMAN else "УК",
        title=payload.title,
        content=payload.content,
        image_url=first_img_url,
        image_label=payload.image_label or (f"{len(post_images)} фото" if len(post_images) > 1 else None),
        schedule_data={"images": post_images} if post_images else None,
        views_count=1,
    )
    db.add(post)
    await db.commit()
    return StatusResponse(status="ok", message="Пост опубликован")


@router.post("/{post_id}/reactions", response_model=ReactionToggleResponse)
async def toggle_post_reaction(
    post_id: int,
    payload: ReactionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(FeedPostReaction).where(
        FeedPostReaction.post_id == post_id,
        FeedPostReaction.user_id == current_user.id,
    )
    existing = (await db.execute(stmt)).scalars().first()

    my_reaction = None
    if existing:
        if existing.reaction_type == payload.reaction_type.value:
            await db.delete(existing)
        else:
            existing.reaction_type = payload.reaction_type.value
            my_reaction = payload.reaction_type
    else:
        db.add(FeedPostReaction(post_id=post_id, user_id=current_user.id, reaction_type=payload.reaction_type.value))
        my_reaction = payload.reaction_type

    await db.flush()

    reactions_stmt = select(FeedPostReaction).where(FeedPostReaction.post_id == post_id)
    all_reactions = (await db.execute(reactions_stmt)).scalars().all()
    likes = sum(1 for r in all_reactions if r.reaction_type == "like")
    dislikes = sum(1 for r in all_reactions if r.reaction_type == "dislike")

    await db.commit()

    return ReactionToggleResponse(
        post_id=post_id,
        likes=likes,
        dislikes=dislikes,
        my_reaction=my_reaction,
    )


@router.get("/{post_id}/comments", response_model=PaginatedResponse[CommentResponse])
async def get_post_comments(
    post_id: int,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
    parent_id: int | None = Query(default=None),
    sort: str = Query(default="oldest"),
    db: AsyncSession = Depends(get_db),
):
    base_query = select(FeedPostComment).where(
        FeedPostComment.post_id == post_id,
        FeedPostComment.parent_id == parent_id,
    )

    count_subq = base_query.subquery()
    total = (await db.execute(select(func.count()).select_from(count_subq))).scalar() or 0

    if sort == "newest":
        order_clause = FeedPostComment.created_at.desc()
    elif sort == "popular":
        order_clause = FeedPostComment.id.desc()
    else:
        order_clause = FeedPostComment.created_at.asc()

    stmt = (
        base_query.options(selectinload(FeedPostComment.replies), selectinload(FeedPostComment.author))
        .order_by(order_clause)
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    comments = (await db.execute(stmt)).scalars().all()

    items = [
        CommentResponse(
            id=c.id,
            author_name=c.author.full_name if c.author else "Житель",
            author_role=c.author.role if c.author else UserRole.RESIDENT,
            author_avatar=c.author.avatar_url if c.author else None,
            content=c.content,
            created_at=c.created_at,
            replies=[],
        )
        for c in comments
    ]

    pages = (total + page_size - 1) // page_size if total > 0 else 1

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.post("/{post_id}/comments", response_model=StatusResponse)
async def add_post_comment(
    post_id: int,
    payload: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    comment = FeedPostComment(
        post_id=post_id,
        parent_id=payload.parent_id,
        author_id=current_user.id,
        content=payload.content,
    )
    db.add(comment)
    await db.commit()
    return StatusResponse(status="ok", message="Комментарий добавлен")


@router.delete("/comments/{comment_id}")
async def delete_post_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    comment = await db.get(FeedPostComment, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Комментарий не найден")

    if comment.author_id != current_user.id and current_user.role not in (UserRole.UK_STAFF, UserRole.CHAIRMAN):
        raise HTTPException(status_code=403, detail="Недостаточно прав для удаления")

    await db.delete(comment)
    await db.commit()
    return {"status": "ok"}