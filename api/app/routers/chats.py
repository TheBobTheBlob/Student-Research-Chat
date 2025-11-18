from fastapi import APIRouter, Depends
import db
import app.models.users as users
from app.dependencies import get_current_user
from fastapi.security import HTTPBearer
from fastapi import HTTPException
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


@router.post("/info")
async def chat_info(chat: chats.ChatInfoRequest, current_user: users.UserRow = Depends(get_current_user)):
    chat_info = db.chats.get_chat_info(chat.chat_uuid)
    return chat_info


@router.post("/add-user")
async def add_user_to_chat(request: chats.AddUserToChatRequest, current_user: users.UserRow = Depends(get_current_user)):
    try:
        user = db.users.get_user_by_email(request.user_email)
    except ValueError:
        raise HTTPException(status_code=400, detail="User with this email does not exist.")

    try:
        db.chats.add_user_to_chat(request.chat_uuid, user.user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="User is already in the chat.")

    return {"message": "User added to chat successfully."}
