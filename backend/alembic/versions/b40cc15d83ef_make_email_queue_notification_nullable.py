"""make email queue notification nullable

Revision ID: b40cc15d83ef
Revises: c72858c1b4ea
Create Date: 2026-08-11 19:15:46.372544

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "b40cc15d83ef"
down_revision: str | None = "c72858c1b4ea"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column(
        "email_queue",
        "notification_id",
        existing_type=sa.Integer(),
        nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "email_queue",
        "notification_id",
        existing_type=sa.Integer(),
        nullable=False,
    )