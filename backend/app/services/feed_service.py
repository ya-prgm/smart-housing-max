from sqlalchemy.ext.asyncio import AsyncSession
from app.models.feed import FeedPost, FeedPostComment
from app.models.file import File as FileModel
from app.models.user import User, UserRole
from app.core.constants import ReactionType, PostType
from app.repositories.feed_repo import FeedRepository
from app.schemas.feed import FeedPostCreate, FeedPostResponse, PostAuthor


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
            my_r = next((ReactionType(r.reaction_type) for r in p.reactions if r.user_id == current_user.id), None)

            author_role = p.author.role if p.author else (UserRole.CHAIRMAN if p.post_type == "chairman" else UserRole.UK_STAFF)

            results.append(
                FeedPostResponse(
                    id=p.id,
                    author=PostAuthor(
                        name=p.author_title,
                        role=author_role,
                        avatar_url=p.author.avatar_url if p.author else None,
                    ),
                    title=p.title,
                    content=p.content,
                    image_url=p.image_url,
                    image_label=p.image_label,
                    likes=likes,
                    dislikes=dislikes,
                    comments_count=len(p.comments),
                    views=p.views_count,
                    post_type=PostType.ANNOUNCEMENT if p.post_type == "uk" else PostType.INFO,
                    created_at=p.created_at,
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
        my_r = next((ReactionType(r.reaction_type) for r in p.reactions if r.user_id == current_user.id), None)

        author_role = p.author.role if p.author else (UserRole.CHAIRMAN if p.post_type == "chairman" else UserRole.UK_STAFF)

        return FeedPostResponse(
            id=p.id,
            author=PostAuthor(
                name=p.author_title,
                role=author_role,
                avatar_url=p.author.avatar_url if p.author else None,
            ),
            title=p.title,
            content=p.content,
            image_url=p.image_url,
            image_label=p.image_label,
            likes=likes,
            dislikes=dislikes,
            comments_count=len(p.comments),
            views=p.views_count,
            post_type=PostType.ANNOUNCEMENT if p.post_type == "uk" else PostType.INFO,
            created_at=p.created_at,
            my_reaction=my_r,
        )

    async def create_post(self, house_id: int, payload: FeedPostCreate, author: User) -> FeedPost:
        img_url = None
        if payload.image_id:
            f = await self.db.get(FileModel, payload.image_id)
            if f:
                img_url = f"/api/v1/files/{f.id}"

        post_type = "chairman" if author.role == UserRole.CHAIRMAN else "uk"

        post = await self.repo.create(
            house_id=house_id,
            author_id=author.id,
            post_type=post_type,
            author_title=author.full_name,
            author_badge="Председатель" if author.role == UserRole.CHAIRMAN else "УК",
            title=payload.title,
            content=payload.content,
            image_url=img_url,
            image_label=payload.image_label,
            views_count=1,
        )
        await self.db.commit()
        return post

    async def toggle_reaction(self, post_id: int, user_id: int, reaction_type: ReactionType) -> tuple[int, int, ReactionType | None]:
        await self.repo.set_reaction(post_id, user_id, reaction_type.value)
        await self.db.commit()

        p = await self.repo.get_by_id(post_id)
        likes = sum(1 for r in p.reactions if r.reaction_type == "like")
        dislikes = sum(1 for r in p.reactions if r.reaction_type == "dislike")
        my_r = next((ReactionType(r.reaction_type) for r in p.reactions if r.user_id == user_id), None)
        return likes, dislikes, my_r

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