from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import require_roles
from app.models.user import User, UserRole
from app.models.vote import Poll, PollQuestion, PollOption, PollStatus, QuestionType
from app.models.audit import AuditLog
from app.core.constants import JournalAction, JournalEntityType
from app.schemas.uk import UkPollCreate, UkPollUpdate, UkPollStatusUpdate
from app.schemas.common import StatusResponse

router = APIRouter()


@router.post("", response_model=StatusResponse, status_code=201)
async def create_uk_poll(
    payload: UkPollCreate,
    current_user: User = Depends(require_roles(UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    poll = Poll(
        house_id=payload.house_id,
        author_id=current_user.id,
        author_role_badge="УК «ЖилКомФорт»",
        title=payload.title,
        description=payload.description,
        status=PollStatus.ACTIVE,
        deadline_text=payload.deadline.strftime("До %d %b"),
    )
    db.add(poll)
    await db.flush()

    for q_idx, q in enumerate(payload.questions, start=1):
        question = PollQuestion(
            poll_id=poll.id,
            order_num=q_idx,
            question_text=q.question_text,
            subtext=q.subtext,
            question_type=q.question_type,
        )
        db.add(question)
        await db.flush()

        for o_idx, opt in enumerate(q.options, start=1):
            db.add(PollOption(
                question_id=question.id,
                order_num=o_idx,
                option_text=opt.option_text,
                subtext=opt.subtext,
            ))

    db.add(AuditLog(
        user_id=current_user.id,
        action=JournalAction.CREATE,
        entity_type=JournalEntityType.POLL,
        entity_id=poll.id,
        house_id=payload.house_id,
        details={"title": payload.title},
    ))

    await db.commit()
    return StatusResponse(status="ok", message="Опрос создан")


@router.patch("/{poll_id}", response_model=StatusResponse)
async def update_uk_poll(
    poll_id: int,
    payload: UkPollUpdate,
    current_user: User = Depends(require_roles(UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    poll = await db.get(Poll, poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Опрос не найден")

    if payload.title is not None:
        poll.title = payload.title
    if payload.description is not None:
        poll.description = payload.description
    if payload.deadline is not None:
        poll.deadline_text = payload.deadline.strftime("До %d %b")

    db.add(AuditLog(
        user_id=current_user.id,
        action=JournalAction.UPDATE,
        entity_type=JournalEntityType.POLL,
        entity_id=poll.id,
        house_id=poll.house_id,
        details={"title": poll.title},
    ))

    await db.commit()
    return StatusResponse(status="ok", message="Опрос обновлен")


@router.patch("/{poll_id}/status", response_model=StatusResponse)
async def update_uk_poll_status(
    poll_id: int,
    payload: UkPollStatusUpdate,
    current_user: User = Depends(require_roles(UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    poll = await db.get(Poll, poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Опрос не найден")

    old_status = poll.status.value
    poll.status = payload.status

    db.add(AuditLog(
        user_id=current_user.id,
        action=JournalAction.STATUS_CHANGE,
        entity_type=JournalEntityType.POLL,
        entity_id=poll.id,
        house_id=poll.house_id,
        details={"old_status": old_status, "new_status": payload.status.value},
    ))

    await db.commit()
    return StatusResponse(status="ok", message="Статус опроса обновлен")