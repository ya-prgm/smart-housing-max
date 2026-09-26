from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.house import Apartment
from app.schemas.user import UserProfileResponse, UserUpdateRequest

router = APIRouter()


@router.get("/me", response_model=UserProfileResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    house_id = None
    house_address = None
    apt_num = None
    acc = None
    debt = 0.0
    debt_free = True

    if current_user.apartments:
        ua = current_user.apartments[0]
        apt_stmt = (
            select(Apartment)
            .where(Apartment.id == ua.apartment_id)
            .options(selectinload(Apartment.house))
        )
        apt = (await db.execute(apt_stmt)).scalars().first()
        if apt:
            house_id = apt.house_id
            apt_num = apt.number
            acc = apt.personal_account
            debt = float(apt.debt_amount)
            debt_free = apt.is_debt_free
            if apt.house:
                house_address = apt.house.address

    return UserProfileResponse(
        id=current_user.id,
        max_user_id=current_user.max_user_id,
        full_name=current_user.full_name,
        phone=current_user.phone,
        email=current_user.email,
        role=current_user.role,
        house_id=house_id,
        house_address=house_address,
        apartment_number=apt_num,
        personal_account=acc,
        debt_amount=debt,
        is_debt_free=debt_free,
        notifications_enabled=current_user.notifications_enabled,
    )


@router.patch("/me", response_model=UserProfileResponse)
async def update_my_profile(
    payload: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if payload.email is not None:
        current_user.email = payload.email
    if payload.phone is not None:
        current_user.phone = payload.phone
    if payload.notifications_enabled is not None:
        current_user.notifications_enabled = payload.notifications_enabled

    await db.commit()
    await db.refresh(current_user)

    return await get_my_profile(current_user, db)