from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import require_roles
from app.models.user import User, UserRole, UserApartment
from app.models.house import House, Apartment
from app.models.ticket import Ticket, TicketStatus
from app.models.vote import Poll, PollStatus
from app.models.feed import FeedPost
from app.core.constants import ActivityType
from app.schemas.uk import UkDashboardResponse, TicketsByStatus, RecentActivityItem

router = APIRouter()


@router.get("", response_model=UkDashboardResponse)
async def get_dashboard(
    current_user: User = Depends(require_roles(UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    total_houses = (await db.execute(select(func.count(House.id)))).scalar() or 0
    total_apartments = (await db.execute(select(func.count(Apartment.id)))).scalar() or 0
    total_residents = (await db.execute(select(func.count(UserApartment.id)))).scalar() or 0

    active_t_stmt = select(func.count(Ticket.id)).where(
        Ticket.status.in_([TicketStatus.ACTIVE, TicketStatus.IN_PROGRESS]),
        Ticket.is_deleted == False,
    )
    active_tickets = (await db.execute(active_t_stmt)).scalar() or 0

    active_p_stmt = select(func.count(Poll.id)).where(
        Poll.status == PollStatus.ACTIVE,
        Poll.is_deleted == False,
    )
    active_polls = (await db.execute(active_p_stmt)).scalar() or 0

    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    posts_today = (await db.execute(
        select(func.count(FeedPost.id)).where(FeedPost.created_at >= today_start, FeedPost.is_deleted == False)
    )).scalar() or 0

    status_counts = TicketsByStatus(
        active=(await db.execute(select(func.count(Ticket.id)).where(Ticket.status == TicketStatus.ACTIVE, Ticket.is_deleted == False))).scalar() or 0,
        in_progress=(await db.execute(select(func.count(Ticket.id)).where(Ticket.status == TicketStatus.IN_PROGRESS, Ticket.is_deleted == False))).scalar() or 0,
        completed=(await db.execute(select(func.count(Ticket.id)).where(Ticket.status == TicketStatus.COMPLETED, Ticket.is_deleted == False))).scalar() or 0,
        rejected=(await db.execute(select(func.count(Ticket.id)).where(Ticket.status == TicketStatus.REJECTED, Ticket.is_deleted == False))).scalar() or 0,
    )

    recent_tickets = (await db.execute(
        select(Ticket).options(selectinload(Ticket.house)).order_by(Ticket.id.desc()).limit(5)
    )).scalars().all()

    activity = [
        RecentActivityItem(
            type=ActivityType.TICKET_CREATED,
            house_address=t.house.address if t.house else "",
            title=t.title,
            created_at=t.created_at,
        )
        for t in recent_tickets
    ]

    return UkDashboardResponse(
        total_houses=total_houses,
        total_apartments=total_apartments,
        total_residents_in_app=total_residents,
        active_tickets=active_tickets,
        active_polls=active_polls,
        new_posts_today=posts_today,
        tickets_by_status=status_counts,
        recent_activity=activity,
    )