from pydantic import BaseModel
import datetime as dt
from app.models import users


class NewNoteRequest(BaseModel):
    user_uuid: dict[int, users.UserRow]
    content: str


class NoteListRequest(BaseModel):
    user_uuid: str


class NoteRow(BaseModel):
    note_uuid: str
    user_id: int
    content: str
    timestamp: dt.datetime


