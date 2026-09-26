from fastapi import APIRouter
from app.api.v1 import auth, users, houses, tickets, feed, votes, notifications, files, topics
from app.api.v1.uk.router import uk_router

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(houses.router, prefix="/houses", tags=["Houses"])
api_router.include_router(tickets.router, prefix="/tickets", tags=["Tickets"])
api_router.include_router(topics.router, prefix="/topics", tags=["Topics"])
api_router.include_router(feed.router, prefix="/feed", tags=["Feed"])
api_router.include_router(votes.router, prefix="/votes", tags=["Votes"])
api_router.include_router(files.router, prefix="/files", tags=["Files"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(uk_router, prefix="/uk", tags=["UK"])