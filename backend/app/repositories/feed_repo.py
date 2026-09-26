from typing import Sequence
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.feed import FeedPost, FeedPostComment, FeedPostReaction
from app.repositories.base import BaseRepository


class FeedRepository(BaseRepository[FeedPost]):
    def __init__(self, db: AsyncSession):
        super().__init__(FeedPost, db)

    async def get_posts_by_house(
        self, house_id: int, post_type: str | None = None
    ) -> Sequence[FeedPost]:
        stmt = (
            select(FeedPost)
            .where(FeedPost.house_id == house_id, FeedPost.is_deleted == False)
            .options(
                selectinload(FeedPost.comments),
                selectinload(FeedPost.reactions),
            )
            .order_by(desc(FeedPost.is_pinned), desc(FeedPost.id))
        )

        if post_type and post_type in ["uk", "chairman"]:
            stmt = stmt.where(FeedPost.post_type == post_type)

        res = await self.db.execute(stmt)
        return res.scalars().all()

    async def get_post_details(self, post_id: int) -> FeedPost | None:
        stmt = (
            select(FeedPost)
            .where(FeedPost.id == post_id, FeedPost.is_deleted == False)
            .options(
                selectinload(FeedPost.reactions),
                selectinload(FeedPost.comments).selectinload(FeedPostComment.replies),
            )
        )
        res = await self.db.execute(stmt)
        return res.scalars().first()

    async def set_reaction(self, post_id: int, user_id: int, reaction_type: str) -> None:
        stmt = select(FeedPostReaction).where(
            FeedPostReaction.post_id == post_id,
            FeedPostReaction.user_id == user_id,
        )
        res = await self.db.execute(stmt)
        existing = res.scalars().first()

        if existing:
            if existing.reaction_type == reaction_type:
                await self.db.delete(existing)
            else:
                existing.reaction_type = reaction_type
        else:
            self.db.add(FeedPostReaction(post_id=post_id, user_id=user_id, reaction_type=reaction_type))

        await self.db.flush()