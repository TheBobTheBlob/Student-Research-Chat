import datetime as dt
from functools import wraps
from typing import Callable, Concatenate
from argon2.exceptions import Argon2Error
import jwt
import os
from argon2 import PasswordHasher

from db.main import SessionLocalWrite, SessionLocalRead
from sqlalchemy.orm import Session
from typing import TypeVar, ParamSpec


ph = PasswordHasher()


def hash_password(password: str) -> str:
    return ph.hash(password)


def check_password(hashed: str, password: str) -> bool:
    try:
        return ph.verify(hashed, password)
    except Argon2Error:
        return False


def create_access_token(data: dict, expires_at: dt.timedelta) -> str:
    to_encode = data.copy()
    expire = dt.datetime.now(dt.timezone.utc) + expires_at
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, os.environ["JWT_SECRET_KEY"], algorithm=os.environ["JWT_ALGORITHM"])
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET_KEY"], algorithms=[os.environ["JWT_ALGORITHM"]])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.PyJWTError:
        raise ValueError("Invalid token")


P = ParamSpec("P")
R = TypeVar("R")


def write_session(func: Callable[Concatenate[Session, P], R]) -> Callable[P, R]:
    @wraps(func)
    def wrapper(*args, **kwargs):
        session = SessionLocalWrite()
        try:
            result = func(session, *args, **kwargs)
            session.commit()
            return result
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()

    return wrapper


def read_session(func: Callable[Concatenate[Session, P], R]) -> Callable[P, R]:
    @wraps(func)
    def wrapper(*args, **kwargs):
        session = SessionLocalRead()
        try:
            result = func(session, *args, **kwargs)
            return result
        except Exception as e:
            raise e
        finally:
            session.close()

    return wrapper
