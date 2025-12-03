from sqlalchemy import String, Enum, DateTime
from sqlalchemy.orm import mapped_column, Mapped, DeclarativeBase
import app.models as models
import datetime as dt


class Base(DeclarativeBase):
    pass


class Users(Base):
    __tablename__ = "users"

    user_uuid: Mapped[str] = mapped_column(String(100), primary_key=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    user_type: Mapped[models.users.UserType] = mapped_column(Enum(models.users.UserType), nullable=False)


class Chats(Base):
    __tablename__ = "chats"

    chat_uuid: Mapped[str] = mapped_column(String(100), primary_key=True, nullable=False)
    chat_name: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, nullable=False)


class ChatUsers(Base):
    __tablename__ = "chat_users"

    chat_uuid: Mapped[str] = mapped_column(String(100), nullable=False, primary_key=True)
    user_uuid: Mapped[str] = mapped_column(String(100), nullable=False, primary_key=True)
    joined_at: Mapped[dt.datetime] = mapped_column(DateTime, nullable=False)
    role: Mapped[models.users.ChatRole] = mapped_column(Enum(models.users.ChatRole), default=models.users.ChatRole.member, nullable=False)


class Messages(Base):
    __tablename__ = "messages"

    message_uuid: Mapped[str] = mapped_column(String(100), primary_key=True, nullable=False)
    chat_uuid: Mapped[str] = mapped_column(String(100), nullable=False)
    user_uuid: Mapped[str] = mapped_column(String(100), nullable=False)
    content: Mapped[str] = mapped_column(String(1000), nullable=False)
    timestamp: Mapped[dt.datetime] = mapped_column(DateTime, nullable=False)
