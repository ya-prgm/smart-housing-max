from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import require_roles
from app.models.user import User, UserRole
from app.models.ticket import Ticket, TicketStatus, TicketStatusHistory
from app.models.audit import AuditLog
from app.schemas.ticket import TicketResponse
from app.schemas.uk import TicketStatusUpdateRequest
from app.schemas.common import PaginatedResponse

router = APIRouter()


@router.get("", response_model=PaginatedResponse[TicketResponse])
async def get_uk_all_tickets(
    house_id: int | None = Query(default=None),
    status: TicketStatus | None = Query(default=None),
    category: str | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(require_roles(UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    base_query = select(Ticket).where(Ticket.is_deleted == False)

    if house_id:
        base_query = base_query.where(Ticket.house_id == house_id)
    if status:
        base_query = base_query.where(Ticket.status == status)
    if category:
        base_query = base_query.where(Ticket.category == category)
    if search:
        q = f"%{search.lower()}%"
        base_query = base_query.where(
            func.lower(Ticket.title).like(q) | func.lower(Ticket.description).like(q)
        )

    total = (await db.execute(select(func.count(Ticket.id)).select_from(base_query.subquery()))).scalar() or 0

    stmt = (
        base_query.options(
            selectinload(Ticket.house),
            selectinload(Ticket.author),
            selectinload(Ticket.supports),
        )
        .order_by(desc(Ticket.id))
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    tickets = (await db.execute(stmt)).scalars().all()

    items = [
        TicketResponse(
            id=t.id,
            code=t.code,
            category=t.category,
            title=t.title,
            description=t.description,
            status=t.status,
            priority=t.priority,
            created_at=t.created_at,
            is_my=False,
            votes_count=len(t.supports),
            is_voted=False,
            recipient_name=t.recipient_name,
            house_address=t.house.address if t.house else None,
            author_full_name=t.author.full_name if t.author else None,
        )
        for t in tickets
    ]

    pages = (total + page_size - 1) // page_size if total > 0 else 1

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.patch("/{ticket_id}/status")
async def update_ticket_status(
    ticket_id: int,
    payload: TicketStatusUpdateRequest,
    current_user: User = Depends(require_roles(UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    ticket = await db.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Заявка не найдена")

    old_status = ticket.status
    ticket.status = payload.status

    db.add(TicketStatusHistory(
        ticket_id=ticket.id,
        changed_by_user_id=current_user.id,
        old_status=old_status,
        new_status=payload.status,
        comment=payload.comment,
    ))

    db.add(AuditLog(
        user_id=current_user.id,
        action="update_ticket_status",
        entity_type="ticket",
        entity_id=ticket.id,
        house_id=ticket.house_id,
        details={"old_status": old_status.value, "new_status": payload.status.value, "comment": payload.comment},
    ))

    await db.commit()
    return {"status": "ok"}