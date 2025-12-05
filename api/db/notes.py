import app.models as models
from db import tables
from db.helpers import read_session, write_session
import uuid
import datetime as dt
import db.users as users

from sqlalchemy.orm import Session

#Create a Note
@write_session
def new_note(session: Session, user_id: int, name: str) -> str:
    note_uuid = str(uuid.uuid4())
    time = dt.datetime.now(dt.timezone.utc)

    new_note = tables.Notes(
        note_uuid = note_uuid,
        note_name = name,
        content = content,
        timestamp = time,
    )
    session.add(new_note)

    new_note_user = tables.NoteUsers(
        note_uuid = note_uuid,
        user_id = user_id,
        created_at = time,
    )
    session.add(new_note_user)

    return note_uuid
#Get all user's Notes
@read_session
def get_user_notes(session: Session, user_uuid: str) -> list[models.notes.NoteRow]:
    note_users = session.query(tables.NoteUsers).filter(tables.NoteUsers.user_uuid == user_uuid).all()

    notes: dict[str, tables.Notes] = {}
    for note_user in note_users:
        note_user = session.query(tables.Notes).filter(tables.Notes.note_uuid == note_user.note_uuid).first()
        if note_user:
            notes[note_user.note_uuid] = note_user

    note_rows = []
    for note_user in note_users:
        note = notes[note_user.note_uuid]
        note_rows.append(
            models.notes.NoteRow(
                note_uuid = note_user.note_uuid,
                note_name = note.note_name,
                content = note.content,
                timestamp = note.timestamp,
            )
        )

    return note_rows

