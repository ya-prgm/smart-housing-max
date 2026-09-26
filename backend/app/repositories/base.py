from typing import Generic, TypeVar, Type, Any, Sequence
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], db: AsyncSession):
        self.model = model
        self.db = db

    async def get_by_id(self, id_val: Any) -> ModelType | None:
        return await self.db.get(self.model, id_val)

    async def get_all(self, limit: int = 100, offset: int = 0) -> Sequence[ModelType]:
        stmt = select(self.model).limit(limit).offset(offset)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def create(self, **kwargs) -> ModelType:
        instance = self.model(**kwargs)
        self.db.add(instance)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def delete(self, id_val: Any) -> bool:
        instance = await self.get_by_id(id_val)
        if not instance:
            return False
        await self.db.delete(instance)
        await self.db.flush()
        return True