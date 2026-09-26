from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import require_roles
from app.models.user import User, UserRole
from app.models.file import File as FileModel
from app.models.house import House
from app.models.audit import AuditLog
from app.core.constants import FileContext, JournalAction, JournalEntityType
from app.schemas.uk import UkDocumentResponse, UkDocumentCreate
from app.schemas.common import StatusResponse

router = APIRouter()


@router.get("", response_model=list[UkDocumentResponse])
async def get_uk_documents(
    house_id: int | None = None,
    current_user: User = Depends(require_roles(UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(FileModel)
        .where(FileModel.context == FileContext.DOCUMENT)
        .order_by(desc(FileModel.id))
    )
    files = (await db.execute(stmt)).scalars().all()

    target_house_id = house_id or 1
    house = await db.get(House, target_house_id)
    h_addr = house.address if house else "ул. Баумана, 12"

    return [
        UkDocumentResponse(
            id=f.id,
            house_id=target_house_id,
            house_address=h_addr,
            title=f.original_name,
            file_url=f"/api/v1/files/{f.id}",
            size=f.size_bytes,
            mime_type=f.mime_type,
            created_at=f.created_at,
        )
        for f in files
    ]


@router.post("", response_model=StatusResponse, status_code=201)
async def attach_uk_document(
    payload: UkDocumentCreate,
    current_user: User = Depends(require_roles(UserRole.UK_STAFF)),
    db: AsyncSession = Depends(get_db),
):
    file_record = await db.get(FileModel, payload.file_id)
    if not file_record:
        raise HTTPException(status_code=404, detail="Файл не найден")

    file_record.context = FileContext.DOCUMENT
    file_record.original_name = payload.title

    db.add(AuditLog(
        user_id=current_user.id,
        action=JournalAction.CREATE,
        entity_type=JournalEntityType.FILE,
        entity_id=file_record.id,
        house_id=payload.house_id,
        details={"title": payload.title, "filename": file_record.filename},
    ))

    await db.commit()
    return StatusResponse(status="ok", message="Документ успешно добавлен")