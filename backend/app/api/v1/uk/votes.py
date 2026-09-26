from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import require_roles
from app.models.user import User, UserRole
from app.models.vote import Poll, PollQuestion, PollOption, PollStatus, QuestionType
from app.models.audit import AuditLog
from app.schemas.uk import UkPollCreate
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
        q_type = QuestionType.SINGLE
        if q.question_type.value == "multiple_choice":
            q_type = QuestionType.MULTIPLE
        elif q.question_type.value == "text":
            q_type = QuestionType.TEXT

        question = PollQuestion(
            poll_id=poll.id,
            order_num=q_idx,
            question_text=q.question_text,
            subtext=q.subtext,
            question_type=q_type,
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
        action="create_poll",
        entity_type="poll",
        entity_id=poll.id,
        house_id=payload.house_id,
        details={"title": payload.title},
    ))

    await db.commit()
    return StatusResponse(status="ok", message="Опрос создан")