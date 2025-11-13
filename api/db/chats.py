import app.models as models
from db import tables
from db.helpers import session
import uuid
import datetime as dt

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
