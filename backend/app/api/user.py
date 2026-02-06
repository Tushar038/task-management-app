from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import HTTPException


from app.db.session import get_db
from app.models.user import User
from app.core.permissions import require_roles
from app.core.enums import UserRole

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/all")
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN]))
):
    return db.query(User).all()

@router.patch("/{user_id}/role")
def update_user_role(
    user_id: int,
    new_role: UserRole,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN]))
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot modify your own role")


    user.role = new_role
    db.commit()
    db.refresh(user)

    return {"message": "User role updated", "user": user.email, "new_role": user.role}
