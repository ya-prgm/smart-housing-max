import asyncio
import sys
from urllib.parse import urlparse
import asyncpg
from sqlalchemy import text, select
from app.core.config import settings
from app.core.database import engine, AsyncSessionLocal
from app.models.base import Base
from app.models.user import User
from app.scripts.seed import seed_data


async def init_database():
    db_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
    parsed = urlparse(db_url)
    target_db = parsed.path.lstrip("/")

    connected = False
    for _ in range(30):
        try:
            conn = await asyncpg.connect(
                user=parsed.username,
                password=parsed.password,
                host=parsed.hostname or "127.0.0.1",
                port=parsed.port or 5432,
                database=target_db,
                ssl=False,
            )
            await conn.close()
            connected = True
            break
        except Exception:
            try:
                conn = await asyncpg.connect(
                    user=parsed.username,
                    password=parsed.password,
                    host=parsed.hostname or "127.0.0.1",
                    port=parsed.port or 5432,
                    database="template1",
                    ssl=False,
                )
                exists = await conn.fetchval(
                    "SELECT 1 FROM pg_database WHERE datname = $1", target_db
                )
                if not exists:
                    await conn.execute(f'CREATE DATABASE "{target_db}"')
                await conn.close()
                connected = True
                break
            except Exception:
                await asyncio.sleep(1)

    if not connected:
        sys.exit(1)

    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS unaccent;"))
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).limit(1))
        has_users = result.scalars().first() is not None

    if not has_users:
        await seed_data(drop=False)


if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(init_database())
