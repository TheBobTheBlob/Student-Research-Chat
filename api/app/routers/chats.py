from fastapi import APIRouter, Depends
import db
import app.models.users as users
from app.dependencies import get_current_user
from fastapi.security import HTTPBearer
from fastapi import HTTPException
import app.models.chats as chats
import app.events as events
from app.kafka_service import send_event, TOPIC_CHAT_EVENTS

router = APIRouter(prefix="/chats")
security = HTTPBearer(auto_error=False)


@router.post("/new")
async def new_chat(chat: chats.CreateChatRequest, current_user: users.UserRow = Depends(get_current_user)):
    chat_uuid = db.chats.new_chat(current_user.user_uuid, chat.name)
    return {"message": "New chat created", "chat_uuid": chat_uuid}


@router.post("/list")
async def user_chat_list(current_user: users.UserRow = Depends(get_current_user)):
    return db.chats.get_user_chats(current_user.user_uuid)


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

    chat_users = db.chats.get_chat_users(request.chat_uuid)
    user_uuids = [chat_user.user_uuid for chat_user in chat_users]
    if user.user_uuid in user_uuids:
        raise HTTPException(status_code=400, detail="User is already in the chat.")

    event = events.UserAddedToChatEvent(
        chat_uuid=request.chat_uuid,
        user_uuid=user.user_uuid,
        added_by_user_uuid=current_user.user_uuid,
    )

    await send_event(TOPIC_CHAT_EVENTS, event)
    return {"message": "User added to chat successfully."}
