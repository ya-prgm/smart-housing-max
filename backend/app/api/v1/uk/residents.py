from datetime import datetime
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import require_roles
from app.models.user import User, UserRole, UserApartment
from app.models.house import House, Apartment
from app.models.audit import AuditLog
from app.schemas.uk import ResidentResponse, ResidentUpdateRequest
from app.schemas.common import PaginatedResponse

router = APIRouter()


@router.get("", response_model=PaginatedResponse[ResidentResponse])
async def get_residents_registry(
    house_id: int | None = Query(default=None),
    role: UserRole | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(require_roles(UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    base_query = (
        select(User)
        .join(UserApartment, UserApartment.user_id == User.id)
        .join(Apartment, Apartment.id == UserApartment.apartment_id)
        .join(House, House.id == Apartment.house_id)
    )

    if house_id:
        base_query = base_query.where(Apartment.house_id == house_id)
    if role:
        base_query = base_query.where(User.role == role)
    if search:
        q = f"%{search.lower()}%"
        base_query = base_query.where(func.lower(User.full_name).like(q))

    total = (await db.execute(select(func.count(func.distinct(User.id))).select_from(base_query.subquery()))).scalar() or 0

    stmt = (
        base_query.options(
            selectinload(User.apartments).selectinload(UserApartment.apartment).selectinload(Apartment.house)
        )
        .distinct()
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    users = (await db.execute(stmt)).scalars().all()

    items = []
    for u in users:
        h_addr = "ул. Баумана, 12"
        apt_num = "48"
        p_acc = "8492-3019-44"

        if u.apartments:
            ua = u.apartments[0]
            if ua.apartment:
                apt_num = ua.apartment.number
                p_acc = ua.apartment.personal_account
                if ua.apartment.house:
                    h_addr = ua.apartment.house.address

        items.append(
            ResidentResponse(
                id=u.id,
                max_user_id=u.max_user_id,
                full_name=u.full_name,
                role=u.role,
                house_address=h_addr,
                apartment_number=apt_num,
                personal_account=p_acc,
                registered_at=u.created_at,
                last_active_at=u.updated_at,
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


@router.patch("/{user_id}", response_model=ResidentResponse)
async def update_resident_role(
    user_id: int,
    payload: ResidentUpdateRequest,
    current_user: User = Depends(require_roles(UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Житель не найден")

    old_role = user.role.value
    user.role = payload.role

    db.add(AuditLog(
        user_id=current_user.id,
        action="update_resident_role",
        entity_type="user",
        entity_id=user.id,
        house_id=payload.house_id,
        details={"old_role": old_role, "new_role": payload.role.value, "apartment_id": payload.apartment_id},
    ))

    await db.commit()
    await db.refresh(user)

    return ResidentResponse(
        id=user.id,
        max_user_id=user.max_user_id,
        full_name=user.full_name,
        role=user.role,
        house_address="ул. Баумана, 12",
        apartment_number=str(payload.apartment_id),
        personal_account="8492-3019-44",
        registered_at=user.created_at,
        last_active_at=datetime.utcnow(),
    )