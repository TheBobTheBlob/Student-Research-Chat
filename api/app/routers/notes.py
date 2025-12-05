from fastapi import APIRouter, Depends
import db
import app.models.users as users
from app.dependencies import get_current_user
from fastapi.security import HTTPBearer
import app.models.notes as notes
import app.events as events
from app.kafka_service import send_event, TOPIC_CHAT_EVENTS
import uuid
import datetime as dt


router = APIRouter(prefix="/notes")
security = HTTPBearer(auto_error=False)


@router.post("/new")
async def new_note(note: notes.CreateNoteRequest, current_user: users.UserRow = Depends(get_current_user)):
    note_uuid = str(uuid.uuid4())
    time = dt.datetime.now(dt.timezone.utc)

    event = events.NoteCreatedEvent(
        note_uuid=note_uuid,
        user_uuid=current_user.user_uuid,
        note_name=note.name,
        content=note.content,
        timestamp=time.isoformat(),
    )

    await send_event(TOPIC_CHAT_EVENTS, event)
    return {"message": "New note created", "note_uuid": note_uuid}


@router.post("/list")
async def list_of_note(current_user: users.UserRow = Depends(get_current_user)):
    notes = db.notes.get_user_notes(current_user.user_uuid)
    return {"notes": notes}


@router.post("/delete")
async def delete_note(note: notes.DeleteNoteRequest, current_user: users.UserRow = Depends(get_current_user)):
    event = events.NoteDeletedEvent(
        note_uuid=note.note_uuid,
        user_uuid=current_user.user_uuid,
    )
    await send_event(TOPIC_CHAT_EVENTS, event)
    return {"message": "Note deleted"}
