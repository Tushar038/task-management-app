from fastapi import APIRouter, Depends

from app.core.dependencies import require_role
from app.core.enums import UserRole


router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard")
def admin_dashboard(
    admin_user=Depends(require_role(UserRole))
):
    return {
        "message": "Welcome Admin",
        "email": admin_user.email
    }
