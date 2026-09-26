from typing import Sequence
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.ticket import Ticket, TicketSupport, TicketStatus
from app.repositories.base import BaseRepository


class TicketRepository(BaseRepository[Ticket]):
    def __init__(self, db: AsyncSession):
        super().__init__(Ticket, db)

    async def get_house_tickets(
        self,
        house_id: int,
        status_filter: str | None = None,
        only_my_user_id: int | None = None,
        search_query: str | None = None,
    ) -> Sequence[Ticket]:
        stmt = (
            select(Ticket)
            .where(Ticket.house_id == house_id, Ticket.is_deleted == False)
            .options(
                selectinload(Ticket.supports),
                selectinload(Ticket.attachments),
            )
            .order_by(desc(Ticket.id))
        )

        if only_my_user_id:
            stmt = stmt.where(Ticket.author_id == only_my_user_id)

        if status_filter and status_filter != "all":
            if status_filter == "active":
                stmt = stmt.where(Ticket.status == TicketStatus.ACTIVE)
            elif status_filter == "in_progress":
                stmt = stmt.where(Ticket.status == TicketStatus.IN_PROGRESS)
            elif status_filter == "completed":
                stmt = stmt.where(Ticket.status == TicketStatus.COMPLETED)

        if search_query:
            q = f"%{search_query.lower()}%"
            stmt = stmt.where(
                func.lower(Ticket.title).like(q)
                | func.lower(Ticket.description).like(q)
                | func.lower(Ticket.category).like(q)
            )

        res = await self.db.execute(stmt)
        return res.scalars().all()

    async def toggle_support(self, ticket_id: int, user_id: int) -> tuple[int, bool]:
        stmt = select(TicketSupport).where(
            TicketSupport.ticket_id == ticket_id,
            TicketSupport.user_id == user_id,
        )
        res = await self.db.execute(stmt)
        existing = res.scalars().first()

        if existing:
            await self.db.delete(existing)
            await self.db.flush()
            is_supported = False
        else:
            new_supp = TicketSupport(ticket_id=ticket_id, user_id=user_id)
            self.db.add(new_supp)
            await self.db.flush()
            is_supported = True

        cnt_stmt = select(func.count(TicketSupport.id)).where(TicketSupport.ticket_id == ticket_id)
        total_votes = (await self.db.execute(cnt_stmt)).scalar() or 0

        return total_votes, is_supported