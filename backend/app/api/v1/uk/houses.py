from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import require_roles
from app.models.user import User, UserRole
from app.services.house_service import HouseService
from app.schemas.house import HouseCardResponse, HouseDetailResponse

router = APIRouter()


@router.get("", response_model=list[HouseCardResponse])
async def get_uk_houses(
    current_user: User = Depends(require_roles(UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    service = HouseService(db)
    return await service.get_houses_catalog()


@router.get("/{house_id}", response_model=HouseDetailResponse)
async def get_uk_house_details(
    house_id: int,
    current_user: User = Depends(require_roles(UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    service = HouseService(db)
    house = await service.get_house_passport(house_id)
    if not house:
        raise HTTPException(status_code=404, detail="Дом не найден")
    return house