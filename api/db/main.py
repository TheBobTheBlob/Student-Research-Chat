from sqlalchemy import create_engine, URL
from . import tables
from sqlalchemy.orm import sessionmaker

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


def create_tables():
    tables.Base.metadata.create_all(engine)
