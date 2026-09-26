import asyncio
import sys
import asyncpg
from datetime import datetime, timezone
from urllib.parse import urlparse
from sqlalchemy import text, select
from app.core.config import settings
from app.core.database import engine, AsyncSessionLocal
from app.core.security import hash_password, hash_pin
from app.models.base import Base
from app.models.user import User, UserPin, UserApartment, UserRole, OwnershipType
from app.models.house import House, Apartment, HouseServiceProvider, ManagementType, ProviderCategory
from app.models.topic import TicketTopic, TicketRecipient
from app.models.ticket import Ticket, TicketSupport, TicketStatus, TicketPriority
from app.models.feed import FeedPost, FeedPostComment, FeedPostReaction
from app.models.vote import (
    Poll,
    PollQuestion,
    PollOption,
    PollStatus,
    QuestionType,
)
from app.models.notification import Notification, NotificationCategory
from app.scripts.seed_topics import seed_topics_and_recipients

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


async def ensure_database_exists():
    db_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
    parsed = urlparse(db_url)
    target_db = parsed.path.lstrip("/")

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
            "SELECT 1 FROM pg_database WHERE datname = $1", target_db
        )
        if not exists:
            await conn.execute(f'CREATE DATABASE "{target_db}"')
    finally:
        await conn.close()


