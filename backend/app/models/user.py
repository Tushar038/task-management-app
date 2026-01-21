from sqlalchemy import Column, Integer, String, Boolean
from app.db.base import Base
from app.core.enums import UserRole
from sqlalchemy import Enum as SqlEnum



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    is_active = Column(Boolean, default=True)
    role = Column(
        SqlEnum(UserRole),
        default=UserRole.USER,
        nullable=False
    )

