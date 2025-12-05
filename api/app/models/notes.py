from pydantic import BaseModel
import datetime as dt


class CreateNoteRequest(BaseModel):
    name: str
    content: str


class NoteRow(BaseModel):
    note_uuid: str
    user_uuid: str
    note_name: str
    content: str
    timestamp: dt.datetime


class DeleteNoteRequest(BaseModel):
    note_uuid: str
