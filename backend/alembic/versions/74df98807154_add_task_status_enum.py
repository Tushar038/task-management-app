"""add task status enum

Revision ID: 74df98807154
Revises: 096a89a31cbb
Create Date: 2026-01-20 12:16:20.390943

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '74df98807154'
down_revision: Union[str, Sequence[str], None] = '096a89a31cbb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

task_status_enum = postgresql.ENUM(
    "TODO", "IN_PROGRESS", "DONE",
    name="taskstatus"
)

def upgrade():
    # 1. Create ENUM type
    task_status_enum.create(op.get_bind(), checkfirst=True)

    # 2. Update existing rows (important if data exists)
    op.execute("UPDATE tasks SET status = 'TODO' WHERE status IS NULL")

    # 3. Alter column to use ENUM
    op.execute(
    """
    ALTER TABLE tasks
    ALTER COLUMN status
    TYPE taskstatus
    USING status::taskstatus
    """
)



def downgrade():
    # Convert enum back to string
    op.alter_column(
        "tasks",
        "status",
        type_=sa.String(),
        nullable=True
    )

    # Drop ENUM type
    task_status_enum.drop(op.get_bind(), checkfirst=True)

