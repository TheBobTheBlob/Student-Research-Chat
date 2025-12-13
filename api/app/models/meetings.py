from pydantic import BaseModel
import enum


class ResponseStatus(enum.Enum):
    accepted = "accepted"
    declined = "declined"
    pending = "pending"
