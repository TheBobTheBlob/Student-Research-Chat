import logging
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
import db
import datetime as dt
import app.events as events
from pydantic import TypeAdapter

KAFKA_BOOTSTRAP_SERVERS = "kafka:9093"
TOPIC_CHAT_EVENTS = "chat-events"

producer = None


async def start_kafka_producer():
    global producer
    producer = AIOKafkaProducer(bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS)
    await producer.start()


async def stop_kafka_producer():
    global producer
    if producer:
        await producer.stop()


async def send_event(topic: str, event: events.Event):
    if producer:
        payload = event.model_dump_json().encode("utf-8")
        await producer.send_and_wait(topic, payload)


async def consume_events():
    consumer = AIOKafkaConsumer(TOPIC_CHAT_EVENTS, bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS, group_id="chat-backend-group")
    await consumer.start()
    try:
        async for msg in consumer:
            try:
                assert msg.value is not None
                event = TypeAdapter(events.EventUnion).validate_json(msg.value.decode("utf-8"))

                match event:
                    case events.MessageCreatedEvent() as e:
                        db.messages.new_message(
                            message_uuid=e.message_uuid,
                            chat_uuid=e.chat_uuid,
                            user_uuid=e.user_uuid,
                            content=e.content,
                            time=dt.datetime.fromisoformat(e.timestamp),
                        )
                    case events.UserRegisteredEvent() as e:
                        db.users.create_user(
                            user_uuid=e.user_uuid,
                            first_name=e.first_name,
                            last_name=e.last_name,
                            password=e.password,
                            email=e.email,
                            user_type=e.user_type,
                        )
                    case events.ChatCreatedEvent() as e:
                        db.chats.new_chat(
                            chat_uuid=e.chat_uuid,
                            name=e.chat_name,
                            user_uuid=e.created_by_user_uuid,
                            time=dt.datetime.fromisoformat(e.timestamp),
                        )
                    case events.UserAddedToChatEvent() as e:
                        db.chats.add_user_to_chat(
                            chat_uuid=e.chat_uuid,
                            user_uuid=e.user_uuid,
                        )
                    case events.ChatDeletedEvent() as e:
                        db.messages.remove_all_messages_from_chat(chat_uuid=e.chat_uuid)
                        db.chats.delete_all_users_from_chat(chat_uuid=e.chat_uuid)
                        db.announcements.delete_announcements_from_chat(chat_uuid=e.chat_uuid)
                        db.chats.delete_chat(chat_uuid=e.chat_uuid)
                    case events.UserRemovedFromChatEvent() as e:
                        db.chats.remove_user_from_chat(chat_uuid=e.chat_uuid, user_uuid=e.user_uuid)
                    case events.NoteCreatedEvent() as e:
                        db.notes.new_note(
                            note_uuid=e.note_uuid,
                            user_uuid=e.user_uuid,
                            name=e.note_name,
                            content=e.content,
                            timestamp=dt.datetime.fromisoformat(e.timestamp),
                        )
                    case events.NoteDeletedEvent() as e:
                        db.notes.delete_note(note_uuid=e.note_uuid)
                    case events.AnnouncementCreatedEvent() as e:
                        users = db.chats.get_chat_users(e.chat_uuid, include_removed=False)
                        db.announcements.new_announcement(
                            announcement_uuid=e.announcement_uuid,
                            chat_uuid=e.chat_uuid,
                            title=e.title,
                            content=e.content,
                            users_uuids=[user.user_uuid for user in users],
                            time=dt.datetime.fromisoformat(e.timestamp),
                        )
                    case events.AnnouncementMarkedAsReadEvent() as e:
                        db.announcements.mark_announcement_as_read(
                            announcement_uuid=e.announcement_uuid,
                            user_uuid=e.user_uuid,
                            time=dt.datetime.now(dt.timezone.utc),
                        )
                    case events.AnnouncementMarkedAsUnreadEvent() as e:
                        db.announcements.mark_announcement_as_unread(
                            announcement_uuid=e.announcement_uuid,
                            user_uuid=e.user_uuid,
                            time=dt.datetime.now(dt.timezone.utc),
                        )
                    case events.MeetingCreatedEvent() as e:
                        db.meetings.create_meeting(
                            meeting_uuid=e.meeting_uuid,
                            title=e.title,
                            description=e.description,
                            start_time=dt.datetime.fromisoformat(e.start_time),
                            end_time=dt.datetime.fromisoformat(e.end_time),
                            created_by_user_uuid=e.created_by_user_uuid,
                            chat_uuid=e.chat_uuid,
                            created_at=dt.datetime.fromisoformat(e.timestamp),
                        )
                    case events.MeetingResponseEvent() as e:
                        db.meetings.update_response(
                            meeting_uuid=e.meeting_uuid,
                            user_uuid=e.user_uuid,
                            status=e.status,
                            updated_at=dt.datetime.fromisoformat(e.timestamp),
                        )
                    case _:
                        logging.warning(f"Unhandled event type: {type(event)}")

            except Exception as e:
                logging.error(f"Error processing event: {e}")
    except Exception as e:
        logging.error(f"Kafka consumer error: {e}")
    finally:
        await consumer.stop()
