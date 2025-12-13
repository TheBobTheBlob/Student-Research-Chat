from pydantic import BaseModel, Field, field_validator
import datetime as dt
import enum


class TaskStatus(str, enum.Enum):
    to_do = "to_do"
    in_progress = "in_progress"
    done = "done"


class TaskPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class CreateTaskRequest(BaseModel):
    chat_uuid: str
    title: str = Field(..., min_length=1)
    description: str = Field("", max_length=2000)
    assignee_uuid: str | None = None
    due_date: dt.date | None = None
    priority: TaskPriority = TaskPriority.medium


class TaskRow(BaseModel):
    task_uuid: str
    chat_uuid: str
    creator_uuid: str
    assignee_uuid: str | None
    title: str
    description: str
    status: TaskStatus
    priority: TaskPriority
    due_date: dt.date | None
    created_at: dt.datetime


class UpdateTaskRequest(BaseModel):
    task_uuid: str
    title: str | None = None
    description: str | None = None
    assignee_uuid: str | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    due_date: dt.date | None = None

    @field_validator("due_date", mode="before")
    def none_due_date(cls, v):
        if isinstance(v, str) and v == "":
            return None
        return v
