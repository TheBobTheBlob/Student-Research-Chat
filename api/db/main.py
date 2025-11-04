from sqlalchemy import create_engine, URL
from . import tables
from sqlalchemy.orm import Session, sessionmaker
import app.models as models
from functools import wraps
from typing import Callable, TypeVar, ParamSpec, Concatenate
from argon2 import PasswordHasher
from argon2.exceptions import Argon2Error
import jwt
import datetime as dt
import os

url = URL.create(
    drivername="mariadb+mariadbconnector",
    username="admin",
    password="adminpassword",
    host="db",
    port=3306,
    database="chatdb",
)
engine = create_engine(url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
ph = PasswordHasher()


P = ParamSpec("P")
R = TypeVar("R")


def session(func: Callable[Concatenate[Session, P], R]) -> Callable[P, R]:
    @wraps(func)
    def wrapper(*args, **kwargs):
        session = SessionLocal()
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


def create_tables():
    tables.Base.metadata.create_all(engine)


def hash_password(password: str) -> str:
    return ph.hash(password)


def check_password(hashed: str, password: str) -> bool:
    try:
        return ph.verify(hashed, password)
    except Argon2Error:
        return False


@session
def create_user(session: Session, user: models.users.CreateUserRequest) -> int:
    new_user = tables.Users(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password=hash_password(user.password),
        user_type=user.user_type,
    )
    session.add(new_user)
    return new_user.id


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


@session
def authenticate_user(session: Session, user: models.users.LoginRequest) -> str:
    db_user = session.query(tables.Users).filter(tables.Users.email == user.email).first()

    if db_user and check_password(db_user.password, user.password):
        return create_access_token({"user_id": db_user.id}, expires_at=dt.timedelta(days=7))
    else:
        raise ValueError("Your credentials are invalid")


@session
def get_user_by_id(session: Session, user_id: int) -> models.users.UserRow:
    db_user = session.query(tables.Users).filter(tables.Users.id == user_id).first()
    if db_user is None:
        raise ValueError("User not found")
    return models.users.UserRow(
        id=db_user.id,
        first_name=db_user.first_name,
        last_name=db_user.last_name,
        email=db_user.email,
        user_type=db_user.user_type,
    )
