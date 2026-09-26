from pydantic import BaseModel
from app.schemas.common import BaseSchema
from app.core.constants import ProviderCategory, ManagementType


class HouseServiceProviderResponse(BaseSchema):
    id: int
    category: ProviderCategory
    name: str
    service_description: str
    phone: str | None = None
    brand_badge: str | None = None


class ApartmentResponse(BaseSchema):
    id: int
    number: str
    entrance: int | None = None
    floor: int | None = None
    area: float | None = None
    personal_account: str
    debt_amount: float = 0.0
    payment_deadline: str | None = None
    is_debt_free: bool = True


class HouseCardResponse(BaseSchema):
    id: int
    address: str
    city: str
    district: str
    apartments_count: int
    residents_count: int
    residents_percent: int
    active_tickets: int
    active_polls: int
    new_posts: int


class HouseDetailResponse(BaseSchema):
    id: int
    address: str
    city: str
    district: str
    postal_code: str | None = None
    fias_code: str | None = None
    cadastral_number: str | None = None
    oktmo: str | None = None
    year_built: int | None = None
    wear_percentage: int | None = None
    total_area: float | None = None
    living_area: float | None = None
    floors: int | None = None
    entrances: int | None = None
    apartments_count: int | None = None
    project_series: str | None = None
    wall_material: str | None = None
    management_type: ManagementType | None = None
    uk_name: str | None = None
    uk_inn: str | None = None
    chairman_name: str | None = None
    dispatcher_phone: str | None = None
    emergency_phone: str | None = None
    providers: list[HouseServiceProviderResponse] = []