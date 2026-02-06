from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.team import Team
from app.models.user import User
from app.schemas.team import TeamCreate, TeamResponse
from app.core.dependencies import get_current_user, require_role
from app.core.enums import UserRole

router = APIRouter(prefix="/teams", tags=["Teams"])


# ----------------------------
# CREATE TEAM (ADMIN / MANAGER)
# ----------------------------
@router.post("/", response_model=TeamResponse)
def create_team(
    team: TeamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.MANAGER]))
):
    new_team = Team(
        name=team.name,
        manager_id=current_user.id   # 👈 manager owns the team
    )

    db.add(new_team)
    db.commit()
    db.refresh(new_team)

    return new_team


# ----------------------------
# LIST TEAMS (ANY LOGGED USER)
# ----------------------------
@router.get("/", response_model=list[TeamResponse])
def list_teams(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Team).all()


# ----------------------------
# ADD MEMBER TO TEAM
# ----------------------------
@router.post("/{team_id}/add-member/{user_id}")
def add_member(
    team_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.MANAGER]))
):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Only ADMIN or the team manager can add members
    if current_user.role != UserRole.ADMIN and team.manager_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to manage this team")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.team_id == team.id:
        raise HTTPException(status_code=400, detail="User already in this team")

    user.team_id = team.id
    db.commit()

    return {"message": "User added to team successfully"}

@router.get("/{team_id}/members")
def get_team_members(team_id: int, db: Session = Depends(get_db)):
    users = db.query(User).filter(User.team_id == team_id).all()
    return users
