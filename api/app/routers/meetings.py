from fastapi import APIRouter, Depends
import db
import app.models.users as users
from app.dependencies import get_current_user
from fastapi import HTTPException
import app.models.chats as chats
import app.events as events
from app.kafka_service import send_event, TOPIC_CHAT_EVENTS
import app.models as models

router = APIRouter(prefix="/meetings")
