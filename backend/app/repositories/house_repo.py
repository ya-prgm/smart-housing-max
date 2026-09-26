from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.house import House, Apartment
from app.models.ticket import Ticket, TicketStatus
from app.models.vote import Poll, PollStatus
from app.models.feed import FeedPost
from app.models.user import UserApartment
from app.repositories.base import BaseRepository


class HouseRepository(BaseRepository[House]):
    def __init__(self, db: AsyncSession):
        super().__init__(House, db)

    async def get_house_with_passport(self, house_id: int) -> House | None:
        stmt = (
            select(House)
            .where(House.id == house_id)
            .options(
                selectinload(House.providers),
                selectinload(House.apartments),
            )
        )
        res = await self.db.execute(stmt)
        return res.scalars().first()

    async def get_houses_catalog_with_stats(self) -> list[dict]:
        stmt = select(House).order_by(House.id)
        res = await self.db.execute(stmt)
        houses = res.scalars().all()

        results = []
        for h in houses:
            res_count_stmt = (
                select(func.count(UserApartment.id))
                .join(Apartment, Apartment.id == UserApartment.apartment_id)
                .where(Apartment.house_id == h.id)
            )
            residents_count = (await self.db.execute(res_count_stmt)).scalar() or 0

            active_tickets_stmt = (
                select(func.count(Ticket.id))
                .where(
                    Ticket.house_id == h.id,
                    Ticket.status.in_([TicketStatus.ACTIVE, TicketStatus.IN_PROGRESS]),
                    Ticket.is_deleted == False,
                )
            )
            active_tickets = (await self.db.execute(active_tickets_stmt)).scalar() or 0

            active_polls_stmt = (
                select(func.count(Poll.id))
                .where(
                    Poll.house_id == h.id,
                    Poll.status == PollStatus.ACTIVE,
                    Poll.is_deleted == False,
                )
            )
            active_polls = (await self.db.execute(active_polls_stmt)).scalar() or 0

            new_posts_stmt = (
                select(func.count(FeedPost.id))
                .where(FeedPost.house_id == h.id, FeedPost.is_deleted == False)
            )
            new_posts = (await self.db.execute(new_posts_stmt)).scalar() or 0

            pct = int((residents_count / h.apartments_count * 100)) if h.apartments_count else 0

            results.append({
                "id": h.id,
                "address": h.address,
                "city": h.city,
                "district": h.district,
                "apartments_count": h.apartments_count,
                "residents_count": residents_count,
                "residents_percent": pct,
                "active_tickets": active_tickets,
                "active_polls": active_polls,
                "new_posts": new_posts,
            })

        return results