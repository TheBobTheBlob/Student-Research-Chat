from pydantic import BaseModel
import datetime as dt
from app.models import users


class CreateNoteRequest(BaseModel):
    note_name: dict[int, users.UserRow]
    content: str


class NoteRow(BaseModel):
    note_uuid: str
    user_id: int
    content: str
    timestamp: dt.datetime
