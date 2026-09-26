from pydantic import BaseModel, ConfigDict
from app.schemas.common import BaseSchema


class HouseServiceProviderResponse(BaseSchema):
    id: int
    category: str
    name: str
    service_description: str
    phone: str | None = None
    brand_badge: str | None = None


class ApartmentResponse(BaseSchema):
    id: int
    number: str
    entrance: int
    floor: int
    area: float
    personal_account: str
    debt_amount: float
    payment_deadline: str
    is_debt_free: bool


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
    is_selected: bool = False


class HouseDetailResponse(BaseSchema):
    id: int
    address: str
    city: str
    district: str
    postal_code: str | None = None
    fias_code: str | None = None
    cadastral_number: str | None = None
    oktmo: str | None = None
    year_built: int
    wear_percentage: int
    total_area: float
    living_area: float
    floors: int
    entrances: int
    apartments_count: int
    project_series: str | None = None
    wall_material: str | None = None
    management_type: str
    uk_name: str
    uk_inn: str
    chairman_name: str | None = None
    dispatcher_phone: str
    emergency_phone: str
    providers: list[HouseServiceProviderResponse] = []