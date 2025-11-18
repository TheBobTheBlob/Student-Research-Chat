from fastapi import APIRouter, Depends
import db
import app.models.users as users
from app.dependencies import get_current_user
from fastapi.security import HTTPBearer
import app.models.messages as messages

router = APIRouter(prefix="/messages")
security = HTTPBearer(auto_error=False)


@router.post("/new")
async def new_message(message: messages.NewMessageRequest, current_user: users.UserRow = Depends(get_current_user)):
    messsage_uuid = db.messages.new_message(message.chat_uuid, current_user.user_id, message.content)
    return {"message": "New message sent", "message_uuid": messsage_uuid}


@router.post("/list")
async def list_of_message(message: messages.MessageListRequest, current_user: users.UserRow = Depends(get_current_user)):
    messages = db.messages.all_messages(message.chat_uuid)
    return {"message": "Messages listed", "messages": messages, "current_user_id": current_user.user_id}
