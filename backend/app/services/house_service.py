from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.house_repo import HouseRepository
from app.schemas.house import HouseCardResponse, HouseDetailResponse, HouseServiceProviderResponse


class HouseService:
    def __init__(self, db: AsyncSession):
        self.repo = HouseRepository(db)

    async def get_houses_catalog(self) -> list[HouseCardResponse]:
        data = await self.repo.get_houses_catalog_with_stats()
        return [HouseCardResponse(**item) for item in data]

    async def get_house_passport(self, house_id: int) -> HouseDetailResponse | None:
        house = await self.repo.get_house_with_passport(house_id)
        if not house:
            return None

        providers = [
            HouseServiceProviderResponse(
                id=p.id,
                category=p.category.value,
                name=p.name,
                service_description=p.service_description,
                phone=p.phone,
                brand_badge=p.brand_badge,
            )
            for p in house.providers
        ]

        return HouseDetailResponse(
            id=house.id,
            address=house.address,
            city=house.city,
            district=house.district,
            postal_code=house.postal_code,
            fias_code=house.fias_code,
            cadastral_number=house.cadastral_number,
            oktmo=house.oktmo,
            year_built=house.year_built,
            wear_percentage=house.wear_percentage,
            total_area=house.total_area,
            living_area=house.living_area,
            floors=house.floors,
            entrances=house.entrances,
            apartments_count=house.apartments_count,
            project_series=house.project_series,
            wall_material=house.wall_material,
            management_type=house.management_type.value,
            uk_name=house.uk_name,
            uk_inn=house.uk_inn,
            chairman_name=house.chairman_name,
            dispatcher_phone=house.dispatcher_phone,
            emergency_phone=house.emergency_phone,
            providers=providers,
        )