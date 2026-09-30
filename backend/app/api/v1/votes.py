from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import get_current_user, require_roles
from app.models.user import User, UserApartment, UserRole
from app.models.house import Apartment
from app.models.vote import Poll, PollQuestion, PollOption, PollResponse, PollResponseAnswer
from app.services.vote_service import VoteService
from app.schemas.vote import (
    PollCardResponse, PollDetailResponse, PollSubmitRequest,
    PollCreate, PollResultsResponse, PollOptionResult, PollQuestionResult,
)
from app.schemas.common import StatusResponse
from app.core.constants import PollQuestionType
from app.bot.notifications import notify_new_poll_published

router = APIRouter()


@router.get("", response_model=list[PollCardResponse])
async def get_polls(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Apartment.house_id)
        .join(UserApartment, UserApartment.apartment_id == Apartment.id)
        .where(UserApartment.user_id == current_user.id)
    )
    house_id = (await db.execute(stmt)).scalar() or 1

    service = VoteService(db)
    return await service.get_polls_list(house_id, current_user)


@router.get("/{poll_id}", response_model=PollDetailResponse)
async def get_poll(
    poll_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = VoteService(db)
    poll = await service.get_poll_details(poll_id, current_user)
    if not poll:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Опрос не найден")
    return poll


@router.post("/{poll_id}/submit", response_model=StatusResponse)
async def submit_poll_answers(
    poll_id: int,
    payload: PollSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = VoteService(db)
    await service.submit_vote(poll_id, current_user, payload)
    return StatusResponse(status="ok", message="Голос успешно принят и подписан ПЭП")


@router.post("", response_model=StatusResponse, status_code=201)
async def create_poll(
    payload: PollCreate,
    current_user: User = Depends(require_roles(UserRole.CHAIRMAN, UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Apartment.house_id)
        .join(UserApartment, UserApartment.apartment_id == Apartment.id)
        .where(UserApartment.user_id == current_user.id)
    )
    house_id = (await db.execute(stmt)).scalar() or 1

    badge = "Председатель" if current_user.role == UserRole.CHAIRMAN else "УК"

    poll = Poll(
        house_id=house_id,
        author_id=current_user.id,
        author_role_badge=badge,
        title=payload.title,
        description=payload.description,
        deadline_text=payload.deadline_text,
        estimated_time=payload.estimated_time,
        protocol_number=payload.protocol_number,
    )
    db.add(poll)
    await db.flush()

    for i, q_data in enumerate(payload.questions, start=1):
        question = PollQuestion(
            poll_id=poll.id,
            order_num=i,
            question_text=q_data.question_text,
            subtext=q_data.subtext,
            question_type=q_data.question_type,
        )
        db.add(question)
        await db.flush()

        for j, opt_data in enumerate(q_data.options, start=1):
            option = PollOption(
                question_id=question.id,
                order_num=j,
                option_text=opt_data.option_text,
                subtext=opt_data.subtext,
            )
            db.add(option)

    await notify_new_poll_published(
        db=db,
        house_id=house_id,
        poll_title=payload.title,
        deadline_text=payload.deadline_text,
        author=current_user,
        poll_id=poll.id,
    )

    await db.commit()
    return StatusResponse(status="ok", message="Опрос успешно создан")


@router.get("/{poll_id}/results", response_model=PollResultsResponse)
async def get_poll_results(
    poll_id: int,
    current_user: User = Depends(require_roles(UserRole.CHAIRMAN, UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Poll)
        .where(Poll.id == poll_id, Poll.is_deleted == False)
        .options(
            selectinload(Poll.questions).selectinload(PollQuestion.options),
            selectinload(Poll.responses).selectinload(PollResponse.answers),
        )
    )
    poll = (await db.execute(stmt)).scalars().first()
    if not poll:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Опрос не найден")

    total_participants = len(poll.responses)

    q_results = []
    for q in poll.questions:
        all_answers = [
            a for resp in poll.responses for a in resp.answers if a.question_id == q.id
        ]

        if q.question_type == PollQuestionType.TEXT:
            text_answers = [a.text_answer for a in all_answers if a.text_answer]
            q_results.append(PollQuestionResult(
                id=q.id,
                question_text=q.question_text,
                question_type=q.question_type,
                total_answers=len(text_answers),
                text_answers=text_answers,
            ))
        else:
            option_vote_counts: dict[int, int] = {}
            for opt in q.options:
                option_vote_counts[opt.id] = 0
            for a in all_answers:
                if a.selected_option_id and a.selected_option_id in option_vote_counts:
                    option_vote_counts[a.selected_option_id] += 1

            total_opt_votes = sum(option_vote_counts.values()) or 1
            opt_results = [
                PollOptionResult(
                    id=opt.id,
                    option_text=opt.option_text,
                    votes=option_vote_counts.get(opt.id, 0),
                    percent=round(option_vote_counts.get(opt.id, 0) / total_opt_votes * 100, 1),
                )
                for opt in q.options
            ]
            q_results.append(PollQuestionResult(
                id=q.id,
                question_text=q.question_text,
                question_type=q.question_type,
                total_answers=len(all_answers),
                options=opt_results,
            ))

    return PollResultsResponse(
        id=poll.id,
        title=poll.title,
        description=poll.description,
        status=poll.status,
        total_participants=total_participants,
        questions=q_results,
    )