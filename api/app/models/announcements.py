from pydantic import BaseModel
import enum


class AnnouncementStatus(enum.Enum):
    unread = "unread"
    read = "read"


class CreateAnnouncementRequest(BaseModel):
    chat_uuid: str
    title: str
    content: str


class AnnouncementListRequest(BaseModel):
    chat_uuid: str | None = None
    status: AnnouncementStatus | None = None


class MarkAnnouncementAsReadRequest(BaseModel):
    announcement_uuid: str


class MarkAnnouncementAsUnreadRequest(BaseModel):
    announcement_uuid: str
