from fastapi import FastAPI
from db import main as db
from contextlib import asynccontextmanager
import time
import logging
from . import models
from fastapi.middleware.cors import CORSMiddleware


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


origins = [
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/register")
async def register_user(user: models.CreateUserRequest):
    user_id = db.create_user(user)
    return {"user_id": user_id}
