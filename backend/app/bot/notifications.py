import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.constants import TicketStatus, NotificationCategory
from app.models.ticket import Ticket
from app.models.user import User, UserApartment
from app.models.house import Apartment
from app.models.notification import Notification
from app.bot.client import bot_client

logger = logging.getLogger(__name__)

STATUS_CONFIG = {
    TicketStatus.ACTIVE: {"title": "Новая", "icon": "🟡"},
    TicketStatus.IN_PROGRESS: {"title": "В работе", "icon": "⚙️"},
    TicketStatus.COMPLETED: {"title": "Выполнена", "icon": "✅"},
    TicketStatus.REJECTED: {"title": "Отклонена", "icon": "❌"},
}


async def get_house_residents(db: AsyncSession, house_id: int) -> list[User]:
    stmt = (
        select(User)
        .join(UserApartment, UserApartment.user_id == User.id)
        .join(Apartment, Apartment.id == UserApartment.apartment_id)
        .where(
            Apartment.house_id == house_id,
            User.is_active == True,
            User.notifications_enabled == True,
        )
        .distinct()
    )
    res = await db.execute(stmt)
    return list(res.scalars().all())


async def notify_ticket_status_changed(
    db: AsyncSession,
    ticket: Ticket,
    old_status: TicketStatus,
    new_status: TicketStatus,
    comment: str | None = None,
) -> None:
    try:
        author = ticket.author
        if not author:
            author = await db.get(User, ticket.author_id)
        if not author:
            return

        cfg = STATUS_CONFIG.get(new_status, {"title": new_status.value, "icon": "ℹ️"})
        title_text = f"Статус заявки {ticket.code}: {cfg['title']}"
        comment_part = f" Комментарий: {comment}" if comment else ""
        notif_text = f"По вашей заявке «{ticket.title}» установлен статус «{cfg['title']}».{comment_part}"

        db_notif = Notification(
            user_id=author.id,
            category=NotificationCategory.UK,
            author_name="УК «ЖилКомФорт»",
            author_badge="УК",
            title=title_text,
            text=notif_text,
            is_read=False,
            action_url=f"/tickets/{ticket.id}",
        )
        db.add(db_notif)
        await db.flush()

        if author.notifications_enabled and author.max_user_id and bot_client.is_configured:
            await bot_client.notify_ticket_status(
                user_id=author.max_user_id,
                ticket_code=ticket.code,
                title=ticket.title,
                status_title=cfg["title"],
                status_icon=cfg["icon"],
                comment=comment,
            )
    except Exception as exc:
        logger.exception("Error in notify_ticket_status_changed: %s", exc)


async def notify_ticket_reply_added(
    db: AsyncSession,
    ticket: Ticket,
    reply_author: User,
    content: str,
) -> None:
    try:
        author = ticket.author
        if not author:
            author = await db.get(User, ticket.author_id)
        if not author or author.id == reply_author.id:
            return

        role_badge = "Председатель" if reply_author.role.value == "chairman" else "УК"
        db_notif = Notification(
            user_id=author.id,
            category=NotificationCategory.CHAIRMAN if reply_author.role.value == "chairman" else NotificationCategory.UK,
            author_name=reply_author.full_name,
            author_badge=role_badge,
            title=f"Ответ по заявке {ticket.code}",
            text=content,
            is_read=False,
            action_url=f"/tickets/{ticket.id}",
        )
        db.add(db_notif)
        await db.flush()

        if author.notifications_enabled and author.max_user_id and bot_client.is_configured:
            await bot_client.notify_ticket_reply(
                user_id=author.max_user_id,
                ticket_code=ticket.code,
                title=ticket.title,
                author_name=reply_author.full_name,
                author_role=reply_author.role.value,
                reply_text=content,
            )
    except Exception as exc:
        logger.exception("Error in notify_ticket_reply_added: %s", exc)


async def notify_new_feed_post(
    db: AsyncSession,
    house_id: int,
    post_title: str,
    author: User,
    content: str,
    post_id: int | None = None,
) -> None:
    try:
        residents = await get_house_residents(db, house_id)
        if not residents:
            return

        badge = "Председатель" if author.role.value == "chairman" else "УК"
        category = NotificationCategory.CHAIRMAN if author.role.value == "chairman" else NotificationCategory.UK
        excerpt = content[:200] + ("..." if len(content) > 200 else "")

        db_notifs = [
            Notification(
                user_id=r.id,
                category=category,
                author_name=author.full_name,
                author_badge=badge,
                title=post_title,
                text=excerpt,
                is_read=False,
                action_url=f"/feed/{post_id}" if post_id else "/feed",
            )
            for r in residents
            if r.id != author.id
        ]
        db.add_all(db_notifs)
        await db.flush()

        if bot_client.is_configured:
            for r in residents:
                if r.id != author.id and r.max_user_id:
                    await bot_client.notify_new_post(
                        user_id=r.max_user_id,
                        post_title=post_title,
                        author_badge=badge,
                        excerpt=excerpt,
                    )
            if author.max_user_id:
                await bot_client.send_message(
                    user_id=author.max_user_id,
                    text=f"✅ Ваша публикация «{post_title}» успешно размещена в ленте дома и разослана жителям.",
                    attachments=[bot_client._build_app_button("📰 Открыть ленту")],
                )
    except Exception as exc:
        logger.exception("Error in notify_new_feed_post: %s", exc)


async def notify_new_poll_published(
    db: AsyncSession,
    house_id: int,
    poll_title: str,
    deadline_text: str,
    author: User,
    poll_id: int | None = None,
) -> None:
    try:
        residents = await get_house_residents(db, house_id)
        if not residents:
            return

        badge = "Председатель" if author.role.value == "chairman" else "УК"
        category = NotificationCategory.CHAIRMAN if author.role.value == "chairman" else NotificationCategory.UK

        db_notifs = [
            Notification(
                user_id=r.id,
                category=category,
                author_name=author.full_name,
                author_badge=badge,
                title=f"Новый опрос: {poll_title}",
                text=f"Срок голосования: {deadline_text}. Примите участие в принятии решений по дому.",
                is_read=False,
                action_url=f"/votes/{poll_id}" if poll_id else "/votes",
            )
            for r in residents
            if r.id != author.id
        ]
        db.add_all(db_notifs)
        await db.flush()

        if bot_client.is_configured:
            for r in residents:
                if r.id != author.id and r.max_user_id:
                    await bot_client.notify_new_poll(
                        user_id=r.max_user_id,
                        poll_title=poll_title,
                        deadline_text=deadline_text,
                        author_badge=badge,
                    )
            if author.max_user_id:
                await bot_client.send_message(
                    user_id=author.max_user_id,
                    text=f"✅ Опрос «{poll_title}» успешно опубликован и направлен жителям дома.",
                    attachments=[bot_client._build_app_button("🗳 Открыть опрос")],
                )
    except Exception as exc:
        logger.exception("Error in notify_new_poll_published: %s", exc)
