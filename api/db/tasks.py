# db/tasks.py
from db import tables
from db.helpers import session
import uuid
import datetime as dt
import app.models.tasks as models

from sqlalchemy.orm import Session

# Create a new task
@write_session
def new_task(session: Session, creator_id: int, task_data: models.CreateTaskRequest) -> str:
    task_uuid = str(uuid.uuid4())
    created_at = dt.datetime.now(dt.timezone.utc)

    new_task = tables.Tasks(
        task_uuid=task_uuid,
        chat_uuid=task_data.chat_uuid,
        title=task_data.title,
        description=task_data.description,
        created_by=creator_id,
        assigned_to=task_data.assignee_id,
        status=models.TaskStatus.to_do.value,
        priority=task_data.priority.value,
        due_date=task_data.due_date,
        created_at=created_at
    )
    session.add(new_task)
    return task_uuid

# Get a single task by UUID
@read_session
def get_task(session: Session, task_uuid: str) -> models.TaskRow | None:
    task = session.query(tables.Tasks).filter(tables.Tasks.task_uuid == task_uuid).first()
    if not task:
        return None

    return models.TaskRow(
        task_uuid=task.task_uuid,
        chat_uuid=task.chat_uuid,
        creator_id=task.created_by,
        assignee_id=task.assigned_to,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date,
        created_at=task.created_at
    )

# List all tasks, optional filter by chat_uuid (tasks listed in chat)
@read_session
def all_tasks(session: Session, chat_uuid: str | None = None) -> list[models.TaskRow]:
    query = session.query(tables.Tasks)
    if chat_uuid:
        query = query.filter(tables.Tasks.chat_uuid == chat_uuid)

    query = query.order_by(tables.Tasks.created_at)
    tasks = query.all()
    result = []

    for task in tasks:
        result.append(
            models.TaskRow(
                task_uuid=task.task_uuid,
                chat_uuid=task.chat_uuid,
                creator_id=task.created_by,
                assignee_id=task.assigned_to,
                title=task.title,
                description=task.description,
                status=task.status,
                priority=task.priority,
                due_date=task.due_date,
                created_at=task.created_at
            )
        )
    return result

# List all tasks for a specific user (either created by or assigned to)
@read_session
def user_tasks(user_uuid: int):
    return session.query(tables.Tasks).filter(
    (tables.Tasks.created_by == user_uuid) | (tables.Tasks.assigned_to == user_uuid)
).all()


# Update a task
@write_session
def update_task(session: Session, task_data: models.UpdateTaskRequest) -> models.TaskRow | None:
    task = session.query(tables.Tasks).filter(tables.Tasks.task_uuid == task_data.task_uuid).first()
    if not task:
        return None

    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.assignee_id is not None:
        task.assigned_to = task_data.assignee_id
    if task_data.status is not None:
        task.status = task_data.status.value
    if task_data.priority is not None:
        task.priority = task_data.priority.value
    if task_data.due_date is not None:
        task.due_date = task_data.due_date

    session.commit()
    session.refresh(task)

    return models.TaskRow(
        task_uuid=task.task_uuid,
        chat_uuid=task.chat_uuid,
        creator_id=task.created_by,
        assignee_id=task.assigned_to,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date,
        created_at=task.created_at
    )

# Delete a task
@write_session
def delete_task(session: Session, task_uuid: str) -> bool:
    task = session.query(tables.Tasks).filter(tables.Tasks.task_uuid == task_uuid).first()
    if not task:
        return False
    session.delete(task)
    return True
