from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.database import get_db
from app.core.security import (
    create_access_token,
    create_refresh_token,
    validate_max_init_data,
    check_auth_date,
    hash_pin,
    verify_pin,
)
from app.api.deps import get_current_user
from app.models.user import User, UserPin, RefreshToken
from app.models.house import Apartment
from app.core.constants import UserRole, EsiaSyncStatus
from app.services.esia_service import EsiaService
from app.schemas.auth import (
    MaxLoginRequest,
    EsiaLoginRequest,
    RefreshTokenRequest,
    PinSetupRequest,
    PinVerifyRequest,
    LoginResponse,
    AuthUser,
    AuthTokens,
)
from app.schemas.common import StatusResponse, ErrorResponse

router = APIRouter()


async def build_login_response(user: User, db: AsyncSession, needs_esia: bool) -> LoginResponse:
    token_data = {"sub": str(user.max_user_id), "role": user.role.value}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    refresh_expiry = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db.add(RefreshToken(user_id=user.id, token_hash=refresh_token, expires_at=refresh_expiry))
    await db.commit()

    house_id = None
    house_address = None
    apt_number = None

    if user.apartments:
        ua = user.apartments[0]
        apt_stmt = select(Apartment).where(Apartment.id == ua.apartment_id).options(selectinload(Apartment.house))
        apt = (await db.execute(apt_stmt)).scalars().first()
        if apt:
            house_id = apt.house_id
            apt_number = apt.number
            if apt.house:
                house_address = apt.house.address

    return LoginResponse(
        tokens=AuthTokens(accessToken=access_token, refreshToken=refresh_token),
        user=AuthUser(
            id=user.id,
            max_user_id=user.max_user_id,
            full_name=user.full_name,
            role=user.role,
            house_id=house_id,
            house_address=house_address,
            apartment_number=apt_number,
        ),
        has_pin=bool(user.pin is not None),
        needs_esia_auth=needs_esia,
        esia_linked_at=user.esia_linked_at,
        esia_last_sync_at=user.esia_last_sync_at,
        esia_sync_status=user.esia_sync_status,
        esia_token_expires_at=user.esia_token_expires_at,
    )


@router.post(
    "/max-login",
    response_model=LoginResponse,
    responses={
        401: {
            "model": ErrorResponse,
            "description": "INVALID_INIT_DATA или INIT_DATA_EXPIRED",
        }
    },
)
async def login_max(payload: MaxLoginRequest, db: AsyncSession = Depends(get_db)):
    if not payload.initData:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "INVALID_INIT_DATA", "message": "Строка initData пуста"}},
        )

    validated_params = validate_max_init_data(payload.initData, settings.MAX_BOT_TOKEN)
    if not validated_params:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "INVALID_INIT_DATA", "message": "Подпись initData невалидна"}},
        )

    auth_date = int(validated_params.get("auth_date", 0))
    if not check_auth_date(auth_date, max_age_seconds=3600):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "INIT_DATA_EXPIRED", "message": "Срок действия initData истек"}},
        )

    user_raw = validated_params.get("user")
    if not user_raw or "id" not in user_raw:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "INVALID_INIT_DATA", "message": "Пользователь не найден в initData"}},
        )

    max_user_id = user_raw["id"]
    first_name = user_raw.get("first_name", "")
    last_name = user_raw.get("last_name", "")
    full_name = f"{first_name} {last_name}".strip() or "Пользователь MAX"

    stmt = select(User).where(User.max_user_id == max_user_id).options(selectinload(User.pin), selectinload(User.apartments))
    user = (await db.execute(stmt)).scalars().first()

    if not user:
        user = User(
            max_user_id=max_user_id,
            full_name=full_name,
            role=UserRole.RESIDENT,
            esia_sync_status=EsiaSyncStatus.NEVER,
        )
        db.add(user)
        await db.flush()

    esia_service = EsiaService(db)
    synced = await esia_service.sync_user(user)
    needs_esia = not synced or not user.esia_access_token

    return await build_login_response(user, db, needs_esia=needs_esia)


