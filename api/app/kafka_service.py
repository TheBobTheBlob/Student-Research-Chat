import json
import logging
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
import db.messages
import datetime as dt

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


async def send_event(topic: str, event: dict):
    if producer:
        await producer.send_and_wait(topic, json.dumps(event).encode("utf-8"))


async def consume_events():
    consumer = AIOKafkaConsumer(TOPIC_CHAT_EVENTS, bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS, group_id="chat-backend-group")
    await consumer.start()
    try:
        async for msg in consumer:
            try:
                assert msg.value is not None
                event = json.loads(msg.value.decode("utf-8"))
                event_type = event.get("type")
                data = event.get("data")

                print(f"Processing event: {event_type}")

                if event_type == "MESSAGE_CREATED":
                    db.messages.new_message(
                        message_uuid=data["message_uuid"],
                        chat_uuid=data["chat_uuid"],
                        user_id=data["user_id"],
                        content=data["content"],
                        time=dt.datetime.fromisoformat(data["timestamp"]),
                    )

            except Exception as e:
                logging.error(f"Error processing message: {e}")
    except Exception as e:
        logging.error(f"Kafka consumer error: {e}")
    finally:
        await consumer.stop()
