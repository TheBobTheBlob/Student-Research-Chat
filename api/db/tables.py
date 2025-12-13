from sqlalchemy import String, Enum, DateTime, Date
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


class Tasks(Base):
    __tablename__ = "tasks"

    task_uuid: Mapped[str] = mapped_column(String(36), primary_key=True)
    chat_uuid: Mapped[str] = mapped_column(String(100), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    created_by: Mapped[str] = mapped_column(String(100), nullable=False)
    assigned_to: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[models.tasks.TaskStatus] = mapped_column(Enum(models.tasks.TaskStatus), default="to_do", nullable=False)
    priority: Mapped[models.tasks.TaskPriority] = mapped_column(Enum(models.tasks.TaskPriority), default="medium", nullable=False)
    due_date: Mapped[dt.date | None] = mapped_column(Date, nullable=True)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, nullable=False)


class Notes(Base):
    __tablename__ = "notes"

    note_uuid: Mapped[str] = mapped_column(String(100), primary_key=True, nullable=False)
    note_name: Mapped[str] = mapped_column(String(100), nullable=False)
    content: Mapped[str] = mapped_column(String(5000), nullable=False)
    timestamp: Mapped[dt.datetime] = mapped_column(DateTime, nullable=False)


class NoteUsers(Base):
    __tablename__ = "notes_users"

    note_uuid: Mapped[str] = mapped_column(String(100), nullable=False, primary_key=True)
    user_uuid: Mapped[str] = mapped_column(String(100), nullable=False, primary_key=True)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, nullable=False)


class Announcements(Base):
    __tablename__ = "announcements"

    announcement_uuid: Mapped[str] = mapped_column(String(100), primary_key=True, nullable=False)
    chat_uuid: Mapped[str] = mapped_column(String(100), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(String(5000), nullable=False)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, nullable=False)


class AnnouncementUsers(Base):
    __tablename__ = "announcement_users"

    announcement_uuid: Mapped[str] = mapped_column(String(100), nullable=False, primary_key=True)
    user_uuid: Mapped[str] = mapped_column(String(100), nullable=False, primary_key=True)
    status: Mapped[models.announcements.AnnouncementStatus] = mapped_column(
        Enum(models.announcements.AnnouncementStatus), default=models.announcements.AnnouncementStatus.unread, nullable=False
    )
    updated_at: Mapped[dt.datetime | None] = mapped_column(DateTime, nullable=True)


class Meetings(Base):
    __tablename__ = "meetings"

    meeting_uuid: Mapped[str] = mapped_column(String(100), primary_key=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(String(5000), nullable=False)
    start_time: Mapped[dt.datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[dt.datetime] = mapped_column(DateTime, nullable=False)
    created_by_user_uuid: Mapped[str] = mapped_column(String(100), nullable=False)
    chat_uuid: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[models.meetings.MeetingStatus] = mapped_column(
        Enum(models.meetings.MeetingStatus), default=models.meetings.MeetingStatus.scheduled, nullable=False
    )
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, nullable=False)


class MeetingResponses(Base):
    __tablename__ = "meeting_responses"

    meeting_uuid: Mapped[str] = mapped_column(String(100), nullable=False, primary_key=True)
    user_uuid: Mapped[str] = mapped_column(String(100), nullable=False, primary_key=True)
    status: Mapped[models.meetings.MeetingResponseStatus] = mapped_column(
        Enum(models.meetings.MeetingResponseStatus), default=models.meetings.MeetingResponseStatus.pending, nullable=False
    )
    updated_at: Mapped[dt.datetime] = mapped_column(DateTime, nullable=False)
