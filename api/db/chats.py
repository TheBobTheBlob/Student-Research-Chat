import app.models as models
from db import tables
from db.helpers import session
import uuid
import datetime as dt
import db.users as users

from sqlalchemy.orm import Session


@session
def new_chat(session: Session, user_id: int, name: str) -> str:
    chat_uuid = str(uuid.uuid4())
    time = dt.datetime.now(dt.timezone.utc)

    new_chat = tables.Chats(
        chat_uuid=chat_uuid,
        chat_name=name,
        created_at=time,
    )
    session.add(new_chat)

    new_chat_user = tables.ChatUsers(
        chat_uuid=chat_uuid,
        user_id=user_id,
        joined_at=time,
        role=models.users.ChatRole.admin,
    )
    session.add(new_chat_user)

    return chat_uuid


@session
def get_user_chats(session: Session, user_id: int) -> list[models.chats.ChatRow]:
    chats = session.query(tables.ChatUsers).filter(tables.ChatUsers.user_id == user_id).all()
    chat_rows = []

    for chat in chats:
        chat_rows.append(
            models.chats.ChatRow(
                chat_uuid=chat.chat.chat_uuid,
                chat_name=chat.chat.chat_name,
                created_at=chat.chat.created_at,
            )
        )

    return chat_rows


@session
def get_chat_info(session: Session, chat_uuid: str) -> models.chats.ChatInfoResponse:
    chat_users = session.query(tables.ChatUsers).filter(tables.ChatUsers.chat_uuid == chat_uuid).all()

    info = models.chats.ChatInfoResponse(chat_uuid=chat_uuid, users={})
    for chat_user in chat_users:
        user = users.get_user_by_id(chat_user.user_id)
        info.users[chat_user.user_id] = user

    return info


@session
def add_user_to_chat(session: Session, chat_uuid: str, user_id: int) -> None:
    time = dt.datetime.now(dt.timezone.utc)

    if session.query(tables.ChatUsers).filter(tables.ChatUsers.chat_uuid == chat_uuid, tables.ChatUsers.user_id == user_id).first():
        raise ValueError("User is already in the chat.")

    new_chat_user = tables.ChatUsers(
        chat_uuid=chat_uuid,
        user_id=user_id,
        joined_at=time,
        role=models.users.ChatRole.member,
    )
    session.add(new_chat_user)
