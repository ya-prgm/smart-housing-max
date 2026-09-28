from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.schemas.common import BaseSchema
from app.core.constants import UserRole, EsiaSyncStatus


class UserUpdateRequest(BaseModel):
    email: EmailStr | None = None
    phone: str | None = Field(default=None, pattern=r"^\+?7\d{10}$")
    notifications_enabled: bool | None = None


class UserProfileResponse(BaseSchema):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    max_user_id: int
    full_name: str
    phone: str | None = None
    email: str | None = None
    role: UserRole
    house_id: int | None = None
    house_address: str | None = None
    apartment_number: str | None = None
    personal_account: str | None = None
    debt_amount: float = 0.0
    is_debt_free: bool = True
    notifications_enabled: bool = True

    esia_linked: bool = Field(default=False, alias="esiaLinked")
    esia_linked_at: datetime | None = Field(default=None, alias="esiaLinkedAt")
    esia_last_sync_at: datetime | None = Field(default=None, alias="esiaLastSyncAt")
    esia_sync_status: EsiaSyncStatus = Field(default=EsiaSyncStatus.NEVER, alias="esiaSyncStatus")
    esia_token_expires_at: datetime | None = Field(default=None, alias="esiaTokenExpiresAt")