from fastapi import APIRouter, Depends
import db
import app.models.users as users
from app.dependencies import get_current_user
from fastapi.security import HTTPBearer
from fastapi import HTTPException
import app.models.notes as notes


router = APIRouter(prefix="/notes")
security = HTTPBearer(auto_error=False)


@router.post("/new")
async def new_note(note: notes.CreateNoteRequest, current_user: users.UserRow = Depends(get_current_user)):
    messsage_uuid = db.notes.new_note(current_user.user_id, note.content)
    return {"note": "New note sent", "note_uuid": messsage_uuid}


@router.post("/list")
async def list_of_note(current_user: users.UserRow = Depends(get_current_user)):
    notes = db.notes.get_user_notes(current_user.user_uuid)
