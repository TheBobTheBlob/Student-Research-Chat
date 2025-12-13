from fastapi import APIRouter, Depends
import db
import app.models.users as users
from app.dependencies import get_current_user
from fastapi import HTTPException
import app.events as events
from app.kafka_service import send_event, TOPIC_CHAT_EVENTS
import app.models as models
import uuid
import datetime as dt

router = APIRouter(prefix="/announcements")


@router.post("/new")
async def new_announcement(
    announcement: models.announcements.CreateAnnouncementRequest, current_user: users.UserRow = Depends(get_current_user)
):
    user_chats = db.chats.get_user_chats(current_user.user_uuid)
    if not any(chat.chat_uuid == announcement.chat_uuid for chat in user_chats):
        raise HTTPException(status_code=403, detail="User not in the specified chat")

    announcement_uuid = str(uuid.uuid4())
    timestamp = dt.datetime.now(dt.timezone.utc).isoformat()

    event = events.AnnouncementCreatedEvent(
        announcement_uuid=announcement_uuid,
        chat_uuid=announcement.chat_uuid,
        title=announcement.title,
        content=announcement.content,
        created_by_user_uuid=current_user.user_uuid,
        timestamp=timestamp,
    )

    await send_event(TOPIC_CHAT_EVENTS, event)
    return {"message": "New announcement created", "announcement_uuid": announcement_uuid}


@router.post("/list")
async def list_announcements(
    request: models.announcements.AnnouncementListRequest, current_user: users.UserRow = Depends(get_current_user)
):
    announcements = db.announcements.get_user_announcements(current_user.user_uuid, request.chat_uuid)
    return {"announcements": announcements}


@router.post("/mark-read")
async def mark_announcement_as_read(
    request: models.announcements.MarkAnnouncementAsReadRequest, current_user: users.UserRow = Depends(get_current_user)
):
    event = events.AnnouncementMarkedAsReadEvent(
        announcement_uuid=request.announcement_uuid,
        user_uuid=current_user.user_uuid,
    )

    await send_event(TOPIC_CHAT_EVENTS, event)
    return {"message": "Announcement marked as read"}


@router.post("/mark-unread")
async def mark_announcement_as_unread(
    request: models.announcements.MarkAnnouncementAsUnreadRequest, current_user: users.UserRow = Depends(get_current_user)
):
    event = events.AnnouncementMarkedAsUnreadEvent(
        announcement_uuid=request.announcement_uuid,
        user_uuid=current_user.user_uuid,
    )

    await send_event(TOPIC_CHAT_EVENTS, event)
    return {"message": "Announcement marked as unread"}
