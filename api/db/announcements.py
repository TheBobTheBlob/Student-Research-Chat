from db import tables
from db.helpers import read_session, write_session
import datetime as dt
import app.models as models

from sqlalchemy.orm import Session


@write_session
def new_announcement(
    session: Session, announcement_uuid: str, chat_uuid: str, title: str, content: str, users_uuids: list[str], time: dt.datetime
) -> None:
    announcement = tables.Announcements(
        announcement_uuid=announcement_uuid,
        chat_uuid=chat_uuid,
        title=title,
        content=content,
        created_at=time,
    )

    session.add(announcement)

    for user_uuid in users_uuids:
        announcement_user = tables.AnnouncementUsers(
            announcement_uuid=announcement_uuid,
            user_uuid=user_uuid,
            status=models.announcements.AnnouncementStatus.unread,
            updated_at=time,
        )
        session.add(announcement_user)


@read_session
def get_user_announcements(session: Session, user_uuid: str, chat_uuid: str | None = None) -> list[dict]:
    user_announcements = session.query(tables.AnnouncementUsers).filter(tables.AnnouncementUsers.user_uuid == user_uuid)

    results = []
    for ua in user_announcements:
        announcements = session.query(tables.Announcements).filter(tables.Announcements.announcement_uuid == ua.announcement_uuid)
        if chat_uuid:
            announcements = announcements.filter(tables.Announcements.chat_uuid == chat_uuid)

        announcement = announcements.first()

        if announcement:
            results.append(
                {
                    "announcement_uuid": announcement.announcement_uuid,
                    "chat_uuid": announcement.chat_uuid,
                    "title": announcement.title,
                    "content": announcement.content,
                    "created_at": announcement.created_at,
                    "status": ua.status.value if hasattr(ua.status, "value") else ua.status,
                }
            )

    return results


@write_session
def delete_announcements_from_chat(session: Session, chat_uuid: str) -> None:
    announcements = session.query(tables.Announcements).filter(tables.Announcements.chat_uuid == chat_uuid).all()
    for announcement in announcements:
        session.query(tables.AnnouncementUsers).filter(
            tables.AnnouncementUsers.announcement_uuid == announcement.announcement_uuid
        ).delete()
        session.query(tables.Announcements).filter(tables.Announcements.announcement_uuid == announcement.announcement_uuid).delete()


@write_session
def mark_announcement_as_read(session: Session, announcement_uuid: str, user_uuid: str, time: dt.datetime) -> None:
    announcement_user = (
        session.query(tables.AnnouncementUsers)
        .filter(tables.AnnouncementUsers.announcement_uuid == announcement_uuid, tables.AnnouncementUsers.user_uuid == user_uuid)
        .first()
    )
    if announcement_user:
        announcement_user.status = models.announcements.AnnouncementStatus.read
        announcement_user.updated_at = time
        session.add(announcement_user)


@write_session
def mark_announcement_as_unread(session: Session, announcement_uuid: str, user_uuid: str, time: dt.datetime) -> None:
    announcement_user = (
        session.query(tables.AnnouncementUsers)
        .filter(tables.AnnouncementUsers.announcement_uuid == announcement_uuid, tables.AnnouncementUsers.user_uuid == user_uuid)
        .first()
    )

    if announcement_user:
        announcement_user.status = models.announcements.AnnouncementStatus.unread
        announcement_user.updated_at = time
        session.add(announcement_user)
