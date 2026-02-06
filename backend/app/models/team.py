from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    manager_id = Column(Integer, ForeignKey("users.id"))

    manager = relationship(
        "User",
        back_populates="managed_teams",
        foreign_keys=[manager_id]
    )

    members = relationship(
        "User",
        back_populates="team",
        foreign_keys="User.team_id"
    )




# from sqlalchemy import Column, Integer, String, ForeignKey
# from sqlalchemy.orm import relationship

# from app.db.base import Base


# class Team(Base):
#     __tablename__ = "teams"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String(255), nullable=False)

#     created_by_id = Column(Integer, ForeignKey("users.id"))

#     created_by = relationship("User")
