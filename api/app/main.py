from fastapi import FastAPI
from db import main as db
from contextlib import asynccontextmanager
import time
import logging
from fastapi.middleware.cors import CORSMiddleware
from app.kafka_service import start_kafka_producer, stop_kafka_producer, consume_events
import asyncio

# Import routers
from app.routers import users
from app.routers import chats
from app.routers import messages
from app.routers import tasks
from app.routers import notes

@asynccontextmanager
async def lifespan(app: FastAPI):
    for i in range(10):
        try:
            db.create_tables()
            break
        except Exception:
            logging.warning(f"Database not ready, retrying ({i + 1}/10)")
            time.sleep(3)
    else:
        logging.error("Could not connect to the database after 10 attempts.")
        raise Exception("Database connection failed")

    for i in range(10):
        try:
            await start_kafka_producer()
            asyncio.create_task(consume_events())
            break
        except Exception:
            logging.warning(f"Kafka not ready, retrying ({i + 1}/10)")
            time.sleep(3)
    else:
        logging.error("Could not connect to the Kafka after 10 attempts.")
        raise Exception("Kafka connection failed")

    yield

    await stop_kafka_producer()


origins = [
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(chats.router)
app.include_router(messages.router)
app.include_router(tasks.router)
app.include_routers(notes.router)
