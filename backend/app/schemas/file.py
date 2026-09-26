from datetime import datetime
from app.schemas.common import BaseSchema


class FileUploadResponse(BaseSchema):
    id: int
    url: str
    filename: str
    mime_type: str
    size: int
    created_at: datetime