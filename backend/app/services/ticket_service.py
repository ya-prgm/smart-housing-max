import random
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.ticket import Ticket, TicketAttachment
from app.models.house import House, Apartment
from app.models.user import User, UserApartment, UserRole
from app.models.file import File as FileModel
from app.core.constants import TicketStatus, RecipientType
from app.repositories.ticket_repo import TicketRepository
from app.schemas.ticket import TicketCreate, TicketResponse, TicketSupportResponse, TicketAttachmentResponse


class TicketService:
    def __init__(self, db: AsyncSession):
        self.repo = TicketRepository(db)
        self.db = db

    async def get_tickets(
        self,
        house_id: int,
        current_user: User,
        status_filter: TicketStatus | None = None,
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
            author_name = t.author.full_name if (is_my or current_user.role in (UserRole.UK_STAFF, UserRole.CHAIRMAN)) else None

            attachments = [
                TicketAttachmentResponse(
                    id=att.file.id,
                    url=f"/api/v1/files/{att.file.id}",
                    filename=att.file.original_name,
                    size=att.file.size_bytes,
                    mime_type=att.file.mime_type,
                )
                for att in t.attachments
                if att.file
            ]

            result.append(
                TicketResponse(
                    id=t.id,
                    code=t.code,
                    category=t.category,
                    title=t.title,
                    description=t.description,
                    status=t.status,
                    priority=t.priority,
                    created_at=t.created_at,
                    is_my=is_my,
                    votes_count=votes_count,
                    is_voted=is_voted,
                    recipient_name=t.recipient_name,
                    house_address=t.house.address if t.house else "",
                    author_full_name=author_name,
                    attachments=attachments,
                )
            )
        return result

    async def get_ticket_details(self, ticket_id: int, current_user: User) -> TicketResponse | None:
        t = await self.repo.get_ticket_by_id_detailed(ticket_id)
        if not t:
            return None

        is_my = (t.author_id == current_user.id)
        author_name = t.author.full_name if (is_my or current_user.role in (UserRole.UK_STAFF, UserRole.CHAIRMAN)) else None

        attachments = [
            TicketAttachmentResponse(
                id=att.file.id,
                url=f"/api/v1/files/{att.file.id}",
                filename=att.file.original_name,
                size=att.file.size_bytes,
                mime_type=att.file.mime_type,
            )
            for att in t.attachments
            if att.file
        ]

        return TicketResponse(
            id=t.id,
            code=t.code,
            category=t.category,
            title=t.title,
            description=t.description,
            status=t.status,
            priority=t.priority,
            created_at=t.created_at,
            is_my=is_my,
            votes_count=len(t.supports),
            is_voted=any(s.user_id == current_user.id for s in t.supports),
            recipient_name=t.recipient_name,
            house_address=t.house.address if t.house else "",
            author_full_name=author_name,
            attachments=attachments,
        )

    async def create_ticket(self, payload: TicketCreate, author: User) -> TicketResponse:
        stmt = (
            select(Apartment.house_id, Apartment.id)
            .join(UserApartment, UserApartment.apartment_id == Apartment.id)
            .where(UserApartment.user_id == author.id)
        )
        row = (await self.db.execute(stmt)).first()
        house_id = row[0] if row else 1
        apartment_id = row[1] if row else 1

        house = await self.db.get(House, house_id)
        recipient_name = house.uk_name if house and payload.recipient_type == RecipientType.UK else "Служба ЖКХ"

        ticket_code = f"#{random.randint(4820, 9999)}"

        ticket = await self.repo.create(
            code=ticket_code,
            house_id=house_id,
            apartment_id=apartment_id,
            author_id=author.id,
            recipient_type=payload.recipient_type,
            recipient_name=recipient_name,
            category=payload.category,
            topic_code="2.16",
            title=payload.title,
            description=payload.description,
            is_public_in_feed=payload.is_public_in_feed,
        )

        for fid in payload.attachment_ids:
            f = await self.db.get(FileModel, fid)
            if f:
                self.db.add(TicketAttachment(ticket_id=ticket.id, file_id=f.id))

        await self.db.commit()
        return await self.get_ticket_details(ticket.id, author)

    async def toggle_support(self, ticket_id: int, user_id: int) -> TicketSupportResponse:
        votes, is_supported = await self.repo.toggle_support(ticket_id, user_id)
        await self.db.commit()
        return TicketSupportResponse(
            ticket_id=ticket_id,
            votes_count=votes,
            is_supported_by_me=is_supported,
        )