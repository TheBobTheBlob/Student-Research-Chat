from pydantic import BaseModel, Field
from typing import Literal, Annotated, Union
from app import models


class Event(BaseModel):
    pass


class MessageCreatedEvent(Event):
    event_type: Literal["MESSAGE_CREATED"] = "MESSAGE_CREATED"

    message_uuid: str
    chat_uuid: str
    user_uuid: str
    content: str
    timestamp: str


class UserRegisteredEvent(Event):
    event_type: Literal["USER_REGISTERED"] = "USER_REGISTERED"

    user_uuid: str
    first_name: str
    last_name: str
    email: str
    password: str
    user_type: models.users.UserType


class UserAddedToChatEvent(Event):
    event_type: Literal["USER_ADDED_TO_CHAT"] = "USER_ADDED_TO_CHAT"

    chat_uuid: str
    user_uuid: str
    added_by_user_uuid: str


class TaskAddedToChatEvent(Event):
    event_type: Literal["TASK_ADDED_TO_CHAT"] = "TASK_ADDED_TO_CHAT"

    chat_uuid: str
    user_uuid: str
    added_by_user_uuid: str


class ChatDeletedEvent(Event):
    event_type: Literal["CHAT_DELETED"] = "CHAT_DELETED"

    chat_uuid: str
    deleted_by_user_uuid: str


class UserRemovedFromChatEvent(Event):
    event_type: Literal["USER_REMOVED_FROM_CHAT"] = "USER_REMOVED_FROM_CHAT"

    chat_uuid: str
    user_uuid: str


EventUnion = Annotated[
    Union[MessageCreatedEvent, UserRegisteredEvent, UserAddedToChatEvent, ChatDeletedEvent, UserRemovedFromChatEvent, TaskAddedToChatEvent],
    Field(discriminator="event_type"),
]
