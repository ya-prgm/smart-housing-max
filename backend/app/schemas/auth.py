from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.common import BaseSchema
from app.core.constants import UserRole, EsiaSyncStatus


class MaxLoginRequest(BaseModel):
    initData: str


class EsiaLoginRequest(BaseModel):
    identifier: str
    password: str
    initData: str | None = None
    max_user_id: int | None = None


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
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    tokens: AuthTokens
    user: AuthUser
    has_pin: bool = Field(alias="hasPin")
    needs_esia_auth: bool = Field(alias="needsEsiaAuth")
    esia_linked_at: datetime | None = Field(default=None, alias="esiaLinkedAt")
    esia_last_sync_at: datetime | None = Field(default=None, alias="esiaLastSyncAt")
    esia_sync_status: EsiaSyncStatus = Field(default=EsiaSyncStatus.NEVER, alias="esiaSyncStatus")
    esia_token_expires_at: datetime | None = Field(default=None, alias="esiaTokenExpiresAt")