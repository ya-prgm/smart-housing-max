import random
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.ticket import Ticket, TicketAttachment, TicketReply
from app.models.topic import TicketTopic, TicketRecipient
from app.models.house import House, Apartment
from app.models.user import User, UserApartment, UserRole
from app.models.file import File as FileModel
from app.core.constants import TicketStatus
from app.repositories.ticket_repo import TicketRepository
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketResponse, TicketSupportResponse, TicketAttachmentResponse, TicketReplyCreate, TicketReplyResponse
from app.schemas.topic import RecipientItem
from app.bot.notifications import notify_ticket_status_changed, notify_ticket_reply_added


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

            replies = [
                TicketReplyResponse(
                    id=rep.id,
                    ticket_id=rep.ticket_id,
                    author_id=rep.author_id,
                    author_name=rep.author.full_name if rep.author else "Председатель",
                    author_role=rep.author.role.value if rep.author else "chairman",
                    content=rep.content,
                    new_status=rep.new_status,
                    created_at=rep.created_at,
                )
                for rep in (t.replies or [])
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
                    replies=replies,
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

        replies = [
            TicketReplyResponse(
                id=rep.id,
                ticket_id=rep.ticket_id,
                author_id=rep.author_id,
                author_name=rep.author.full_name if rep.author else "Председатель",
                author_role=rep.author.role.value if rep.author else "chairman",
                content=rep.content,
                new_status=rep.new_status,
                created_at=rep.created_at,
            )
            for rep in (t.replies or [])
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
            replies=replies,
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

        if payload.recipient_codes is not None and len(payload.recipient_codes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Необходимо выбрать хотя бы одного адресата обращения",
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
        t = await self.db.get(Ticket, ticket_id)
        if not t:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Обращение не найдено")
        if t.author_id == user_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Нельзя поддержать собственное обращение")
        votes, is_supported = await self.repo.toggle_support(ticket_id, user_id)
        await self.db.commit()
        return TicketSupportResponse(
            ticket_id=ticket_id,
            votes_count=votes,
            is_supported_by_me=is_supported,
        )

    async def update_ticket(self, ticket_id: int, payload: TicketUpdate, current_user: User) -> TicketResponse:
        t = await self.db.get(Ticket, ticket_id)
        if not t or t.is_deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Обращение не найдено")
        if t.author_id != current_user.id and current_user.role not in (UserRole.CHAIRMAN, UserRole.UK_STAFF):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет прав на редактирование обращения")
        if payload.title is not None and payload.title.strip():
            t.title = payload.title.strip()
        if payload.description is not None and payload.description.strip():
            t.description = payload.description.strip()
        await self.db.commit()
        updated = await self.get_ticket_details(ticket_id, current_user)
        if not updated:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Обращение не найдено")
        return updated

    async def delete_ticket(self, ticket_id: int, current_user: User) -> bool:
        t = await self.db.get(Ticket, ticket_id)
        if not t or t.is_deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Обращение не найдено")
        if t.author_id != current_user.id and current_user.role not in (UserRole.CHAIRMAN, UserRole.UK_STAFF):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет прав на отзыв обращения")
        t.is_deleted = True
        await self.db.commit()
        return True

    async def add_reply(
        self, ticket_id: int, payload: TicketReplyCreate, current_user: User
    ) -> TicketReplyResponse:
        stmt = select(Ticket).where(Ticket.id == ticket_id).options(selectinload(Ticket.recipients), selectinload(Ticket.author))
        t = (await self.db.execute(stmt)).scalars().first()
        if not t or t.is_deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Обращение не найдено")
        if current_user.role not in (UserRole.CHAIRMAN, UserRole.UK_STAFF):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Недостаточно прав")

        if current_user.role == UserRole.UK_STAFF:
            is_uk = True
            if t.recipients:
                is_uk = any(
                    r.category == "uk" or r.code in ("1", "19") or r.short_name in ("УО", "УК", "ТСЖ") or "управляющ" in (r.full_name or "").lower()
                    for r in t.recipients
                )
            elif t.recipient_name:
                rn = t.recipient_name.lower()
                is_uk = any(k in rn for k in ("ук", "уо", "управляющ", "жилкомфорт", "тсж"))

            if not is_uk:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Обращение адресовано сторонней организации. УК не может отвечать на него."
                )

        old_status = t.status
        reply = TicketReply(
            ticket_id=ticket_id,
            author_id=current_user.id,
            content=payload.content,
            new_status=payload.new_status,
        )
        self.db.add(reply)

        if payload.new_status is not None:
            t.status = payload.new_status
            await notify_ticket_status_changed(
                self.db, t, old_status, payload.new_status, payload.content
            )

        await notify_ticket_reply_added(self.db, t, current_user, payload.content)

        await self.db.commit()
        await self.db.refresh(reply)

        return TicketReplyResponse(
            id=reply.id,
            ticket_id=reply.ticket_id,
            author_id=reply.author_id,
            author_name=current_user.full_name,
            author_role=current_user.role.value,
            content=reply.content,
            new_status=reply.new_status,
            created_at=reply.created_at,
        )