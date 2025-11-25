import app.models as models
from db import tables
from db.helpers import session
import uuid
import datetime as dt
import db.users as users
import enum
from app.dependencies import get_current_user

from sqlalchemy.orm import Session

#make new note
@session
def new_note(session: Session, creator_id: int, note_creation: models.CreateNoteRequest) -> str:
    note_uuid = str(uuid.uuid4())
    timestamp = dt.datetime.now(dt.timezone.utc)

    new_note = tables.Notes(
        note_uuid = note_uuid,
        user_id = note_creation.user_id,
        note_name = note_creation.note_name,
        content = note_creation.content,
        timestamp = timestamp,
    )
    session.add(new_note)
    return note_uuid

#get all notes from current user
@session
def user_tasks(user_id: int):
    return session.query(tables.Notes).filter(
    (tables.Notes.user_id == user_id)
).all()
