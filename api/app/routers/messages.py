from fastapi import APIRouter, Depends
import db
import app.models.users as users
from app.dependencies import get_current_user
from fastapi.security import HTTPBearer
import app.models.messages as messages
import uuid
import datetime as dt
from app.kafka_service import send_event, TOPIC_CHAT_EVENTS


router = APIRouter(prefix="/messages")
security = HTTPBearer(auto_error=False)


@router.post("/new")
async def new_message(message: messages.NewMessageRequest, current_user: users.UserRow = Depends(get_current_user)):
    message_uuid = str(uuid.uuid4())
    time = dt.datetime.now(dt.timezone.utc)

    event = {
        "type": "MESSAGE_CREATED",
        "data": {
            "message_uuid": message_uuid,
            "chat_uuid": message.chat_uuid,
            "user_id": current_user.user_id,
            "content": message.content,
            "timestamp": time.isoformat(),
        },
    }

    await send_event(TOPIC_CHAT_EVENTS, event)
    return {"message": "New message sent", "message_uuid": message_uuid}


@router.post("/list")
async def list_of_message(message: messages.MessageListRequest, current_user: users.UserRow = Depends(get_current_user)):
    messages = db.messages.all_messages(message.chat_uuid)
    return {"message": "Messages listed", "messages": messages, "current_user_id": current_user.user_id}
