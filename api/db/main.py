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


engine_write = create_engine(url)
SessionLocalWrite = sessionmaker(autocommit=False, autoflush=False, bind=engine_write)

engine_read = create_engine(url)
SessionLocalRead = sessionmaker(autocommit=False, autoflush=False, bind=engine_read)


def create_tables():
    tables.Base.metadata.create_all(engine_write)
