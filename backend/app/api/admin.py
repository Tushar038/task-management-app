from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.models.user import User
from app.models.team import Team
from app.models.task import Task
from app.core.dependencies import get_current_user
from app.core.enums import UserRole
from app.core.errors import forbidden

router = APIRouter(prefix="/admin", tags=["Admin Analytics"])

@router.get("/overview")
def admin_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.ADMIN:
        forbidden("Admins only")

    users_count = db.query(User).count()
    teams_count = db.query(Team).count()
    tasks_count = db.query(Task).count()

    task_status = (
        db.query(Task.status, func.count(Task.id))
        .group_by(Task.status)
        .all()
    )

    return {
        "users": users_count,
        "teams": teams_count,
        "tasks": tasks_count,
        "task_status_summary": {
            status.value: count for status, count in task_status
        }
    }


@router.get("/users/roles")
def users_by_role(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.ADMIN:
        forbidden("Admins only")

    role_counts = (
        db.query(User.role, func.count(User.id))
        .group_by(User.role)
        .all()
    )

    return {
        role.value: count for role, count in role_counts
    }
