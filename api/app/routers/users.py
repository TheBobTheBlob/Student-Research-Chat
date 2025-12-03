from fastapi import APIRouter, HTTPException
from app.dependencies import get_current_user
import db
import app.models.users as users
from fastapi import Depends, Response
import app.events as events
from app.kafka_service import send_event, TOPIC_CHAT_EVENTS
import uuid

router = APIRouter(prefix="/users")


@router.post("/register")
async def register_user(user: users.CreateUserRequest):
    user_uuid = str(uuid.uuid4())
    event = events.UserRegisteredEvent(
        user_uuid=user_uuid,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password=user.password,
        user_type=users.UserType(user.user_type.value),
    )

    await send_event(TOPIC_CHAT_EVENTS, event)
    return {"user_uuid": user_uuid}


@router.post("/login")
async def login_user(user: users.LoginRequest, response: Response):
    try:
        token = db.users.authenticate_user(user)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    # Add secure=True in production
    response.set_cookie(key="access_token_cookie", value=token, httponly=True, max_age=7 * 24 * 60 * 60, secure=False, samesite="lax")
    return {"message": "Login successful"}


@router.post("/logout")
async def logout_user(response: Response):
    response.delete_cookie(key="access_token_cookie")
    return {"message": "Logout successful"}


@router.post("/authenticate", response_model=users.UserRow)
async def authenticate_user(current_user: users.UserRow = Depends(get_current_user)):
    return current_user
