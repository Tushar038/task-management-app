from pydantic import BaseModel
from typing import Optional
from app.core.enums import TaskStatus


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    team_id: int
    assigned_to_id: int
    status: TaskStatus = TaskStatus.TODO



class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    assigned_to_id: int
    team_id: int

    class Config:
        from_attributes = True

class TaskStatusUpdate(BaseModel):
    status: TaskStatus
