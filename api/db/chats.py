import app.models as models
from db import tables
from db.helpers import read_session, write_session
import uuid
import datetime as dt
import db.users as users

from sqlalchemy.orm import Session


@write_session
def new_chat(session: Session, user_uuid: str, name: str) -> str:
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
        user_uuid=user_uuid,
        joined_at=time,
        role=models.users.ChatRole.admin,
    )
    session.add(new_chat_user)

    return chat_uuid


@read_session
def get_user_chats(session: Session, user_uuid: str) -> list[models.chats.ChatRow]:
    chat_users = session.query(tables.ChatUsers).filter(tables.ChatUsers.user_uuid == user_uuid).all()

    chats: dict[str, tables.Chats] = {}
    for chat_user in chat_users:
        chat_user = session.query(tables.Chats).filter(tables.Chats.chat_uuid == chat_user.chat_uuid).first()
        if chat_user:
            chats[chat_user.chat_uuid] = chat_user

    chat_rows = []
    for chat_user in chat_users:
        chat = chats[chat_user.chat_uuid]
        chat_rows.append(
            models.chats.ChatRow(
                chat_uuid=chat_user.chat_uuid,
                chat_name=chat.chat_name,
                created_at=chat.created_at,
            )
        )

    return chat_rows


@read_session
def get_chat_info(session: Session, chat_uuid: str) -> models.chats.ChatInfoResponse:
    chat_users = session.query(tables.ChatUsers).filter(tables.ChatUsers.chat_uuid == chat_uuid).all()
    chat = session.query(tables.Chats).filter(tables.Chats.chat_uuid == chat_uuid).first()

    if not chat:
        raise ValueError("Chat does not exist.")

    info = models.chats.ChatInfoResponse(chat_uuid=chat_uuid, chat_name=chat.chat_name, users={})
    for chat_user in chat_users:
        user = users.get_user_by_uuid(chat_user.user_uuid)
        info.users[chat_user.user_uuid] = user

    return info


@write_session
def add_user_to_chat(session: Session, chat_uuid: str, user_uuid: str) -> None:
    time = dt.datetime.now(dt.timezone.utc)

    if session.query(tables.ChatUsers).filter(tables.ChatUsers.chat_uuid == chat_uuid, tables.ChatUsers.user_uuid == user_uuid).first():
        raise ValueError("User is already in the chat.")

    new_chat_user = tables.ChatUsers(
        chat_uuid=chat_uuid,
        user_uuid=user_uuid,
        joined_at=time,
        role=models.users.ChatRole.member,
    )
    session.add(new_chat_user)


@read_session
def get_chat_users(session: Session, chat_uuid: str) -> list[models.users.UserRow]:
    chat_users = session.query(tables.ChatUsers).filter(tables.ChatUsers.chat_uuid == chat_uuid).all()

    users_list = []
    for chat_user in chat_users:
        user = users.get_user_by_uuid(chat_user.user_uuid)
        users_list.append(user)

    return users_list
