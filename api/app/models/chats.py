from pydantic import BaseModel
import datetime as dt


class CreateChatRequest(BaseModel):
    name: str


class ChatRow(BaseModel):
    chat_uuid: str
    chat_name: str
    created_at: dt.datetime
