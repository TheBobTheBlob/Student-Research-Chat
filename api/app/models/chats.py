from pydantic import BaseModel
import datetime as dt
from app.models import users


class CreateChatRequest(BaseModel):
    name: str


class ChatRow(BaseModel):
    chat_uuid: str
    chat_name: str
    created_at: dt.datetime


class ChatInfoRequest(BaseModel):
    chat_uuid: str


class ChatInfoResponse(BaseModel):
    chat_uuid: str
    users: dict[int, users.UserRow]


class AddUserToChatRequest(BaseModel):
    chat_uuid: str
    user_email: str