@router.post(
    "/esia-login",
    response_model=LoginResponse,
    summary="Login ESIA (MOCK)",
    description="Имитация входа через ЕСИА (Госуслуги). Реальная интеграция требует аккредитации в Минцифры и подключения к СМЭВ ЕСИА. Для демонстрации используются тестовые учётные записи.",
    responses={
        401: {
            "model": ErrorResponse,
            "description": "INVALID_CREDENTIALS",
        }
    },
)
async def login_esia(
    payload: EsiaLoginRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    esia_service = EsiaService(db)
    esia_user = await esia_service.authenticate(payload.identifier, payload.password)

    if not esia_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "INVALID_CREDENTIALS", "message": "Неверный логин или пароль"}},
        )

    updated_user = await esia_service.link_to_user(current_user, esia_user)
    return await build_login_response(updated_user, db, needs_esia=False)


@router.post(
    "/esia-sync",
    response_model=LoginResponse,
    responses={
        401: {
            "model": ErrorResponse,
            "description": "ESIA_TOKEN_EXPIRED",
        }
    },
)
async def sync_esia_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    esia_service = EsiaService(db)
    success = await esia_service.sync_user(current_user)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "ESIA_TOKEN_EXPIRED", "message": "Сессия Госуслуг устарела, требуется повторный вход"}},
        )
    return await build_login_response(current_user, db, needs_esia=False)


@router.post("/esia-unlink", response_model=StatusResponse)
async def unlink_esia_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    esia_service = EsiaService(db)
    await esia_service.unlink(current_user)
    return StatusResponse(status="ok", message="Учетная запись Госуслуг отвязана")


@router.post("/refresh", response_model=AuthTokens)
async def refresh_tokens(payload: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    stmt = select(RefreshToken).where(RefreshToken.token_hash == payload.refreshToken, RefreshToken.revoked == False)
    token_record = (await db.execute(stmt)).scalars().first()

    if not token_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "INVALID_TOKEN", "message": "Недействительный RefreshToken"}},
        )

    user = await db.get(User, token_record.user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Пользователь не найден")

    token_record.revoked = True
    new_access = create_access_token({"sub": str(user.max_user_id), "role": user.role.value})
    new_refresh = create_refresh_token({"sub": str(user.max_user_id), "role": user.role.value})

    refresh_expiry = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db.add(RefreshToken(user_id=user.id, token_hash=new_refresh, expires_at=refresh_expiry))
    await db.commit()

    return AuthTokens(accessToken=new_access, refreshToken=new_refresh)


@router.post("/pin/setup")
async def setup_pin(
    payload: PinSetupRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if len(payload.pin) != 4 or not payload.pin.isdigit():
        raise HTTPException(status_code=400, detail="PIN должен состоять ровно из 4 цифр")

    hashed = hash_pin(payload.pin)
    stmt = select(UserPin).where(UserPin.user_id == current_user.id)
    existing_pin = (await db.execute(stmt)).scalars().first()

    if existing_pin:
        existing_pin.pin_hash = hashed
    else:
        db.add(UserPin(user_id=current_user.id, pin_hash=hashed))

    await db.commit()
    return {"status": "ok"}


@router.post("/pin/verify")
async def verify_user_pin(
    payload: PinVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(UserPin).where(UserPin.user_id == current_user.id)
    user_pin = (await db.execute(stmt)).scalars().first()

    if not user_pin:
        return {"valid": False}

    is_valid = verify_pin(payload.pin, user_pin.pin_hash)
    return {"valid": is_valid}


@router.post("/pin/reset")
async def reset_user_pin(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(UserPin).where(UserPin.user_id == current_user.id)
    user_pin = (await db.execute(stmt)).scalars().first()

    if user_pin:
        await db.delete(user_pin)
        await db.commit()

    return {"status": "ok"}