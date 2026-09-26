from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import require_roles
from app.models.user import User, UserRole
from app.models.feed import FeedPost
from app.models.file import File as FileModel
from app.models.audit import AuditLog
from app.schemas.uk import UkFeedPostCreate
from app.schemas.common import StatusResponse

router = APIRouter()


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
        action="create_feed_post",
        entity_type="feed_post",
        entity_id=post.id,
        house_id=payload.house_id,
        details={"title": payload.title},
    ))

    await db.commit()
    return StatusResponse(status="ok", message="Публикация добавлена")