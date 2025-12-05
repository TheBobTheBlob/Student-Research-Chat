import logging
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
import db.messages
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
                    case events.UserAddedToChatEvent() as e:
                        db.chats.add_user_to_chat(
                            chat_uuid=e.chat_uuid,
                            user_uuid=e.user_uuid,
                        )
                    case events.ChatDeletedEvent() as e:
                        db.messages.remove_all_messages_from_chat(chat_uuid=e.chat_uuid)
                        db.chats.delete_all_users_from_chat(chat_uuid=e.chat_uuid)
                        db.chats.delete_chat(chat_uuid=e.chat_uuid)
                    case events.UserRemovedFromChatEvent() as e:
                        db.chats.remove_user_from_chat(chat_uuid=e.chat_uuid, user_uuid=e.user_uuid)
                    case _:
                        logging.warning(f"Unhandled event type: {type(event)}")

            except Exception as e:
                logging.error(f"Error processing event: {e}")
    except Exception as e:
        logging.error(f"Kafka consumer error: {e}")
    finally:
        await consumer.stop()
