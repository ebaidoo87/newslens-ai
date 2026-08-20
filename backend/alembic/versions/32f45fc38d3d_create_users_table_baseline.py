"""create users table baseline

Revision ID: 32f45fc38d3d
Revises: d804f8553929
Create Date: 2026-08-21 00:10:04.497775

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '32f45fc38d3d'
down_revision: Union[str, Sequence[str], None] = 'd804f8553929'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "users",
        "name",
        new_column_name="username",
        existing_type=sa.String(length=100),
        existing_nullable=False,
    )
    op.create_index(
        op.f("ix_users_username"),
        "users",
        ["username"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_users_username"),
        table_name="users",
    )
    op.alter_column(
        "users",
        "username",
        new_column_name="name",
        existing_type=sa.String(length=100),
        existing_nullable=False,
    )