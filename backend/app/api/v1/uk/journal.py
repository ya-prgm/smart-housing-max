from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import require_roles
from app.models.user import User, UserRole
from app.models.audit import AuditLog
from app.schemas.uk import JournalEventResponse
from app.schemas.common import PaginatedResponse

router = APIRouter()


@router.get("", response_model=PaginatedResponse[JournalEventResponse])
async def get_uk_journal(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(require_roles(UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    total = (await db.execute(select(func.count(AuditLog.id)))).scalar() or 0

    stmt = (
        select(AuditLog)
        .options(selectinload(AuditLog.user))
        .order_by(desc(AuditLog.id))
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    logs = (await db.execute(stmt)).scalars().all()

    items = [
        JournalEventResponse(
            id=log.id,
            action=log.action,
            entity_type=log.entity_type,
            entity_id=log.entity_id,
            user_name=log.user.full_name if log.user else "Система",
            house_address="ул. Баумана, 12",
            details=log.details,
            created_at=log.created_at,
        )
        for log in logs
    ]

    pages = (total + page_size - 1) // page_size if total > 0 else 1

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )