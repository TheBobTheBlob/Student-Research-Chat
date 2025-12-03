from pydantic import BaseModel
import datetime as dt


class NewMessageRequest(BaseModel):
    chat_uuid: str
    content: str


class MessageListRequest(BaseModel):
    chat_uuid: str


class MessageRow(BaseModel):
    message_uuid: str
    chat_uuid: str
    user_uuid: str
    content: str
    timestamp: dt.datetime
