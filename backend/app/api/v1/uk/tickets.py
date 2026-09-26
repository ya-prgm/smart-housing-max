from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import require_roles
from app.models.user import User, UserRole
from app.models.ticket import Ticket, TicketStatus, TicketStatusHistory
from app.models.audit import AuditLog
from app.core.constants import JournalAction, JournalEntityType
from app.schemas.ticket import TicketResponse, TicketAttachmentResponse
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
            selectinload(Ticket.attachments).selectinload(Ticket.attachments.property.mapper.class_.file),
        )
        .order_by(desc(Ticket.id))
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    tickets = (await db.execute(stmt)).scalars().all()

    items = []
    for t in tickets:
        attachments = [
            TicketAttachmentResponse(
                id=att.file.id,
                url=f"/api/v1/files/{att.file.id}",
                filename=att.file.original_name,
                size=att.file.size_bytes,
                mime_type=att.file.mime_type,
            )
            for att in t.attachments
            if att.file
        ]
        items.append(
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
                house_address=t.house.address if t.house else "",
                author_full_name=t.author.full_name if t.author else None,
                attachments=attachments,
            )
        )

    pages = (total + page_size - 1) // page_size if total > 0 else 1

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_uk_ticket_details(
    ticket_id: int,
    current_user: User = Depends(require_roles(UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Ticket)
        .where(Ticket.id == ticket_id, Ticket.is_deleted == False)
        .options(
            selectinload(Ticket.house),
            selectinload(Ticket.author),
            selectinload(Ticket.supports),
            selectinload(Ticket.attachments).selectinload(Ticket.attachments.property.mapper.class_.file),
        )
    )
    t = (await db.execute(stmt)).scalars().first()
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заявка не найдена")

    attachments = [
        TicketAttachmentResponse(
            id=att.file.id,
            url=f"/api/v1/files/{att.file.id}",
            filename=att.file.original_name,
            size=att.file.size_bytes,
            mime_type=att.file.mime_type,
        )
        for att in t.attachments
        if att.file
    ]

    return TicketResponse(
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
        house_address=t.house.address if t.house else "",
        author_full_name=t.author.full_name if t.author else None,
        attachments=attachments,
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
        action=JournalAction.STATUS_CHANGE,
        entity_type=JournalEntityType.TICKET,
        entity_id=ticket.id,
        house_id=ticket.house_id,
        details={"old_status": old_status.value, "new_status": payload.status.value, "comment": payload.comment},
    ))

    await db.commit()
    return {"status": "ok"}