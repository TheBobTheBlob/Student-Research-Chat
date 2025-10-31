from sqlalchemy import create_engine, URL
from .tables import Base

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
    Base.metadata.create_all(engine)
