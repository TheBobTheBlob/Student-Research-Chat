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

router = APIRouter(prefix="/meetings")


@router.post("/new")
async def new_meeting(
    meeting: models.meetings.CreateMeetingRequest, current_user: users.UserRow = Depends(get_current_user)
):
    if current_user.user_type != users.UserType.professor:
        raise HTTPException(status_code=403, detail="Only professors can create meetings")

    meeting_uuid = str(uuid.uuid4())
    timestamp = dt.datetime.now(dt.timezone.utc).isoformat()

    event = events.MeetingCreatedEvent(
        meeting_uuid=meeting_uuid,
        title=meeting.title,
        description=meeting.description,
        start_time=meeting.start_time.isoformat(),
        end_time=meeting.end_time.isoformat(),
        created_by_user_uuid=current_user.user_uuid,
        chat_uuid=meeting.chat_uuid,
        timestamp=timestamp,
    )

    await send_event(TOPIC_CHAT_EVENTS, event)
    return {"message": "New meeting created", "meeting_uuid": meeting_uuid}


@router.post("/list")
async def list_meetings(current_user: users.UserRow = Depends(get_current_user)):
    meetings = db.meetings.get_meetings(current_user.user_uuid)
    return {"meetings": meetings}


@router.post("/respond")
async def respond_to_meeting(
    response: models.meetings.MeetingResponseRequest, current_user: users.UserRow = Depends(get_current_user)
):
    timestamp = dt.datetime.now(dt.timezone.utc).isoformat()
    
    event = events.MeetingResponseEvent(
        meeting_uuid=response.meeting_uuid,
        user_uuid=current_user.user_uuid,
        status=response.status,
        timestamp=timestamp,
    )

    await send_event(TOPIC_CHAT_EVENTS, event)
    return {"message": "Response recorded"}
