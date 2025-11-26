from db import tables
from db.helpers import read_session, write_session
import datetime as dt
import app.models.messages as messages

from sqlalchemy.orm import Session


@write_session
def new_message(session: Session, message_uuid: str, time: dt.datetime, chat_uuid: str, user_id: int, content: str) -> str:
    new_message = tables.Messages(
        message_uuid=message_uuid,
        chat_uuid=chat_uuid,
        user_id=user_id,
        content=content,
        timestamp=time,
    )
    session.add(new_message)

    return message_uuid


@read_session
def all_messages(session: Session, chat_uuid: str) -> list[messages.MessageRow]:
    db_messages = session.query(tables.Messages).filter(tables.Messages.chat_uuid == chat_uuid).order_by(tables.Messages.timestamp).all()
    message_rows = []

    for message in db_messages:
        message_rows.append(
            messages.MessageRow(
                message_uuid=message.message_uuid,
                chat_uuid=message.chat_uuid,
                user_id=message.user_id,
                content=message.content,
                timestamp=message.timestamp,
            )
        )

    return message_rows
