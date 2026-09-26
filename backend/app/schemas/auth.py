from pydantic import BaseModel
from app.schemas.common import BaseSchema
from app.core.constants import UserRole


class MaxLoginRequest(BaseModel):
    initData: str


class EsiaLoginRequest(BaseModel):
    identifier: str
    password: str


class RefreshTokenRequest(BaseModel):
    refreshToken: str


class PinSetupRequest(BaseModel):
    pin: str


class PinVerifyRequest(BaseModel):
    pin: str


class AuthUser(BaseSchema):
    id: int
    max_user_id: int
    full_name: str
    role: UserRole
    house_id: int | None = None
    house_address: str | None = None
    apartment_number: str | None = None


class AuthTokens(BaseModel):
    accessToken: str
    refreshToken: str


class LoginResponse(BaseModel):
    tokens: AuthTokens
    user: AuthUser
    hasPin: bool