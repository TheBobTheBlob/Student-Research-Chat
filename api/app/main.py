from fastapi import FastAPI
from db import main as db
from contextlib import asynccontextmanager
import time
import logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    for i in range(10):
        try:
            db.create_tables()
            yield
        except Exception:
            logging.warning(f"Database not ready, retrying ({i}/10)")
            time.sleep(3)
    else:
        logging.error("Could not connect to the database after 10 attempts.")
        raise Exception("Database connection failed")


app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/items/{item_id}")
async def item(item_id: int):
    return {"item_id": item_id}
