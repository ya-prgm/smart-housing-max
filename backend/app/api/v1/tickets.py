from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User, UserApartment
from app.models.house import Apartment
from app.core.constants import TicketStatus
from app.services.ticket_service import TicketService
from app.schemas.ticket import TicketCreate, TicketResponse, TicketSupportResponse

router = APIRouter()


@router.get("", response_model=list[TicketResponse])
async def get_tickets(
    status: TicketStatus | None = Query(default=None),
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


@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket_by_id(
    ticket_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TicketService(db)
    ticket = await service.get_ticket_details(ticket_id, current_user)
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заявка не найдена")
    return ticket


@router.post("", response_model=TicketResponse, status_code=201)
async def create_ticket(
    payload: TicketCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TicketService(db)
    return await service.create_ticket(payload, current_user)


@router.post("/{ticket_id}/support", response_model=TicketSupportResponse)
async def toggle_ticket_support(
    ticket_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TicketService(db)
    return await service.toggle_support(ticket_id, current_user.id)