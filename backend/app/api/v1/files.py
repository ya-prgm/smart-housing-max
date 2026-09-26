import os
import uuid
import aiofiles
from fastapi import APIRouter, Depends, UploadFile, File as FastAPIFile, Form, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User, UserRole
from app.models.file import File as FileModel
from app.core.constants import FileContext
from app.schemas.file import FileUploadResponse

router = APIRouter()

UPLOAD_DIR = os.path.join(os.getcwd(), "data", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=FileUploadResponse, status_code=201)
async def upload_file(
    file: UploadFile = FastAPIFile(...),
    context: FileContext = Form(default=FileContext.TICKET),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Размер файла не может превышать 10 МБ")

    ext = os.path.splitext(file.filename or "")[1]
    unique_name = f"{uuid.uuid4().hex}{ext}"
    dest_path = os.path.join(UPLOAD_DIR, unique_name)

    async with aiofiles.open(dest_path, "wb") as f:
        await f.write(contents)

    record = FileModel(
        uploader_id=current_user.id,
        filename=unique_name,
        original_name=file.filename or unique_name,
        mime_type=file.content_type or "application/octet-stream",
        size_bytes=len(contents),
        storage_path=dest_path,
        context=context,
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)

    return FileUploadResponse(
        id=record.id,
        url=f"/api/v1/files/{record.id}",
        filename=record.original_name,
        mime_type=record.mime_type,
        size=record.size_bytes,
        created_at=record.created_at,
    )


@router.get("/{file_id}")
async def download_file(file_id: int, db: AsyncSession = Depends(get_db)):
    record = await db.get(FileModel, file_id)
    if not record or not os.path.exists(record.storage_path):
        raise HTTPException(status_code=404, detail="Файл не найден")

    return FileResponse(
        path=record.storage_path,
        media_type=record.mime_type,
        filename=record.original_name,
    )


@router.delete("/{file_id}")
async def delete_file(
    file_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    record = await db.get(FileModel, file_id)
    if not record:
        raise HTTPException(status_code=404, detail="Файл не найден")

    if record.uploader_id != current_user.id and current_user.role != UserRole.UK_STAFF:
        raise HTTPException(status_code=403, detail="Недостаточно прав для удаления файла")

    if os.path.exists(record.storage_path):
        os.remove(record.storage_path)

    await db.delete(record)
    await db.commit()
    return {"status": "ok"}