from fastapi import APIRouter
from app.api.v1.uk import dashboard, houses, residents, tickets, feed, votes, journal

uk_router = APIRouter()

uk_router.include_router(dashboard.router, prefix="/dashboard", tags=["UK-Dashboard"])
uk_router.include_router(houses.router, prefix="/houses", tags=["UK-Houses"])
uk_router.include_router(residents.router, prefix="/residents", tags=["UK-Residents"])
uk_router.include_router(tickets.router, prefix="/tickets", tags=["UK-Tickets"])
uk_router.include_router(feed.router, prefix="/feed", tags=["UK-Feed"])
uk_router.include_router(votes.router, prefix="/votes", tags=["UK-Votes"])
uk_router.include_router(journal.router, prefix="/journal", tags=["UK-Journal"])