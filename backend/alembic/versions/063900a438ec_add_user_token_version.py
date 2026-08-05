"""add user token version

Revision ID: 063900a438ec
Revises: 2159e3e64e67
Create Date: 2026-08-05 14:31:43.847263

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '063900a438ec'
down_revision: Union[str, Sequence[str], None] = '2159e3e64e67'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "token_version",
            sa.Integer(),
            server_default="0",
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_column(
        "users",
        "token_version",
    )
