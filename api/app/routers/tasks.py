from fastapi import APIRouter, Depends, HTTPException
import db
import app.models.tasks as tasks
import app.models.users as users
from app.dependencies import get_current_user
import app.events as events
from app.kafka_service import send_event, TOPIC_CHAT_EVENTS

router = APIRouter(prefix="/tasks")


@router.post("/new")
async def new_task(
    task_request: tasks.CreateTaskRequest,
    current_user: users.UserRow = Depends(get_current_user),
):
    task_uuid = db.tasks.new_task(current_user.user_uuid, task_request)
    event = events.TaskAddedToChatEvent(
        chat_uuid=task_request.chat_uuid,
        user_uuid=current_user.user_uuid,
        added_by_user_uuid=current_user.user_uuid,
    )
    await send_event(TOPIC_CHAT_EVENTS, event)
    return {"message": "New task created", "task_uuid": task_uuid}


@router.post("/list")
async def list_tasks(chat_uuid: str, current_user: users.UserRow = Depends(get_current_user)):
    task_rows = db.tasks.all_tasks(chat_uuid=chat_uuid)
    return {"message": "Tasks listed", "tasks": task_rows, "current_user_uuid": current_user.user_uuid}


@router.post("/all")
async def all_user_tasks(current_user: users.UserRow = Depends(get_current_user)):
    task_rows = db.tasks.user_tasks(user_uuid=current_user.user_uuid)
    return {"message": "User tasks listed", "tasks": task_rows}


@router.post("/update")
async def update_task(task_update: tasks.UpdateTaskRequest, current_user: users.UserRow = Depends(get_current_user)):
    updated_task = db.tasks.update_task(task_update)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task updated successfully", "task": updated_task}


@router.post("/delete")
async def delete_task(task_request: tasks.UpdateTaskRequest, current_user: users.UserRow = Depends(get_current_user)):
    success = db.tasks.delete_task(task_request.task_uuid)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}
