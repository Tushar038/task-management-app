from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.team import Team
from app.schemas.team import TeamCreate, TeamResponse
from app.core.dependencies import get_current_user
from app.core.enums import UserRole
from app.core.errors import forbidden

router = APIRouter(prefix="/teams", tags=["Teams"])


@router.post("/", response_model=TeamResponse)
def create_team(
    team: TeamCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
        forbidden("You are not allowed to create teams")

    new_team = Team(
        name=team.name,
        created_by_id=current_user.id
    )

    db.add(new_team)
    db.commit()
    db.refresh(new_team)

    return new_team


@router.get("/", response_model=list[TeamResponse])
def list_teams(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(Team).all()
