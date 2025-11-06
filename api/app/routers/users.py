from fastapi import APIRouter, HTTPException
import db.main as db
import app.models.users as users
from fastapi import Depends, Response, Cookie
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter(prefix="/users")
security = HTTPBearer(auto_error=False)


@router.post("/register")
async def register_user(user: users.CreateUserRequest):
    user_id = db.create_user(user)
    return {"user_id": user_id}


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security), access_token_cookie: str | None = Cookie(None)
) -> users.UserRow:
    if credentials:
        token = credentials.credentials
    elif access_token_cookie:
        token = access_token_cookie
    else:
        raise HTTPException(status_code=401, detail="Invalid login credentials")

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
