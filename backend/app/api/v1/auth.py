from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    validate_max_init_data,
)

router = APIRouter()


class MaxLoginRequest(BaseModel):
    initData: str


class EsiaLoginRequest(BaseModel):
    identifier: str
    password: Optional[str] = None


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
    role: str  # resident | chairman | uk_staff
    avatarUrl: Optional[str] = None
    houseId: Optional[int] = 1
    apartmentNumber: Optional[str] = "42"


class AuthTokens(BaseModel):
    accessToken: str
    refreshToken: str


class LoginResponse(BaseModel):
    tokens: AuthTokens
    user: AuthUser
    hasPin: bool


@router.post("/max-login", response_model=LoginResponse)
async def login_max(payload: MaxLoginRequest):
    max_user = validate_max_init_data(payload.initData, settings.MAX_BOT_TOKEN)
    if not max_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительная подпись данных MAX WebApp",
        )

    user_id = max_user.get("id", 123456789)
    first_name = max_user.get("first_name", "Житель")
    last_name = max_user.get("last_name", "")
    full_name = f"{first_name} {last_name}".strip()

    token_data = {"sub": str(user_id), "role": "resident"}
    tokens = AuthTokens(
        accessToken=create_access_token(token_data),
        refreshToken=create_refresh_token(token_data),
    )

    return LoginResponse(
        tokens=tokens,
        user=AuthUser(
            id=1,
            maxUserId=user_id,
            fullName=full_name or "Алексей Смирнов",
            role="resident",
            houseId=1,
            apartmentNumber="42",
        ),
        hasPin=False,
    )


@router.post("/esia-login", response_model=LoginResponse)
async def login_esia(payload: EsiaLoginRequest):
    # Прототип авторизации через Госуслуги (ЕСИА)
    token_data = {"sub": "123456789", "role": "resident"}
    tokens = AuthTokens(
        accessToken=create_access_token(token_data),
        refreshToken=create_refresh_token(token_data),
    )

    return LoginResponse(
        tokens=tokens,
        user=AuthUser(
            id=1,
            maxUserId=123456789,
            fullName="Алексей Смирнов",
            role="resident",
            houseId=1,
            apartmentNumber="42",
        ),
        hasPin=False,
    )


@router.post("/refresh", response_model=AuthTokens)
async def refresh_tokens(payload: RefreshTokenRequest):
    token_data = {"sub": "123456789", "role": "resident"}
    return AuthTokens(
        accessToken=create_access_token(token_data),
        refreshToken=create_refresh_token(token_data),
    )


@router.post("/pin/setup")
async def setup_pin(payload: PinSetupRequest):
    if len(payload.pin) != 4:
        raise HTTPException(status_code=400, detail="PIN должен состоять из 4 цифр")
    return {"success": True}


@router.post("/pin/verify")
async def verify_pin(payload: PinVerifyRequest):
    return {"valid": len(payload.pin) == 4}


@router.post("/pin/reset")
async def reset_pin():
    return {"success": True}