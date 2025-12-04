from sqlalchemy import String, Enum, DateTime
from sqlalchemy.orm import mapped_column, Mapped, DeclarativeBase, relationship
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


class Tasks(Base):
    __tablename__ = "tasks"

    task_uuid: Mapped[str] = mapped_column(String(36), primary_key=True)
    chat_uuid: Mapped[str] = mapped_column(String(100), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    created_by: Mapped[str] = mapped_column(String(100), nullable=False)
    assigned_to: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(Enum("to_do", "done"),default="to_do",nullable=False)
    priority: Mapped[str] = mapped_column(Enum("low", "medium", "high"),default="medium",nullable=False)
    due_date: Mapped[dt.datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, nullable=False)