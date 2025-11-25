from fastapi import APIRouter, Depends, HTTPException
import db
import app.models.tasks as tasks
import app.models.users as users
from app.dependencies import get_current_user

router = APIRouter(prefix="/tasks")


@router.post("/new")
async def new_task(task_request: tasks.CreateTaskRequest, current_user: users.UserRow = Depends(get_current_user)):
    task_uuid = db.tasks.new_task(creator_id=current_user.user_id, task_data=task_request)
    return {"message": "New task created", "task_uuid": task_uuid}


@router.post("/list")
async def list_tasks(chat_uuid: str, current_user: users.UserRow = Depends(get_current_user)):
    task_rows = db.tasks.all_tasks(chat_uuid=chat_uuid)
    return {"message": "Tasks listed", "tasks": task_rows, "current_user_id": current_user.user_id}


@router.post("/all")
async def all_user_tasks(current_user: users.UserRow = Depends(get_current_user)):
    task_rows = db.tasks.user_tasks(user_id=current_user.user_id)
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
