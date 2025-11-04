from fastapi import APIRouter, HTTPException
import db.main as db
import app.models.users as users
from fastapi import Depends, Response
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter(prefix="/users")
security = HTTPBearer()


@router.post("/register")
async def register_user(user: users.CreateUserRequest):
    user_id = db.create_user(user)
    return {"user_id": user_id}


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> users.UserRow:
    token = credentials.credentials
    payload = db.decode_access_token(token)

    try:
        user_id = payload.get("user_id")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid login credentials")

    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid login credentials")
    try:
        user = db.get_user_by_id(user_id)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid login credentials")
    return user


@router.post("/login")
async def login_user(user: users.LoginRequest, response: Response):
    try:
        token = db.authenticate_user(user)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    response.set_cookie(key="access_token", value=token, httponly=True, max_age=7 * 24 * 60 * 60)


@router.post("/test-security")
async def test_endpoint(current_user: users.UserRow = Depends(get_current_user)):
    return {"message": "Test endpoint is working!"}
