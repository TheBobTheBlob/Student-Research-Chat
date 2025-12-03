import datetime as dt
import app.models as models
from db import tables
from db.helpers import check_password, create_access_token, hash_password, session


from sqlalchemy.orm import Session


@session
def create_user(
    session: Session, user_uuid: str, first_name: str, last_name: str, email: str, password: str, user_type: models.users.UserType
) -> str:
    new_user = tables.Users(
        user_uuid=user_uuid,
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=hash_password(password),
        user_type=user_type,
    )
    session.add(new_user)
    return new_user.user_uuid


@session
def authenticate_user(session: Session, user: models.users.LoginRequest) -> str:
    db_user = session.query(tables.Users).filter(tables.Users.email == user.email).first()

    if db_user and check_password(db_user.password, user.password):
        return create_access_token({"user_uuid": db_user.user_uuid}, expires_at=dt.timedelta(days=7))
    else:
        raise ValueError("Your credentials are invalid")


@session
def get_user_by_uuid(session: Session, user_uuid: str) -> models.users.UserRow:
    db_user = session.query(tables.Users).filter(tables.Users.user_uuid == user_uuid).first()
    if db_user is None:
        raise ValueError("User not found")
    return models.users.UserRow(
        user_uuid=db_user.user_uuid,
        first_name=db_user.first_name,
        last_name=db_user.last_name,
        email=db_user.email,
        user_type=db_user.user_type,
    )


@session
def get_user_by_email(session: Session, email: str) -> models.users.UserRow:
    db_user = session.query(tables.Users).filter(tables.Users.email == email).first()
    if db_user is None:
        raise ValueError("User not found")
    return models.users.UserRow(
        user_uuid=db_user.user_uuid,
        first_name=db_user.first_name,
        last_name=db_user.last_name,
        email=db_user.email,
        user_type=db_user.user_type,
    )
