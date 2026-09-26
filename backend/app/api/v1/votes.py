from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User, UserApartment
from app.models.house import Apartment
from app.services.vote_service import VoteService
from app.schemas.vote import PollCardResponse, PollDetailResponse, PollSubmitRequest
from app.schemas.common import StatusResponse

router = APIRouter()


@router.get("", response_model=list[PollCardResponse])
async def get_polls(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Apartment.house_id)
        .join(UserApartment, UserApartment.apartment_id == Apartment.id)
        .where(UserApartment.user_id == current_user.id)
    )
    house_id = (await db.execute(stmt)).scalar() or 1

    service = VoteService(db)
    return await service.get_polls_list(house_id, current_user)


@router.get("/{poll_id}", response_model=PollDetailResponse)
async def get_poll(
    poll_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = VoteService(db)
    poll = await service.get_poll_details(poll_id, current_user)
    if not poll:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Опрос не найден")
    return poll


@router.post("/{poll_id}/submit", response_model=StatusResponse)
async def submit_poll_answers(
    poll_id: int,
    payload: PollSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = VoteService(db)
    await service.submit_vote(poll_id, current_user, payload)
    return StatusResponse(status="ok", message="Голос успешно принят и подписан ПЭП")