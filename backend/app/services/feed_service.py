from sqlalchemy.ext.asyncio import AsyncSession
from app.models.feed import FeedPost, FeedPostComment
from app.models.user import User
from app.repositories.feed_repo import FeedRepository
from app.schemas.feed import FeedPostCreate, FeedPostResponse, CommentResponse


class FeedService:
    def __init__(self, db: AsyncSession):
        self.repo = FeedRepository(db)
        self.db = db

    async def get_posts(
        self, house_id: int, current_user: User, post_type: str | None = None
    ) -> list[FeedPostResponse]:
        posts = await self.repo.get_posts_by_house(house_id, post_type)

        results = []
        for p in posts:
            likes = sum(1 for r in p.reactions if r.reaction_type == "like")
            dislikes = sum(1 for r in p.reactions if r.reaction_type == "dislike")
            my_r = next((r.reaction_type for r in p.reactions if r.user_id == current_user.id), None)

            time_str = p.created_at.strftime("%H:%M")
            views_str = f"{p.views_count / 1000:.1f}K" if p.views_count >= 1000 else str(p.views_count)

            results.append(
                FeedPostResponse(
                    id=p.id,
                    author_name=p.author_title,
                    role_badge=p.author_badge,
                    avatar_text=p.author_title[:2].upper(),
                    is_org=(p.post_type == "uk"),
                    time_formatted=f"Сегодня, {time_str}",
                    title=p.title,
                    content=p.content,
                    image=p.image_url,
                    image_label=p.image_label,
                    likes=likes,
                    dislikes=dislikes,
                    comments_count=len(p.comments),
                    views=views_str,
                    post_type=p.post_type,
                    my_reaction=my_r,
                )
            )
        return results

    async def get_post_details(self, post_id: int, current_user: User) -> FeedPostResponse | None:
        p = await self.repo.get_post_details(post_id)
        if not p:
            return None

        likes = sum(1 for r in p.reactions if r.reaction_type == "like")
        dislikes = sum(1 for r in p.reactions if r.reaction_type == "dislike")
        my_r = next((r.reaction_type for r in p.reactions if r.user_id == current_user.id), None)

        views_str = f"{p.views_count / 1000:.1f}K" if p.views_count >= 1000 else str(p.views_count)

        return FeedPostResponse(
            id=p.id,
            author_name=p.author_title,
            role_badge=p.author_badge,
            avatar_text=p.author_title[:2].upper(),
            is_org=(p.post_type == "uk"),
            time_formatted=p.created_at.strftime("%d %b, %H:%M"),
            title=p.title,
            content=p.content,
            image=p.image_url,
            image_label=p.image_label,
            likes=likes,
            dislikes=dislikes,
            comments_count=len(p.comments),
            views=views_str,
            post_type=p.post_type,
            my_reaction=my_r,
        )

    async def create_post(self, payload: FeedPostCreate, author: User) -> FeedPost:
        author_badge = "Председатель" if author.role.value == "chairman" else "Управляющая организация"
        post_type = "chairman" if author.role.value == "chairman" else "uk"

        post = await self.repo.create(
            house_id=payload.house_id,
            author_id=author.id,
            post_type=post_type,
            author_title=author.full_name,
            author_badge=author_badge,
            title=payload.title,
            content=payload.content,
            image_url=payload.image_url,
            image_label=payload.image_label,
            views_count=1,
        )
        await self.db.commit()
        return post

    async def toggle_reaction(self, post_id: int, user_id: int, reaction_type: str) -> None:
        await self.repo.set_reaction(post_id, user_id, reaction_type)
        await self.db.commit()

    async def add_comment(
        self, post_id: int, user: User, content: str, parent_id: int | None = None
    ) -> FeedPostComment:
        comment = FeedPostComment(
            post_id=post_id,
            parent_id=parent_id,
            author_id=user.id,
            content=content,
        )
        self.db.add(comment)
        await self.db.commit()
        await self.db.refresh(comment)
        return comment