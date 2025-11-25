from pydantic import BaseModel, Field
import datetime as dt
import enum


class TaskStatus(str, enum.Enum):
    to_do = "to_do"
    done = "done"


class TaskPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class CreateTaskRequest(BaseModel):
    chat_uuid: str
    title: str = Field(..., min_length=1)
    description: str = Field("", max_length=2000)
    assignee_id: int | None = None
    due_date: dt.date | None = None
    priority: TaskPriority = TaskPriority.medium


class TaskRow(BaseModel):
    task_uuid: str
    chat_uuid: str
    creator_id: int
    assignee_id: int | None
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
    assignee_id: int | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    due_date: dt.date | None = None
