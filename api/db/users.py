import datetime as dt
import app.models as models
from db import tables
from db.helpers import check_password, create_access_token, hash_password, session


from sqlalchemy.orm import Session


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
    return new_user.user_id


@session
def authenticate_user(session: Session, user: models.users.LoginRequest) -> str:
    db_user = session.query(tables.Users).filter(tables.Users.email == user.email).first()

    if db_user and check_password(db_user.password, user.password):
        return create_access_token({"user_id": db_user.user_id}, expires_at=dt.timedelta(days=7))
    else:
        raise ValueError("Your credentials are invalid")


@session
def get_user_by_id(session: Session, user_id: int) -> models.users.UserRow:
    db_user = session.query(tables.Users).filter(tables.Users.user_id == user_id).first()
    if db_user is None:
        raise ValueError("User not found")
    return models.users.UserRow(
        user_id=db_user.user_id,
        first_name=db_user.first_name,
        last_name=db_user.last_name,
        email=db_user.email,
        user_type=db_user.user_type,
    )
