from fastapi import APIRouter, Depends
import db
import app.models.users as users
from app.dependencies import get_current_user
from fastapi.security import HTTPBearer
import app.models.chats as chats

router = APIRouter(prefix="/chats")
security = HTTPBearer(auto_error=False)


@router.post("/new")
async def new_chat(chat: chats.CreateChatRequest, current_user: users.UserRow = Depends(get_current_user)):
    chat_uuid = db.chats.new_chat(current_user.user_id, chat.name)
    return {"message": "New chat created", "chat_uuid": chat_uuid}


@router.post("/list")
async def user_chat_list(current_user: users.UserRow = Depends(get_current_user)):
    return db.chats.get_user_chats(current_user.user_id)
