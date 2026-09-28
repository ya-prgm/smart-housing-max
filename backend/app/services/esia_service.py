import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.user import User
from app.core.security import verify_password
from app.core.constants import EsiaSyncStatus


class EsiaService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def authenticate(self, identifier: str, password: str) -> User | None:
        clean = identifier.strip()
        compact = clean.replace(" ", "").replace("-", "")

        stmt = select(User).where(
            or_(
                User.snils == clean,
                User.snils == compact,
                User.phone == clean,
                User.phone == compact,
                User.email == clean.lower(),
            )
        ).options(selectinload(User.pin), selectinload(User.apartments))

        user = (await self.db.execute(stmt)).scalars().first()
        if not user or not user.is_active or not user.esia_password_hash:
            return None

        if not verify_password(password, user.esia_password_hash):
            return None

        return user

    async def link_to_user(self, current_user: User, esia_user: User) -> User:
        now = datetime.now(timezone.utc)
        token_uuid = uuid.uuid4().hex

        current_user.full_name = esia_user.full_name
        current_user.snils = esia_user.snils
        current_user.phone = esia_user.phone
        current_user.email = esia_user.email
        current_user.role = esia_user.role

        current_user.esia_user_id = esia_user.snils or esia_user.email or str(esia_user.id)
        current_user.esia_access_token = f"esia_at_{token_uuid}"
        current_user.esia_refresh_token = f"esia_rt_{token_uuid}"
        current_user.esia_token_expires_at = now + timedelta(days=30)
        current_user.esia_linked_at = now
        current_user.esia_last_sync_at = now
        current_user.esia_sync_status = EsiaSyncStatus.SUCCESS

        await self.db.commit()
        await self.db.refresh(current_user)
        return current_user

    async def sync_user(self, user: User) -> bool:
        now = datetime.now(timezone.utc)
        if not user.esia_access_token:
            user.esia_sync_status = EsiaSyncStatus.NEVER
            await self.db.commit()
            return False

        if user.esia_token_expires_at and user.esia_token_expires_at < now:
            user.esia_access_token = None
            user.esia_refresh_token = None
            user.esia_sync_status = EsiaSyncStatus.EXPIRED
            await self.db.commit()
            return False

        user.esia_last_sync_at = now
        user.esia_sync_status = EsiaSyncStatus.SUCCESS
        await self.db.commit()
        return True

    async def unlink(self, user: User) -> None:
        user.esia_user_id = None
        user.esia_access_token = None
        user.esia_refresh_token = None
        user.esia_token_expires_at = None
        user.esia_linked_at = None
        user.esia_sync_status = EsiaSyncStatus.NEVER
        await self.db.commit()