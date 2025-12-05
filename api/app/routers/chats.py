from fastapi import APIRouter, Depends
import db
import app.models.users as users
from app.dependencies import get_current_user
from fastapi.security import HTTPBearer
from fastapi import HTTPException
import app.models.chats as chats
import app.events as events
from app.kafka_service import send_event, TOPIC_CHAT_EVENTS
import app.models as models

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
    try:
        chat_info = db.chats.get_chat_info(chat.chat_uuid)
    except ValueError:
        raise HTTPException(status_code=400, detail="Chat does not exist.")

    return chat_info


@router.post("/add-user")
async def add_user_to_chat(request: chats.AddUserToChatRequest, current_user: users.UserRow = Depends(get_current_user)):
    try:
        user = db.users.get_user_by_email(request.user_email)
    except ValueError:
        raise HTTPException(status_code=400, detail="User with this email does not exist.")

    chat_users = db.chats.get_chat_users(request.chat_uuid, include_removed=False)
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


@router.post("/delete")
async def delete_chat(chat: chats.ChatInfoRequest, current_user: users.UserRow = Depends(get_current_user)):
    chat_users = db.chats.get_chat_user_relations(chat.chat_uuid, include_removed=False)
    user_uuids = [chat_user.user_uuid for chat_user in chat_users]

    if current_user.user_uuid not in user_uuids:
        raise HTTPException(status_code=400, detail="You are not a member of this chat.")

    chat_user = next((cu for cu in chat_users if cu.user_uuid == current_user.user_uuid))
    if chat_user.role != models.users.ChatRole.admin:
        raise HTTPException(status_code=400, detail="Only admins can delete a chat.")

    event = events.ChatDeletedEvent(
        chat_uuid=chat.chat_uuid,
        deleted_by_user_uuid=current_user.user_uuid,
    )

    await send_event(TOPIC_CHAT_EVENTS, event)
    return {"message": "You have left the chat successfully."}


@router.post("/leave")
async def leave_chat(chat: chats.ChatInfoRequest, current_user: users.UserRow = Depends(get_current_user)):
    chat_users = db.chats.get_chat_user_relations(chat.chat_uuid, include_removed=False)
    user_uuids = [chat_user.user_uuid for chat_user in chat_users]

    if current_user.user_uuid not in user_uuids:
        raise HTTPException(status_code=400, detail="You are not a member of this chat.")

    if len(chat_users) == 1:
        raise HTTPException(status_code=400, detail="You are the last user in the chat. Please delete the chat instead.")

    chat_user = next((cu for cu in chat_users if cu.user_uuid == current_user.user_uuid))
    if chat_user.role == models.users.ChatRole.admin:
        raise HTTPException(status_code=400, detail="Admins cannot leave the chat.")

    event = events.UserRemovedFromChatEvent(
        chat_uuid=chat.chat_uuid,
        user_uuid=current_user.user_uuid,
    )

    await send_event(TOPIC_CHAT_EVENTS, event)
    return {"message": "You have left the chat successfully."}
