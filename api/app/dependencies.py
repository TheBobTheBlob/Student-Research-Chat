from fastapi import Cookie, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import db
import app.models.users as users


security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security), access_token_cookie: str | None = Cookie(None)
) -> users.UserRow:
    if credentials:
        token = credentials.credentials
    elif access_token_cookie:
        token = access_token_cookie
    else:
        raise HTTPException(status_code=401, detail="Invalid login credentials")

    payload = db.helpers.decode_access_token(token)

    try:
        user_id = payload.get("user_id")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid login credentials")

    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid login credentials")

    try:
        user = db.users.get_user_by_id(user_id)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid login credentials")
    return user
