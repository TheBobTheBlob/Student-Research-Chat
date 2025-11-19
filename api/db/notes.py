from db import tables
from db.helpers import session
import uuid
import datetime as dt
import app.models.notes as notes

from sqlalchemy.orm import Session


@session
def new_note(session: Session, user_id: int, content: str) -> str:
    note_uuid = str(uuid.uuid4())
    time = dt.datetime.now(dt.timezone.utc)

    new_note = tables.Notes(
        note_uuid=note_uuid,
        user_id=user_id,
        content=content,
        timestamp=time,
    )
    session.add(new_note)

    return note_uuid


@session
def all_notes(session: Session, user_uuid: str) -> list[notes.NoteRow]:
    db_notes = session.query(tables.Notes).filter(tables.Notes.user_uuid == user_uuid).order_by(tables.Notes.timestamp).all()
    note_rows = []

    for note in db_notes:
        note_rows.append(
            notes.NoteRow(
                note_uuid=note.note_uuid,
                user_id=note.user_id,
                content=note.content,
                timestamp=note.timestamp,
            )
        )

    return note_rows