async def seed_data():
    await ensure_database_exists()

    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS unaccent;"))
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        await seed_topics_and_recipients(session)

        houses_data = [
            House(
                address="ул. Баумана, д. 12",
                city="Казань",
                district="Вахитовский район",
                postal_code="420111",
                fias_code="43abde73-2dc6-42a3-8e85-984c049ef046",
                cadastral_number="16:55:010101:1298",
                oktmo="92701000",
                year_built=1998,
                wear_percentage=23,
                total_area=4116.0,
                living_area=3253.9,
                floors=10,
                entrances=4,
                apartments_count=120,
                project_series="86-08.86",
                wall_material="Стены кирпичные",
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
                postal_code="420032",
                fias_code="e7b6d142-9f3a-4a25-83b5-7c9811234a5b",
                cadastral_number="16:55:020202:4412",
                oktmo="92701000",
                year_built=2005,
                wear_percentage=15,
                total_area=3600.0,
                living_area=2900.0,
                floors=9,
                entrances=3,
                apartments_count=84,
                project_series="111-90",
                wall_material="Панельные",
                management_type=ManagementType.TSZH,
                uk_name="ТСЖ «Флотская 30»",
                uk_inn="1655490112",
                chairman_name="Соколов В. П.",
                dispatcher_phone="+7 (843) 222-33-44",
                emergency_phone="+7 (843) 210-00-00",
            ),
            House(
                address="ул. Чистопольская, д. 65",
                city="Казань",
                district="Ново-Савиновский район",
                postal_code="420124",
                year_built=2012,
                wear_percentage=8,
                total_area=8400.0,
                living_area=6720.0,
                floors=16,
                entrances=5,
                apartments_count=210,
                management_type=ManagementType.UK,
                uk_name="ООО УК «ЖилКомФорт»",
                uk_inn="1655389201",
                dispatcher_phone="+7 (800) 200-12-34",
                emergency_phone="+7 (843) 210-00-00",
            ),
            House(
                address="ул. Декабристов, д. 85",
                city="Казань",
                district="Московский район",
                postal_code="420044",
                year_built=1985,
                wear_percentage=38,
                total_area=3900.0,
                living_area=3100.0,
                floors=9,
                entrances=3,
                apartments_count=96,
                management_type=ManagementType.UK,
                uk_name="ООО УК «ЖилКомФорт»",
                uk_inn="1655389201",
                dispatcher_phone="+7 (800) 200-12-34",
                emergency_phone="+7 (843) 210-00-00",
            ),
            House(
                address="пр-т Победы, д. 139",
                city="Казань",
                district="Советский район",
                postal_code="420100",
                year_built=2001,
                wear_percentage=20,
                total_area=6200.0,
                living_area=5100.0,
                floors=14,
                entrances=4,
                apartments_count=160,
                management_type=ManagementType.UK,
                uk_name="ООО УК «ЖилКомФорт»",
                uk_inn="1655389201",
                dispatcher_phone="+7 (800) 200-12-34",
                emergency_phone="+7 (843) 210-00-00",
            ),
            House(
                address="ул. Пушкина, д. 42",
                city="Казань",
                district="Вахитовский район",
                postal_code="420015",
                year_built=1978,
                wear_percentage=44,
                total_area=2100.0,
                living_area=1700.0,
                floors=5,
                entrances=2,
                apartments_count=48,
                management_type=ManagementType.UK,
                uk_name="ООО УК «ЖилКомФорт»",
                uk_inn="1655389201",
                dispatcher_phone="+7 (800) 200-12-34",
                emergency_phone="+7 (843) 210-00-00",
            ),
        ]
        session.add_all(houses_data)
        await session.flush()

        main_house = houses_data[0]

        apt_48 = Apartment(
            house_id=main_house.id,
            number="48",
            entrance=1,
            floor=4,
            area=54.2,
            personal_account="8492-3019-44",
            debt_amount=4820.00,
            payment_deadline="до 10 мая",
            is_debt_free=True,
        )
        session.add(apt_48)
        await session.flush()

        demo_pwd_hash = hash_password("demo_password")

        users_data = [
            User(
                max_user_id=123456789,
                full_name="Смирнов Александр Сергеевич",
                phone="+79031234567",
                email="alex.smirnov@example.com",
                role=UserRole.RESIDENT,
                snils="123-456-789 01",
                esia_password_hash=demo_pwd_hash,
            ),
            User(
                max_user_id=987654321,
                full_name="Смирнова Елена Васильевна",
                phone="+79039876543",
                email="elena.smirnova@example.com",
                role=UserRole.CHAIRMAN,
                snils="987-654-321 00",
                esia_password_hash=demo_pwd_hash,
            ),
            User(
                max_user_id=555555555,
                full_name="Демьянов Игорь",
                phone="+78432100010",
                email="demyanov@zhilkomfort.ru",
                role=UserRole.UK_STAFF,
                snils="111-222-333 44",
                esia_password_hash=demo_pwd_hash,
            ),
        ]
        session.add_all(users_data)
        await session.flush()

        resident_user = users_data[0]
        chairman_user = users_data[1]

        session.add_all([
            UserPin(user_id=resident_user.id, pin_hash=hash_pin("1234")),
            UserPin(user_id=chairman_user.id, pin_hash=hash_pin("1234")),
        ])

        session.add_all([
            UserApartment(
                user_id=resident_user.id,
                apartment_id=apt_48.id,
                ownership_type=OwnershipType.OWNER,
                is_verified_esia=True,
                is_primary=True,
            ),
            UserApartment(
                user_id=chairman_user.id,
                apartment_id=apt_48.id,
                ownership_type=OwnershipType.OWNER,
                is_verified_esia=True,
                is_primary=True,
            ),
        ])

        providers = [
            HouseServiceProvider(
                house_id=main_house.id,
                category=ProviderCategory.HEATING,
                name="АО «УСТЭК»",
                service_description="Отопление и горячее водоснабжение",
                phone="+7 (843) 277-00-00",
            ),
            HouseServiceProvider(
                house_id=main_house.id,
                category=ProviderCategory.WATER,
                name="МУП «Водоканал Казань»",
                service_description="Холодное водоснабжение и водоотведение",
                phone="+7 (843) 293-11-22",
            ),
            HouseServiceProvider(
                house_id=main_house.id,
                category=ProviderCategory.ELECTRICITY,
                name="АО «Татэнергосбыт»",
                service_description="Электроснабжение, расчетные квитанции",
                phone="+7 (800) 200-25-26",
            ),
            HouseServiceProvider(
                house_id=main_house.id,
                category=ProviderCategory.INTERNET,
                name="АО «ЭР-Телеком Холдинг»",
                service_description="Оптика до 1 Гбит/с, ТВ, Умный домофон",
                brand_badge="Дом.ру",
            ),
            HouseServiceProvider(
                house_id=main_house.id,
                category=ProviderCategory.INTERCOM,
                name="ПАО «МТС»",
                service_description="Домашний интернет, цифровое ТВ",
                brand_badge="GPON",
            ),
            HouseServiceProvider(
                house_id=main_house.id,
                category=ProviderCategory.MUNICIPAL,
                name="Управление ЖКХ Исполнительного комитета г. Казани",
                service_description="Жилищная инспекция и муниципальный контроль",
                phone="+7 (843) 292-12-34",
            ),
        ]
        session.add_all(providers)

        topic_pipe = (await session.execute(select(TicketTopic).where(TicketTopic.code == "2.16"))).scalars().first()
        topic_light = (await session.execute(select(TicketTopic).where(TicketTopic.code == "2.22"))).scalars().first()
        topic_water = (await session.execute(select(TicketTopic).where(TicketTopic.code == "2.3"))).scalars().first()
        topic_elevator = (await session.execute(select(TicketTopic).where(TicketTopic.code == "2.5"))).scalars().first()
        topic_door = (await session.execute(select(TicketTopic).where(TicketTopic.code == "1.10"))).scalars().first()
        topic_tile = (await session.execute(select(TicketTopic).where(TicketTopic.code == "1.4"))).scalars().first()

        recip_uo = (await session.execute(select(TicketRecipient).where(TicketRecipient.code == "1"))).scalars().first()
        recip_rso = (await session.execute(select(TicketRecipient).where(TicketRecipient.code == "2"))).scalars().first()
        recip_gzhi = (await session.execute(select(TicketRecipient).where(TicketRecipient.code == "4"))).scalars().first()

        default_recips = [r for r in [recip_uo, recip_rso, recip_gzhi] if r]

        tickets_data = [
            Ticket(
                code="#4812",
                house_id=main_house.id,
                apartment_id=apt_48.id,
                author_id=resident_user.id,
                topic_id=topic_pipe.id if topic_pipe else 1,
                category="Внутридомовая территория",
                title="Капает стояк ГВС на кухне",
                description="В районе вентиля появилась влага и подкапывает в стыке трубы.",
                status=TicketStatus.IN_PROGRESS,
                priority=TicketPriority.HIGH,
                is_public_in_feed=True,
                recipients=default_recips,
            ),
            Ticket(
                code="#4809",
                house_id=main_house.id,
                apartment_id=apt_48.id,
                author_id=resident_user.id,
                topic_id=topic_light.id if topic_light else 1,
                category="Внутридомовая территория",
                title="Не работает свет на 4 этаже",
                description="Перегорела лампа в коридоре у кв. 48. Вечером темно выходить к лифту.",
                status=TicketStatus.ACTIVE,
                priority=TicketPriority.MEDIUM,
                is_public_in_feed=True,
                recipients=default_recips,
            ),
            Ticket(
                code="#4806",
                house_id=main_house.id,
                apartment_id=apt_48.id,
                author_id=resident_user.id,
                topic_id=topic_water.id if topic_water else 1,
                category="Внутридомовая территория",
                title="Слабый напор горячей воды",
                description="По вечерам после 20:00 падает давление по всему стояку.",
                status=TicketStatus.ACTIVE,
                priority=TicketPriority.MEDIUM,
                is_public_in_feed=True,
                recipients=default_recips,
            ),
            Ticket(
                code="#4804",
                house_id=main_house.id,
                apartment_id=apt_48.id,
                author_id=chairman_user.id,
                topic_id=topic_elevator.id if topic_elevator else 1,
                category="Внутридомовая территория",
                title="Скрип створок лифта",
                description="Лифт во 2 подъезде издает скрежет при закрытии. Мастер вызван.",
                status=TicketStatus.IN_PROGRESS,
                priority=TicketPriority.MEDIUM,
                is_public_in_feed=True,
                recipients=default_recips,
            ),
            Ticket(
                code="#4795",
                house_id=main_house.id,
                apartment_id=apt_48.id,
                author_id=resident_user.id,
                topic_id=topic_door.id if topic_door else 1,
                category="Придомовая территория",
                title="Регулировка доводчика",
                description="Дверь сильно хлопала, отрегулировали гидроцилиндр входа.",
                status=TicketStatus.COMPLETED,
                priority=TicketPriority.LOW,
                is_public_in_feed=True,
                recipients=default_recips,
            ),
            Ticket(
                code="#4782",
                house_id=main_house.id,
                apartment_id=apt_48.id,
                author_id=resident_user.id,
                topic_id=topic_tile.id if topic_tile else 1,
                category="Придомовая территория",
                title="Плитка на крыльце",
                description="Заменили сколотые ступени у входа, швы загерметизированы.",
                status=TicketStatus.COMPLETED,
                priority=TicketPriority.LOW,
                is_public_in_feed=True,
                recipients=default_recips,
            ),
        ]
        session.add_all(tickets_data)
        await session.flush()

        session.add_all([
            TicketSupport(ticket_id=tickets_data[0].id, user_id=resident_user.id),
            TicketSupport(ticket_id=tickets_data[1].id, user_id=resident_user.id),
        ])

        posts_data = [
            FeedPost(
                house_id=main_house.id,
                author_id=chairman_user.id,
                post_type="chairman",
                author_title="Елена Смирнова",
                author_badge="Председатель",
                title=None,
                content="Уважаемые соседи! Совместно с УК согласовали план весеннего благоустройства дворовой территории. Пожалуйста, примите участие в голосовании по установке шлагбаума и камер во дворе на вкладке «Опросы»!",
                views_count=1400,
            ),
            FeedPost(
                house_id=main_house.id,
                author_id=users_data[2].id,
                post_type="uk",
                author_title="УК «ЖилКомФорт»",
                author_badge="Управляющая организация",
                title="Завершён плановый ремонт кровли над 3-м подъездом",
                content="Приемка работ проведена комиссионно с участием членов Совета МКД. Подписан акт гарантийных обязательств подрядчика на 3 года.",
                image_url="/uploads/feed/roof_repair.jpg",
                image_label="Фотоотчет приёмки",
                views_count=890,
            ),
            FeedPost(
                house_id=main_house.id,
                author_id=users_data[2].id,
                post_type="uk",
                author_title="УК «ЖилКомФорт»",
                author_badge="Управляющая организация",
                title="Весенняя промывка стволов мусоропроводов",
                content="Со вторника по четверг в подъездах 1–4 будет проводиться комплексная санитарная промывка стволов мусоропроводов и дезинфекция мусорокамер. Просим плотно закрывать клапаны на этажах во время проведения работ.",
                views_count=450,
            ),
        ]
        session.add_all(posts_data)
        await session.flush()

        session.add_all([
            FeedPostReaction(post_id=posts_data[0].id, user_id=resident_user.id, reaction_type="like"),
            FeedPostComment(
                post_id=posts_data[0].id,
                author_id=resident_user.id,
                content="А когда именно начнут укладывать резиновое покрытие на детской площадке? До майских праздников успеют?",
            ),
        ])

        poll = Poll(
            house_id=main_house.id,
            author_id=chairman_user.id,
            author_role_badge="Председатель ТСЖ",
            title="Установка шлагбаума и системы видеонаблюдения во дворе",
            description="Уважаемые собственники и жильцы! Для повышения безопасности нашего двора, ограничения несанкционированного въезда постороннего транспорта и сохранности детской площадки предлагается утвердить установку автоматического шлагбаума с GSM-модулем и распознаванием номеров, а также монтаж 6 камер видеонаблюдения.",
            status=PollStatus.ACTIVE,
            estimated_time="~3 минуты",
            deadline_text="До 25 мая",
            protocol_number="№ 48-ОСС",
            image_url="/uploads/polls/barrier.jpg",
        )
        session.add(poll)
        await session.flush()

        q1 = PollQuestion(
            poll_id=poll.id,
            order_num=1,
            question_text="Поддерживаете ли вы установку автоматического шлагбаума на главном въезде во двор со стороны ул. Баумана?",
            subtext="В стоимость входит установка шлагбаума, считывателя номеров и 2 радиопульта на каждую квартиру.",
            question_type=QuestionType.SINGLE,
            image_url="/uploads/polls/q1_barrier.jpg",
        )
        q2 = PollQuestion(
            poll_id=poll.id,
            order_num=2,
            question_text="Какие пожелания или ограничения по проезду транспорта во двор вы хотите учесть?",
            subtext="Например, гостевой доступ, график разгрузки курьеров, машины экстренных служб или доставка крупногабаритных товаров.",
            question_type=QuestionType.TEXT,
        )
        q3 = PollQuestion(
            poll_id=poll.id,
            order_num=3,
            question_text="Какие способы открытия шлагбаума должны поддерживаться?",
            subtext="Выберите один или несколько вариантов, которые наиболее удобны для вашей семьи.",
            question_type=QuestionType.MULTIPLE,
        )
        session.add_all([q1, q2, q3])
        await session.flush()

        session.add_all([
            PollOption(question_id=q1.id, order_num=1, option_text="Да, полностью поддерживаю", subtext="Включая брелоки и доступ для экстренных служб"),
            PollOption(question_id=q1.id, order_num=2, option_text="Поддерживаю, но без дополнительных пультов", subtext="Только открытие через мобильное приложение и по госномеру"),
            PollOption(question_id=q1.id, order_num=3, option_text="Против установки шлагбаума", subtext="Считаю ограничения въезда нецелесообразными"),
            PollOption(question_id=q1.id, order_num=4, option_text="Затрудняюсь ответить / Воздержусь", subtext="Нужно больше технической информации"),

            PollOption(question_id=q3.id, order_num=1, option_text="Мобильное приложение (по кнопке в смартфоне)", subtext="Быстрое открытие из дома или автомобиля через мини-приложение MAX"),
            PollOption(question_id=q3.id, order_num=2, option_text="Автоматическое считывание госномера камерой", subtext="Камера распознает номер автомобиля из базы жильцов при подъезде"),
            PollOption(question_id=q3.id, order_num=3, option_text="Классический радиобрелок / пульт", subtext="Физический пульт дистанционного управления (до 2 шт. на квартиру)"),
            PollOption(question_id=q3.id, order_num=4, option_text="Открытие по звонку с телефона на номер шлагбаума", subtext="Звонок с зарегистрированного номера собственника"),
        ])

        notifications_data = [
            Notification(
                user_id=resident_user.id,
                category=NotificationCategory.UK,
                author_name="УК «ЖилКомФорт»",
                author_badge="УК",
                title="Плановое отключение ГВС",
                text="В связи с гидравлическими испытаниями в 3-м подъезде подача горячей воды будет приостановлена с 13:00 до 17:00.",
                is_read=False,
            ),
            Notification(
                user_id=resident_user.id,
                category=NotificationCategory.CHAIRMAN,
                author_name="Елена Смирнова",
                author_badge="Председатель",
                title="Запущен новый опрос по шлагбауму",
                text="Пожалуйста, проголосуйте во вкладке «Опросы». Сбор мнений продлится до 25 мая.",
                is_read=False,
                action_url=f"/votes/{poll.id}",
            ),
            Notification(
                user_id=resident_user.id,
                category=NotificationCategory.SYSTEM,
                author_name="Система",
                author_badge=None,
                title="Оплата счета ЖКХ успешно проведена",
                text="Платеж на сумму 4 820 ₽ через СБП успешно зачислен на лицевой счет 8492-3019-44. Чек доступен в профиле.",
                is_read=False,
            ),
            Notification(
                user_id=resident_user.id,
                category=NotificationCategory.CHAIRPERSON,
                author_name="Елена Смирнова",
                author_badge="Председатель",
                title="Итоги встречи Совета МКД",
                text="Протокол согласования благоустройства двора опубликован в ленте дома.",
                is_read=True,
            ),
            Notification(
                user_id=resident_user.id,
                category=NotificationCategory.UK,
                author_name="УК «ЖилКомФорт»",
                author_badge=None,
                title="Обращение #104 закрыто",
                text="Замена лампы освещения на 4-м этаже выполнена.",
                is_read=True,
            ),
            Notification(
                user_id=resident_user.id,
                category=NotificationCategory.SYSTEM,
                author_name="Система",
                author_badge=None,
                title="Сформирован ЕПД за апрель 2025",
                text="Квитанция начислений за ЖКУ готова к просмотру и оплате.",
                is_read=True,
            ),
        ]
        session.add_all(notifications_data)

        await session.commit()
    print("База данных успешно инициализирована с классификатором тем, получателями и FTS-индексами!")


if __name__ == "__main__":
    asyncio.run(seed_data())