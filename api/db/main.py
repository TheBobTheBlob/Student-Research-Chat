from sqlalchemy import create_engine, URL
from . import tables
from sqlalchemy.orm import Session

url = URL.create(
    drivername="mariadb+mariadbconnector",
    username="admin",
    password="adminpassword",
    host="db",
    port=3306,
    database="chatdb",
)
engine = create_engine(url)


def create_tables():
    tables.Base.metadata.create_all(engine)


def create_user(user):
    with Session(engine) as session:
        new_user = tables.Users(
            username=user.email.split("@")[0],
            email=user.email,
            password=user.password,
            user_type=user.user_type,
            first_name="First",
            last_name="Last",
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return new_user.id
