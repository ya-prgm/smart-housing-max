from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User, UserApartment
from app.models.house import Apartment
from app.models.ticket import Ticket, TicketAttachment
from app.services.ticket_service import TicketService
from app.schemas.ticket import TicketCreate, TicketResponse, TicketSupportResponse, TicketAttachmentResponse

router = APIRouter()


@router.get("", response_model=list[TicketResponse])
async def get_tickets(
    status: str | None = Query(default=None),
    my: bool = Query(default=False),
    search: str | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Apartment.house_id)
        .join(UserApartment, UserApartment.apartment_id == Apartment.id)
        .where(UserApartment.user_id == current_user.id)
    )
    house_id = (await db.execute(stmt)).scalar() or 1

    service = TicketService(db)
    return await service.get_tickets(
        house_id=house_id,
        current_user=current_user,
        status_filter=status,
        only_my=my,
        search=search,
    )


@router.post("", response_model=TicketResponse, status_code=201)
async def create_ticket(
    payload: TicketCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Apartment.house_id, Apartment.id)
        .join(UserApartment, UserApartment.apartment_id == Apartment.id)
        .where(UserApartment.user_id == current_user.id)
    )
    row = (await db.execute(stmt)).first()
    house_id = row[0] if row else 1
    apartment_id = row[1] if row else 1

    import random
    ticket = Ticket(
        code=f"#{random.randint(4820, 9999)}",
        house_id=house_id,
        apartment_id=apartment_id,
        author_id=current_user.id,
        recipient_type=payload.recipient_type,
        recipient_name=payload.recipient_name,
        category=payload.category,
        topic_code=payload.topic_code,
        title=payload.title,
        description=payload.description,
        is_public_in_feed=payload.is_public_in_feed,
    )
    db.add(ticket)
    await db.flush()

    for fid in payload.attachment_ids:
        db.add(TicketAttachment(ticket_id=ticket.id, file_id=fid))

    await db.commit()

    return TicketResponse(
        id=ticket.id,
        code=ticket.code,
        category=ticket.category,
        title=ticket.title,
        description=ticket.description,
        status=ticket.status,
        priority=ticket.priority,
        created_at=ticket.created_at,
        is_my=True,
        votes_count=0,
        is_voted=False,
        recipient_name=ticket.recipient_name,
    )


@router.post("/{ticket_id}/support", response_model=TicketSupportResponse)
async def toggle_ticket_support(
    ticket_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TicketService(db)
    return await service.toggle_support(ticket_id, current_user.id)