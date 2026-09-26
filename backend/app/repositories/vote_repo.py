import hashlib
from datetime import datetime, timezone
from typing import Sequence
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.vote import (
    Poll,
    PollQuestion,
    PollOption,
    PollResponse,
    PollResponseAnswer,
    PollStatus,
)
from app.repositories.base import BaseRepository


class VoteRepository(BaseRepository[Poll]):
    def __init__(self, db: AsyncSession):
        super().__init__(Poll, db)

    async def get_polls_by_house(self, house_id: int) -> Sequence[Poll]:
        stmt = (
            select(Poll)
            .where(Poll.house_id == house_id, Poll.is_deleted == False)
            .options(
                selectinload(Poll.questions),
                selectinload(Poll.responses),
            )
            .order_by(desc(Poll.id))
        )
        res = await self.db.execute(stmt)
        return res.scalars().all()

    async def get_poll_with_questions(self, poll_id: int) -> Poll | None:
        stmt = (
            select(Poll)
            .where(Poll.id == poll_id, Poll.is_deleted == False)
            .options(
                selectinload(Poll.questions).selectinload(PollQuestion.options),
                selectinload(Poll.responses),
            )
        )
        res = await self.db.execute(stmt)
        return res.scalars().first()

    async def submit_vote(
        self,
        poll_id: int,
        user_id: int,
        apartment_id: int,
        answers: list[dict],
    ) -> PollResponse:
        sig_data = f"{poll_id}:{user_id}:{datetime.now(timezone.utc).isoformat()}"
        sig_hash = hashlib.sha256(sig_data.encode()).hexdigest()

        response = PollResponse(
            poll_id=poll_id,
            user_id=user_id,
            apartment_id=apartment_id,
            signature_hash=sig_hash,
        )
        self.db.add(response)
        await self.db.flush()

        for a in answers:
            ans = PollResponseAnswer(
                response_id=response.id,
                question_id=a["question_id"],
                selected_option_id=a.get("selected_option_id"),
                text_answer=a.get("text_answer"),
            )
            self.db.add(ans)

        await self.db.flush()
        return response