from pydantic import BaseModel, EmailStr
from app.schemas.common import BaseSchema
from app.core.constants import UserRole


class UserUpdateRequest(BaseModel):
    email: EmailStr | None = None
    phone: str | None = None
    notifications_enabled: bool | None = None


class UserProfileResponse(BaseSchema):
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