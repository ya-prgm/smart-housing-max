import random
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.ticket import Ticket, TicketAttachment
from app.models.topic import TicketTopic, TicketRecipient
from app.models.house import House, Apartment
from app.models.user import User, UserApartment, UserRole
from app.models.file import File as FileModel
from app.core.constants import TicketStatus
from app.repositories.ticket_repo import TicketRepository
from app.schemas.ticket import TicketCreate, TicketResponse, TicketSupportResponse, TicketAttachmentResponse
from app.schemas.topic import RecipientItem


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

            recipients = [
                RecipientItem(
                    id=r.id,
                    code=r.code,
                    short_name=r.short_name,
                    full_name=r.full_name,
                    category=r.category,
                    icon=r.icon,
                )
                for r in t.recipients
            ]

            result.append(
                TicketResponse(
                    id=t.id,
                    code=t.code,
                    category=t.category,
                    topic_code=t.topic.code if t.topic else "4",
                    topic_title=t.topic.title if t.topic else t.title,
                    title=t.title,
                    description=t.description,
                    status=t.status,
                    priority=t.priority,
                    created_at=t.created_at,
                    is_my=is_my,
                    votes_count=len(t.supports),
                    is_voted=any(s.user_id == current_user.id for s in t.supports),
                    recipients=recipients,
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

        recipients = [
            RecipientItem(
                id=r.id,
                code=r.code,
                short_name=r.short_name,
                full_name=r.full_name,
                category=r.category,
                icon=r.icon,
            )
            for r in t.recipients
        ]

        return TicketResponse(
            id=t.id,
            code=t.code,
            category=t.category,
            topic_code=t.topic.code if t.topic else "4",
            topic_title=t.topic.title if t.topic else t.title,
            title=t.title,
            description=t.description,
            status=t.status,
            priority=t.priority,
            created_at=t.created_at,
            is_my=is_my,
            votes_count=len(t.supports),
            is_voted=any(s.user_id == current_user.id for s in t.supports),
            recipients=recipients,
            house_address=t.house.address if t.house else "",
            author_full_name=author_name,
            attachments=attachments,
        )

    async def create_ticket(self, payload: TicketCreate, author: User) -> TicketResponse:
        stmt_topic = (
            select(TicketTopic)
            .where(TicketTopic.code == payload.topic_code)
            .options(selectinload(TicketTopic.recipients))
        )
        topic = (await self.db.execute(stmt_topic)).scalars().first()
        if not topic:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Тема обращения не найдена",
            )

        valid_codes = {r.code for r in topic.recipients}
        selected_recipients = []
        if payload.recipient_codes:
            for r_code in payload.recipient_codes:
                if r_code not in valid_codes:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Получатель с кодом {r_code} недопустим для темы {topic.code}",
                    )
                stmt_recip = select(TicketRecipient).where(TicketRecipient.code == r_code)
                recip = (await self.db.execute(stmt_recip)).scalars().first()
                if recip:
                    selected_recipients.append(recip)
        else:
            selected_recipients = list(topic.recipients)

        stmt = (
            select(Apartment.house_id, Apartment.id)
            .join(UserApartment, UserApartment.apartment_id == Apartment.id)
            .where(UserApartment.user_id == author.id)
        )
        row = (await self.db.execute(stmt)).first()
        house_id = row[0] if row else 1
        apartment_id = row[1] if row else 1

        ticket_code = f"#{random.randint(4820, 9999)}"

        ticket = Ticket(
            code=ticket_code,
            house_id=house_id,
            apartment_id=apartment_id,
            author_id=author.id,
            topic_id=topic.id,
            category=topic.section_title,
            title=payload.title,
            description=payload.description,
            is_public_in_feed=payload.is_public_in_feed,
            recipients=selected_recipients,
        )
        self.db.add(ticket)
        await self.db.flush()

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