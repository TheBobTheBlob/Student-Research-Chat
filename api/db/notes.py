import app.models as models
from db import tables
from db.helpers import read_session, write_session
import datetime as dt

from sqlalchemy.orm import Session


# Create a Note
@write_session
def new_note(session: Session, note_uuid: str, user_uuid: str, name: str, content: str, timestamp: dt.datetime) -> str:
    new_note = tables.Notes(
        note_uuid=note_uuid,
        note_name=name,
        content=content,
        timestamp=timestamp,
    )
    session.add(new_note)

    new_note_user = tables.NoteUsers(
        note_uuid=note_uuid,
        user_uuid=user_uuid,
        created_at=timestamp,
    )
    session.add(new_note_user)

    return note_uuid


# Get all user's Notes
@read_session
def get_user_notes(session: Session, user_uuid: str) -> list[models.notes.NoteRow]:
    note_users = session.query(tables.NoteUsers).filter(tables.NoteUsers.user_uuid == user_uuid).all()

    notes: dict[str, tables.Notes] = {}
    for note in note_users:
        note = session.query(tables.Notes).filter(tables.Notes.note_uuid == note.note_uuid).first()
        if note:
            notes[note.note_uuid] = note

    note_rows = []
    for note in note_users:
        note = notes[note.note_uuid]
        note_rows.append(
            models.notes.NoteRow(
                note_uuid=note.note_uuid,
                user_uuid=user_uuid,
                note_name=note.note_name,
                content=note.content,
                timestamp=note.timestamp,
            )
        )

    return note_rows


# Delete a Note
@write_session
def delete_note(session: Session, note_uuid: str):
    session.query(tables.NoteUsers).filter(tables.NoteUsers.note_uuid == note_uuid).delete()
    session.query(tables.Notes).filter(tables.Notes.note_uuid == note_uuid).delete()
