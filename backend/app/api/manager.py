from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.models.team import Team
from app.models.task import Task
from app.models.user import User
from app.core.dependencies import get_current_user
from app.core.enums import UserRole
from app.core.errors import forbidden

router = APIRouter(prefix="/manager", tags=["Manager Dashboard"])

@router.get("/overview")
def manager_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.MANAGER:
        forbidden("Only managers can access this")

    teams = db.query(Team).filter(
        Team.manager_id == current_user.id
    ).all()

    team_ids = [team.id for team in teams]

    total_members = (
        db.query(User)
        .filter(User.team_id.in_(team_ids))
        .count()
    )

    task_summary = (
        db.query(Task.status, func.count(Task.id))
        .filter(Task.team_id.in_(team_ids))
        .group_by(Task.status)
        .all()
    )

    return {
        "teams_managed": len(teams),
        "total_members": total_members,
        "task_summary": {
            status.value: count for status, count in task_summary
        }
    }

@router.get("/team/{team_id}/tasks")
def manager_team_tasks(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.MANAGER:
        forbidden("Only managers can access this")

    team = db.query(Team).filter(
        Team.id == team_id,
        Team.manager_id == current_user.id
    ).first()

    if not team:
        forbidden("You do not manage this team")

    tasks = db.query(Task).filter(
        Task.team_id == team_id
    ).all()

    return {
        "team": team.name,
        "tasks": tasks
    }
