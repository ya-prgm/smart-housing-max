import sys
import time
import json
import hmac
import hashlib
import asyncio
import asyncpg
from typing import AsyncGenerator
from urllib.parse import urlparse
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.main import app
from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_access_token, hash_password, hash_pin
from app.core.constants import UserRole, OwnershipType, ManagementType, ProviderCategory, RecipientType
from app.models.base import Base
from app.models.user import User, UserPin, UserApartment
from app.models.house import House, Apartment, HouseServiceProvider
from app.models.topic import TicketTopic, TicketRecipient
from app.models.ticket import Ticket, TicketStatus, TicketPriority
from app.models.feed import FeedPost, FeedPostReaction, FeedPostComment
from app.models.vote import Poll, PollQuestion, PollOption, PollStatus, PollQuestionType, QuestionType

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

TEST_BOT_TOKEN = "test_bot_token_secret_12345"


def get_test_db_url() -> str:
    db_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
    parsed = urlparse(db_url)
    return f"postgresql+asyncpg://{parsed.username}:{parsed.password}@{parsed.hostname or '127.0.0.1'}:{parsed.port or 5432}/my_home_test"


async def ensure_test_database_exists():
    db_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
    parsed = urlparse(db_url)
    conn = await asyncpg.connect(
        user=parsed.username,
        password=parsed.password,
        host=parsed.hostname or "127.0.0.1",
        port=parsed.port or 5432,
        database="postgres",
        ssl=False,
    )
    try:
        exists = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = 'my_home_test'"
        )
        if not exists:
            await conn.execute('CREATE DATABASE "my_home_test"')
    finally:
        await conn.close()


@pytest.fixture(autouse=True)
def override_settings(monkeypatch):
    monkeypatch.setattr(settings, "MAX_BOT_TOKEN", TEST_BOT_TOKEN)
    monkeypatch.setattr(settings, "DATABASE_URL", get_test_db_url())


@pytest_asyncio.fixture(scope="session")
async def test_engine():
    await ensure_test_database_exists()
    test_db_url = get_test_db_url()
    engine = create_async_engine(
        test_db_url,
        echo=False,
        connect_args={"ssl": False, "statement_cache_size": 0},
        pool_size=5,
        max_overflow=10,
    )
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS unaccent;"))
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    yield engine
    await engine.dispose()


@pytest_asyncio.fixture
async def test_db(test_engine) -> AsyncGenerator[AsyncSession, None]:
    async with test_engine.connect() as connection:
        trans = await connection.begin()
        session_factory = async_sessionmaker(
            bind=connection,
            class_=AsyncSession,
            expire_on_commit=False,
            autocommit=False,
            autoflush=False,
            join_transaction_mode="create_savepoint",
        )
        async with session_factory() as session:
            await seed_test_database(session)
            yield session
            await session.close()
        await trans.rollback()


