from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base
from app.core.enums import UserRole
from sqlalchemy import Enum as SqlEnum


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    is_active = Column(Boolean, default=True)

    role = Column(SqlEnum(UserRole), default=UserRole.USER, nullable=False)

    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)

    # ⭐ FIX HERE
    team = relationship(
        "Team",
        back_populates="members",
        foreign_keys=[team_id]
    )

    managed_teams = relationship(
        "Team",
        back_populates="manager",
        foreign_keys="Team.manager_id"
    )
