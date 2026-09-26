import random
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.ticket import Ticket, TicketAttachment
from app.models.user import User
from app.repositories.ticket_repo import TicketRepository
from app.schemas.ticket import TicketCreate, TicketResponse, TicketSupportResponse


class TicketService:
    def __init__(self, db: AsyncSession):
        self.repo = TicketRepository(db)
        self.db = db

    async def get_tickets(
        self,
        house_id: int,
        current_user: User,
        status_filter: str | None = None,
        only_my: bool = False,
        search: str | None = None,
    ) -> list[TicketResponse]:
        tickets = await self.repo.get_house_tickets(
            house_id=house_id,
            status_filter=status_filter,
            only_my_user_id=current_user.id if only_my else None,
            search_query=search,
        )

        result = []
        for t in tickets:
            is_my = (t.author_id == current_user.id)
            votes_count = len(t.supports)
            is_voted = any(s.user_id == current_user.id for s in t.supports)
            date_str = t.created_at.strftime("%d %b")

            result.append(
                TicketResponse(
                    id=t.id,
                    code=t.code,
                    category=t.category,
                    title=t.title,
                    description=t.description,
                    status=t.status.value,
                    priority=t.priority.value,
                    created_at=t.created_at,
                    date_formatted=date_str,
                    is_my=is_my,
                    votes_count=votes_count,
                    is_voted=is_voted,
                    resolved_label=t.resolved_label,
                    recipient_name=t.recipient_name,
                )
            )
        return result

    async def create_ticket(self, payload: TicketCreate, author: User) -> Ticket:
        apt_id = 1
        if author.apartments:
            apt_id = author.apartments[0].apartment_id

        ticket_code = f"#{random.randint(4820, 9999)}"

        ticket = await self.repo.create(
            code=ticket_code,
            house_id=payload.house_id,
            apartment_id=apt_id,
            author_id=author.id,
            recipient_type=payload.recipient_type,
            recipient_name=payload.recipient_name,
            category=payload.category,
            topic_code=payload.topic_code,
            title=payload.title,
            description=payload.description,
            is_public_in_feed=payload.is_public_in_feed,
        )

        for url in payload.attachment_urls:
            att = TicketAttachment(
                ticket_id=ticket.id,
                file_url=url,
                file_name="вложение.jpg",
                mime_type="image/jpeg",
            )
            self.db.add(att)

        await self.db.commit()
        return ticket

    async def toggle_support(self, ticket_id: int, user_id: int) -> TicketSupportResponse:
        votes, is_supported = await self.repo.toggle_support(ticket_id, user_id)
        await self.db.commit()
        return TicketSupportResponse(
            ticket_id=ticket_id,
            votes_count=votes,
            is_supported_by_me=is_supported,
        )