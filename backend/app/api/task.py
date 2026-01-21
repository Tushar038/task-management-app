from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.task import Task
from app.models.team import Team
from app.models.user import User
from app.schemas.task import (
    TaskCreate,
    TaskResponse,
    TaskStatusUpdate,
)
from app.core.dependencies import get_current_user
from app.core.enums import UserRole
from app.core.errors import forbidden, not_found

router = APIRouter(prefix="/tasks", tags=["Tasks"])


# -----------------------------
# CREATE TASK
# -----------------------------
@router.post("/", response_model=TaskResponse)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Role check
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
        forbidden("You are not allowed to perform this action")

    # Validate team
    team = db.query(Team).filter(Team.id == task.team_id).first()
    if not team:
        not_found("Team not found")

    # 🔐 IDOR protection: validate assigned user
    assignee = (
        db.query(User)
        .filter(User.id == task.assigned_to_id)
        .first()
    )
    if not assignee:
        not_found("Assigned user does not exist")

    new_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        assigned_to_id=task.assigned_to_id,
        team_id=task.team_id,
        created_by_id=current_user.id,
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


# -----------------------------
# LIST TASKS (ROLE + PAGINATION)
# -----------------------------
@router.get("/", response_model=list[TaskResponse])
def list_tasks(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    query = db.query(Task)

    # Role-based filtering
    if current_user.role != UserRole.ADMIN:
        query = query.filter(Task.assigned_to_id == current_user.id)

    tasks = (
        query
        .offset(skip)
        .limit(limit)
        .all()
    )

    return tasks


# -----------------------------
# UPDATE TASK STATUS
# -----------------------------
@router.patch("/{task_id}/status", response_model=TaskResponse)
def update_task_status(
    task_id: int,
    status_update: TaskStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        not_found("Task not found")

    # Ownership / role check
    if (
        current_user.role != UserRole.ADMIN
        and task.assigned_to_id != current_user.id
    ):
        forbidden("You are not allowed to perform this action")

    task.status = status_update.status
    db.commit()
    db.refresh(task)

    return task
