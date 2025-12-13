from pydantic import BaseModel
import enum
import datetime as dt


class MeetingStatus(enum.Enum):
    scheduled = "scheduled"
    cancelled = "cancelled"
    completed = "completed"


class MeetingResponseStatus(enum.Enum):
    attending = "attending"
    not_attending = "not_attending"
    maybe = "maybe"
    pending = "pending"


class CreateMeetingRequest(BaseModel):
    title: str
    description: str
    start_time: dt.datetime
    end_time: dt.datetime
    chat_uuid: str | None = None


class MeetingResponseRequest(BaseModel):
    meeting_uuid: str
    status: MeetingResponseStatus
