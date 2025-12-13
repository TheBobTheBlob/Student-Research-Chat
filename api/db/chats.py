import app.models as models
from db import tables
from db.helpers import read_session, write_session
import datetime as dt
import db.users as users

from sqlalchemy.orm import Session


@write_session
def new_chat(session: Session, chat_uuid: str, user_uuid: str, name: str, time: dt.datetime) -> None:
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


@read_session
def get_user_chats(session: Session, user_uuid: str) -> list[models.chats.ChatRow]:
    chat_users = (
        session.query(tables.ChatUsers)
        .filter(tables.ChatUsers.user_uuid == user_uuid, tables.ChatUsers.role != models.users.ChatRole.removed)
        .all()
    )

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
        user = models.users.UserChatRow(
            user_uuid=user.user_uuid,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            user_type=user.user_type,
            role=chat_user.role,
        )
        info.users[chat_user.user_uuid] = user

    return info


@write_session
def add_user_to_chat(session: Session, chat_uuid: str, user_uuid: str) -> None:
    time = dt.datetime.now(dt.timezone.utc)

    user = session.query(tables.ChatUsers).filter(tables.ChatUsers.chat_uuid == chat_uuid, tables.ChatUsers.user_uuid == user_uuid).first()
    if user:
        if user.role != models.users.ChatRole.removed:
            raise ValueError("User is already in the chat.")
        else:
            user.role = models.users.ChatRole.member
            session.add(user)
            return

    new_chat_user = tables.ChatUsers(
        chat_uuid=chat_uuid,
        user_uuid=user_uuid,
        joined_at=time,
        role=models.users.ChatRole.member,
    )
    session.add(new_chat_user)


@read_session
def get_chat_user_relations(session: Session, chat_uuid: str, include_removed: bool = False) -> list[tables.ChatUsers]:
    chat_users_query = session.query(tables.ChatUsers).filter(tables.ChatUsers.chat_uuid == chat_uuid)
    if not include_removed:
        chat_users_query = chat_users_query.filter(tables.ChatUsers.role != models.users.ChatRole.removed)
    chat_users = chat_users_query.all()

    return chat_users


@read_session
def get_chat_users(session: Session, chat_uuid: str, include_removed: bool = False) -> list[models.users.UserRow]:
    chat_users_query = session.query(tables.ChatUsers).filter(tables.ChatUsers.chat_uuid == chat_uuid)
    if not include_removed:
        chat_users_query = chat_users_query.filter(tables.ChatUsers.role != models.users.ChatRole.removed)

    chat_users = chat_users_query.all()

    users_list = []
    for chat_user in chat_users:
        user = users.get_user_by_uuid(chat_user.user_uuid)
        users_list.append(user)

    return users_list


@write_session
def delete_all_users_from_chat(session: Session, chat_uuid: str) -> None:
    chat_users = session.query(tables.ChatUsers).filter(tables.ChatUsers.chat_uuid == chat_uuid).all()
    for chat_user in chat_users:
        session.delete(chat_user)


@write_session
def delete_chat(session: Session, chat_uuid: str) -> None:
    chat = session.query(tables.Chats).filter(tables.Chats.chat_uuid == chat_uuid).first()
    if chat:
        session.delete(chat)
    else:
        raise ValueError("Chat does not exist.")


@write_session
def remove_user_from_chat(session: Session, chat_uuid: str, user_uuid: str) -> None:
    chat_user = (
        session.query(tables.ChatUsers).filter(tables.ChatUsers.chat_uuid == chat_uuid, tables.ChatUsers.user_uuid == user_uuid).first()
    )

    if not chat_user:
        raise ValueError("User is not in the chat.")

    if chat_user.role == models.users.ChatRole.admin:
        raise ValueError("Admins cannot leave the chat.")

    chat_user.role = models.users.ChatRole.removed
    session.add(chat_user)