@pytest_asyncio.fixture
async def client(test_db: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
        yield test_db

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


def make_valid_init_data(bot_token: str = TEST_BOT_TOKEN, user_id: int = 123456789, auth_date: int | None = None) -> str:
    params = {
        "auth_date": str(auth_date if auth_date is not None else int(time.time())),
        "query_id": "AAHdF6IQAAAAAN0XohD9pY7q",
        "user": json.dumps({"id": user_id, "first_name": "Александр", "last_name": "Смирнов"}),
    }
    data_check = "\n".join(f"{k}={v}" for k, v in sorted(params.items()))
    secret = hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()
    h = hmac.new(secret, data_check.encode(), hashlib.sha256).hexdigest()
    params["hash"] = h
    return "&".join(f"{k}={v}" for k, v in params.items())


@pytest.fixture
def resident_token() -> str:
    return create_access_token({"sub": "123456789", "role": "resident"})


@pytest.fixture
def chairman_token() -> str:
    return create_access_token({"sub": "987654321", "role": "chairman"})


@pytest.fixture
def uk_token() -> str:
    return create_access_token({"sub": "555555555", "role": "uk_staff"})


@pytest.fixture
def resident_headers(resident_token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {resident_token}"}


@pytest.fixture
def chairman_headers(chairman_token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {chairman_token}"}


@pytest.fixture
def uk_headers(uk_token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {uk_token}"}


async def seed_test_database(session: AsyncSession):
    houses = [
        House(
            address="ул. Баумана, д. 12",
            city="Казань",
            district="Вахитовский район",
            year_built=1998,
            wear_percentage=23,
            total_area=4116.0,
            living_area=3253.9,
            floors=10,
            entrances=4,
            apartments_count=120,
            management_type=ManagementType.UK,
            uk_name="ООО УК «ЖилКомФорт»",
            uk_inn="1655389201",
            chairman_name="Елена Смирнова",
            dispatcher_phone="+7 (800) 200-12-34",
            emergency_phone="+7 (843) 210-00-00",
        ),
        House(
            address="ул. Флотская, д. 30",
            city="Казань",
            district="Кировский район",
            apartments_count=84,
            management_type=ManagementType.TSZH,
            uk_name="ТСЖ «Флотская 30»",
            uk_inn="1655490112",
        ),
        House(address="ул. Чистопольская, д. 65", city="Казань", district="Ново-Савиновский", apartments_count=210),
        House(address="ул. Декабристов, д. 85", city="Казань", district="Московский", apartments_count=96),
        House(address="пр-т Победы, д. 139", city="Казань", district="Советский", apartments_count=160),
        House(address="ул. Пушкина, д. 42", city="Казань", district="Вахитовский", apartments_count=48),
    ]
    session.add_all(houses)
    await session.flush()

    main_house = houses[0]
    second_house = houses[1]

    apt_48 = Apartment(
        house_id=main_house.id,
        number="48",
        personal_account="8492-3019-44",
        debt_amount=4820.00,
        is_debt_free=True,
    )
    apt_10 = Apartment(
        house_id=second_house.id,
        number="10",
        personal_account="1122-3344-55",
        debt_amount=0.00,
        is_debt_free=True,
    )
    session.add_all([apt_48, apt_10])
    await session.flush()

    demo_pwd_hash = hash_password("demo_password")
    users = [
        User(
            max_user_id=123456789,
            full_name="Смирнов Александр Сергеевич",
            phone="+79031234567",
            email="alex.smirnov@example.com",
            snils="123-456-789 01",
            esia_password_hash=demo_pwd_hash,
            role=UserRole.RESIDENT,
        ),
        User(
            max_user_id=987654321,
            full_name="Смирнова Елена Васильевна",
            phone="+79039876543",
            email="elena.smirnova@example.com",
            snils="987-654-321 00",
            esia_password_hash=demo_pwd_hash,
            role=UserRole.CHAIRMAN,
        ),
        User(
            max_user_id=555555555,
            full_name="Демьянов Игорь",
            phone="+78432100010",
            email="demyanov@zhilkomfort.ru",
            snils="111-222-333 44",
            esia_password_hash=demo_pwd_hash,
            role=UserRole.UK_STAFF,
        ),
    ]
    session.add_all(users)
    await session.flush()

    resident_u, chairman_u, uk_u = users[0], users[1], users[2]

    session.add_all([
        UserPin(user_id=resident_u.id, pin_hash=hash_pin("1234")),
        UserApartment(user_id=resident_u.id, apartment_id=apt_48.id, ownership_type=OwnershipType.OWNER, is_primary=True),
        UserApartment(user_id=chairman_u.id, apartment_id=apt_48.id, ownership_type=OwnershipType.OWNER, is_primary=True),
    ])

    recipients = [
        TicketRecipient(code="1", short_name="УО", full_name="Управляющая организация", category="uk", icon="corporate_fare"),
        TicketRecipient(code="2", short_name="РСО", full_name="Ресурсоснабжающая организация", category="rso", icon="water_drop"),
        TicketRecipient(code="4", short_name="ГЖИ", full_name="Государственная жилищная инспекция", category="gzhi", icon="policy"),
        TicketRecipient(code="8", short_name="ОМС", full_name="Орган местного самоуправления", category="oms", icon="account_balance"),
    ]
    session.add_all(recipients)
    await session.flush()

    topics = [
        TicketTopic(code="2.16", section_num=2, section_title="Внутридомовая территория", title="Прорыв трубы", keywords="труба,прорыв,стояк,вода"),
        TicketTopic(code="2.5", section_num=2, section_title="Внутридомовая территория", title="Неисправность лифта", keywords="лифт,застрял,скрип"),
        TicketTopic(code="1.1", section_num=1, section_title="Придомовая территория", title="Не работает уличное освещение", keywords="фонарь,свет,темно"),
        TicketTopic(code="3.11", section_num=3, section_title="Ошибки в квитанциях", title="Ошибки в квитанциях", keywords="квитанция,расчет,долг"),
        TicketTopic(code="4", section_num=4, section_title="Другая тема", title="Другая тема", keywords="прочее,разное"),
    ]
    topics[0].recipients.extend([recipients[0], recipients[1], recipients[2]])
    topics[1].recipients.extend([recipients[0], recipients[2]])
    topics[2].recipients.extend([recipients[0], recipients[3]])
    topics[3].recipients.extend([recipients[0], recipients[2]])
    topics[4].recipients.append(recipients[0])
    session.add_all(topics)
    await session.flush()

    ticket_1 = Ticket(
        code="#4812",
        house_id=main_house.id,
        apartment_id=apt_48.id,
        author_id=resident_u.id,
        topic_id=topics[0].id,
        category="Внутридомовая территория",
        title="Капает стояк ГВС на кухне",
        description="В районе вентиля появилась влага.",
        status=TicketStatus.IN_PROGRESS,
        priority=TicketPriority.HIGH,
        recipient_name="ООО «ЖилКомФорт»",
        recipients=[recipients[0], recipients[1]],
    )
    ticket_other_house = Ticket(
        code="#9901",
        house_id=second_house.id,
        apartment_id=apt_10.id,
        author_id=uk_u.id,
        topic_id=topics[1].id,
        category="Внутридомовая территория",
        title="Лифт сломался во 2 доме",
        description="Не едет на этажи.",
        status=TicketStatus.ACTIVE,
        priority=TicketPriority.MEDIUM,
        recipient_name="ООО «ЖилКомФорт»",
        recipients=[recipients[0]],
    )
    session.add_all([ticket_1, ticket_other_house])
    await session.flush()

    post = FeedPost(
        house_id=main_house.id,
        author_id=chairman_u.id,
        post_type="announcement",
        author_title="Елена Смирнова",
        title="План благоустройства",
        content="Уважаемые соседи! Согласовали план работ на весну.",
        views_count=100,
    )
    session.add(post)
    await session.flush()

    poll = Poll(
        house_id=main_house.id,
        author_id=chairman_u.id,
        author_role_badge="Председатель ТСЖ",
        title="Установка шлагбаума",
        description="Голосование по шлагбауму.",
        status=PollStatus.ACTIVE,
    )
    session.add(poll)
    await session.flush()

    question = PollQuestion(
        poll_id=poll.id,
        order_num=1,
        question_text="Поддерживаете установку?",
        question_type=PollQuestionType.SINGLE_CHOICE,
    )
    session.add(question)
    await session.flush()

    opt1 = PollOption(question_id=question.id, order_num=1, option_text="Да")
    opt2 = PollOption(question_id=question.id, order_num=2, option_text="Нет")
    session.add_all([opt1, opt2])

    await session.flush()