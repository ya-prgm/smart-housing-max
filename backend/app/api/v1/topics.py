import re
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import select, func, desc, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.topic import TicketTopic, TicketRecipient
from app.schemas.topic import TopicSearchItem, TopicDetail, RecipientItem

router = APIRouter()


@router.get("/search", response_model=list[TopicSearchItem])
async def search_topics(
    q: str = Query(..., min_length=1),
    limit: int = Query(default=10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cleaned = re.sub(r"[^\w\s\.]", " ", q).strip()
    words = [w for w in cleaned.split() if w]
    
    results = []

    if words:
        fts_query_str = " & ".join(f"{w}:*" for w in words)
        ts_query = func.to_tsquery("russian", fts_query_str)
        
        stmt = (
            select(TicketTopic)
            .where(TicketTopic.search_vector.op("@@")(ts_query))
            .order_by(desc(func.ts_rank(TicketTopic.search_vector, ts_query)))
            .limit(limit)
        )
        res = await db.execute(stmt)
        results = res.scalars().all()

    if not results:
        ilike_pattern = f"%{cleaned}%"
        stmt_fallback = (
            select(TicketTopic)
            .where(
                or_(
                    TicketTopic.code.ilike(ilike_pattern),
                    TicketTopic.title.ilike(ilike_pattern),
                    TicketTopic.keywords.ilike(ilike_pattern),
                )
            )
            .order_by(TicketTopic.code.asc())
            .limit(limit)
        )
        res_fallback = await db.execute(stmt_fallback)
        results = res_fallback.scalars().all()

    return [
        TopicSearchItem(
            id=t.id,
            code=t.code,
            section_num=t.section_num,
            section_title=t.section_title,
            title=t.title,
            full_title=f"{t.code} {t.title}",
        )
        for t in results
    ]


@router.get("/{code}", response_model=TopicDetail)
async def get_topic_by_code(
    code: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(TicketTopic)
        .where(TicketTopic.code == code)
        .options(selectinload(TicketTopic.recipients))
    )
    res = await db.execute(stmt)
    topic = res.scalars().first()

    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Тема классификатора не найдена",
        )

    recipients = [
        RecipientItem(
            id=r.id,
            code=r.code,
            short_name=r.short_name,
            full_name=r.full_name,
            category=r.category,
            icon=r.icon,
        )
        for r in topic.recipients
    ]

    return TopicDetail(
        id=topic.id,
        code=topic.code,
        section_num=topic.section_num,
        section_title=topic.section_title,
        title=topic.title,
        description=topic.description,
        recipients=recipients,
    )


@router.get("/{code}/recipients", response_model=list[RecipientItem])
async def get_topic_recipients(
    code: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(TicketTopic)
        .where(TicketTopic.code == code)
        .options(selectinload(TicketTopic.recipients))
    )
    res = await db.execute(stmt)
    topic = res.scalars().first()

    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Тема классификатора не найдена",
        )

    return [
        RecipientItem(
            id=r.id,
            code=r.code,
            short_name=r.short_name,
            full_name=r.full_name,
            category=r.category,
            icon=r.icon,
        )
        for r in topic.recipients
    ]