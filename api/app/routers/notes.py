from fastapi import APIRouter, Depends
import db
import app.models.users as users
from app.dependencies import get_current_user
from fastapi.security import HTTPBearer
import app.models.notes as notes

router = APIRouter(prefix="/notes")
security = HTTPBearer(auto_error=False)


@router.post("/new")
async def new_note(note: notes.NewNoteRequest, current_user: users.UserRow = Depends(get_current_user)):
    messsage_uuid = db.notes.new_note(current_user.user_id, note.content)
    return {"note": "New note sent", "note_uuid": messsage_uuid}


@router.post("/list")
async def list_of_note(note: notes.NoteListRequest, current_user: users.UserRow = Depends(get_current_user)):
    notes = db.notes.all_notes(note.user_id)
    return {"note": "notes listed", "notes": notes, "current_user_id": current_user.user_id}