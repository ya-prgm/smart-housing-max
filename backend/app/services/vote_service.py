from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.repositories.vote_repo import VoteRepository
from app.schemas.vote import (
    PollCardResponse,
    PollDetailResponse,
    PollQuestionResponse,
    PollOptionResponse,
    PollSubmitRequest,
)


class VoteService:
    def __init__(self, db: AsyncSession):
        self.repo = VoteRepository(db)
        self.db = db

    async def get_polls_list(self, house_id: int, current_user: User) -> list[PollCardResponse]:
        polls = await self.repo.get_polls_by_house(house_id)

        results = []
        for p in polls:
            is_completed = any(r.user_id == current_user.id for r in p.responses)
            participants = len(p.responses) * 45 + 15

            results.append(
                PollCardResponse(
                    id=p.id,
                    author_title=p.author_role_badge,
                    author_icon="shield_person" if "Председатель" in p.author_role_badge else "corporate_fare",
                    status=p.status.value,
                    deadline_text=p.deadline_text,
                    title=p.title,
                    description=p.description,
                    estimated_time=p.estimated_time,
                    questions_count=len(p.questions),
                    participants_count=participants,
                    is_completed=is_completed,
                )
            )
        return results

    async def get_poll_details(self, poll_id: int, current_user: User) -> PollDetailResponse | None:
        p = await self.repo.get_poll_with_questions(poll_id)
        if not p:
            return None

        is_completed = any(r.user_id == current_user.id for r in p.responses)

        q_list = []
        for q in p.questions:
            opts = [
                PollOptionResponse(
                    id=o.id,
                    order_num=o.order_num,
                    option_text=o.option_text,
                    subtext=o.subtext,
                )
                for o in q.options
            ]
            q_list.append(
                PollQuestionResponse(
                    id=q.id,
                    order_num=q.order_num,
                    question_text=q.question_text,
                    subtext=q.subtext,
                    question_type=q.question_type.value,
                    image_url=q.image_url,
                    options=opts,
                )
            )

        return PollDetailResponse(
            id=p.id,
            author_role_badge=p.author_role_badge,
            title=p.title,
            description=p.description,
            image_url=p.image_url,
            status=p.status.value,
            estimated_time=p.estimated_time,
            deadline_text=p.deadline_text,
            protocol_number=p.protocol_number,
            total_questions=len(p.questions),
            is_completed_by_me=is_completed,
            questions=q_list,
        )

    async def submit_vote(
        self, poll_id: int, current_user: User, payload: PollSubmitRequest
    ) -> None:
        apt_id = 1
        if current_user.apartments:
            apt_id = current_user.apartments[0].apartment_id

        answers_dicts = [a.model_dump() for a in payload.answers]
        await self.repo.submit_vote(
            poll_id=poll_id,
            user_id=current_user.id,
            apartment_id=apt_id,
            answers=answers_dicts,
        )
        await self.db.commit()