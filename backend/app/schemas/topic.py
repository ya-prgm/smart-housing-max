from app.schemas.common import BaseSchema


class RecipientItem(BaseSchema):
    id: int
    code: str
    short_name: str
    full_name: str
    category: str
    icon: str | None = None


class TopicSearchItem(BaseSchema):
    id: int
    code: str
    section_num: int
    section_title: str
    title: str
    full_title: str


class TopicDetail(BaseSchema):
    id: int
    code: str
    section_num: int
    section_title: str
    title: str
    description: str | None = None
    recipients: list[RecipientItem] = []