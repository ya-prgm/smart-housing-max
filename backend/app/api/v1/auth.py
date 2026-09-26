from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
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
from app.models.user import User, UserPin, RefreshToken, UserRole

router = APIRouter()


class MaxLoginRequest(BaseModel):
    initData: str


class RefreshTokenRequest(BaseModel):
    refreshToken: str


class PinSetupRequest(BaseModel):
    pin: str


class PinVerifyRequest(BaseModel):
    pin: str


class AuthUser(BaseModel):
    id: int
    maxUserId: int
    fullName: str
    role: UserRole
    houseId: int | None = 1
    apartmentNumber: str | None = "48"


class AuthTokens(BaseModel):
    accessToken: str
    refreshToken: str


class LoginResponse(BaseModel):
    tokens: AuthTokens
    user: AuthUser
    hasPin: bool


@router.post("/max-login", response_model=LoginResponse)
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
    full_name = f"{first_name} {last_name}".strip() or "Житель МКД"

    stmt = select(User).where(User.max_user_id == max_user_id).options(selectinload(User.pin), selectinload(User.apartments))
    user = (await db.execute(stmt)).scalars().first()

    if not user:
        user = User(
            max_user_id=max_user_id,
            full_name=full_name,
            role=UserRole.RESIDENT,
        )
        db.add(user)
        await db.flush()

    token_data = {"sub": str(user.max_user_id), "role": user.role.value}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    db.add(RefreshToken(user_id=user.id, token_hash=refresh_token, expires_at=settings.REFRESH_TOKEN_EXPIRE_DAYS))
    await db.commit()

    return LoginResponse(
        tokens=AuthTokens(accessToken=access_token, refreshToken=refresh_token),
        user=AuthUser(
            id=user.id,
            maxUserId=user.max_user_id,
            fullName=user.full_name,
            role=user.role,
            houseId=1,
            apartmentNumber="48",
        ),
        hasPin=bool(user.pin is not None),
    )


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

    db.add(RefreshToken(user_id=user.id, token_hash=new_refresh, expires_at=settings.REFRESH_TOKEN_EXPIRE_DAYS))
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