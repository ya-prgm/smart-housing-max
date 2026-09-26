from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User, UserRole, UserApartment
from app.models.house import House, Apartment
from app.services.house_service import HouseService
from app.schemas.house import HouseDetailResponse

router = APIRouter()


@router.get("/my", response_model=HouseDetailResponse)
async def get_my_house(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Apartment.house_id)
        .join(UserApartment, UserApartment.apartment_id == Apartment.id)
        .where(UserApartment.user_id == current_user.id)
    )
    house_id = (await db.execute(stmt)).scalar() or 1

    service = HouseService(db)
    house = await service.get_house_passport(house_id)
    if not house:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Дом не найден")
    return house


@router.get("/{house_id}", response_model=HouseDetailResponse)
async def get_house_by_id(
    house_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.role in (UserRole.RESIDENT, UserRole.CHAIRMAN):
        stmt = (
            select(Apartment.house_id)
            .join(UserApartment, UserApartment.apartment_id == Apartment.id)
            .where(UserApartment.user_id == current_user.id)
        )
        user_house_id = (await db.execute(stmt)).scalar() or 1
        if user_house_id != house_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Доступ к чужому дому запрещен")

    service = HouseService(db)
    house = await service.get_house_passport(house_id)
    if not house:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Дом не найден")
    return house