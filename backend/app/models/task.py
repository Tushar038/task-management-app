from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Enum as SqlEnum
from app.core.enums import TaskStatus

from app.db.base import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(500))
    # status = Column(String(50), default="TODO")
    status = Column(
        SqlEnum(TaskStatus),
        default=TaskStatus.TODO,
        nullable=False
    )


    assigned_to_id = Column(Integer, ForeignKey("users.id"))
    team_id = Column(Integer, ForeignKey("teams.id"))
    created_by_id = Column(Integer, ForeignKey("users.id"))

    assigned_to = relationship("User", foreign_keys=[assigned_to_id])
    created_by = relationship("User", foreign_keys=[created_by_id])
    team = relationship("Team")
