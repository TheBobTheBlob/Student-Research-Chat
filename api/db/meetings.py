from db import tables
from db.helpers import read_session, write_session
import datetime as dt
import app.models as models
from sqlalchemy.orm import Session


@write_session
def create_meeting(
    session: Session,
    meeting_uuid: str,
    title: str,
    description: str,
    start_time: dt.datetime,
    end_time: dt.datetime,
    created_by_user_uuid: str,
    chat_uuid: str | None,
    created_at: dt.datetime,
) -> None:
    meeting = tables.Meetings(
        meeting_uuid=meeting_uuid,
        title=title,
        description=description,
        start_time=start_time,
        end_time=end_time,
        created_by_user_uuid=created_by_user_uuid,
        chat_uuid=chat_uuid,
        created_at=created_at,
    )
    session.add(meeting)


@read_session
def get_meetings(session: Session, user_uuid: str) -> list[dict]:
    meetings = session.query(tables.Meetings).filter(tables.Meetings.status != models.meetings.MeetingStatus.cancelled).all()

    results = []
    for meeting in meetings:
        response = (
            session.query(tables.MeetingResponses)
            .filter(tables.MeetingResponses.meeting_uuid == meeting.meeting_uuid, tables.MeetingResponses.user_uuid == user_uuid)
            .first()
        )

        results.append(
            {
                "meeting_uuid": meeting.meeting_uuid,
                "title": meeting.title,
                "description": meeting.description,
                "start_time": meeting.start_time,
                "end_time": meeting.end_time,
                "created_by_user_uuid": meeting.created_by_user_uuid,
                "chat_uuid": meeting.chat_uuid,
                "created_at": meeting.created_at,
                "user_response": response.status.value if response else models.meetings.MeetingResponseStatus.pending.value,
            }
        )

    return results


@write_session
def update_response(
    session: Session, meeting_uuid: str, user_uuid: str, status: models.meetings.MeetingResponseStatus, updated_at: dt.datetime
) -> None:
    response = (
        session.query(tables.MeetingResponses)
        .filter(tables.MeetingResponses.meeting_uuid == meeting_uuid, tables.MeetingResponses.user_uuid == user_uuid)
        .first()
    )

    if response:
        response.status = status
        response.updated_at = updated_at
    else:
        response = tables.MeetingResponses(
            meeting_uuid=meeting_uuid,
            user_uuid=user_uuid,
            status=status,
            updated_at=updated_at,
        )
        session.add(response)


@write_session
def delete_meetings_from_chat(session: Session, chat_uuid: str) -> None:
    meetings = session.query(tables.Meetings).filter(tables.Meetings.chat_uuid == chat_uuid).all()
    for meeting in meetings:
        session.query(tables.MeetingResponses).filter(tables.MeetingResponses.meeting_uuid == meeting.meeting_uuid).delete()
        session.query(tables.Meetings).filter(tables.Meetings.meeting_uuid == meeting.meeting_uuid).delete()
