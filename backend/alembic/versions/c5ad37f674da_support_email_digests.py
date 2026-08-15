"""support email digests

Revision ID: c5ad37f674da
Revises: abfb26df0433
Create Date: 2026-08-11 18:22:28.450582

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c5ad37f674da'
down_revision: Union[str, Sequence[str], None] = 'abfb26df0433'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "email_queue",
        "notification_id",
        existing_type=sa.Integer(),
        nullable=True,
    )

    op.add_column(
        "email_queue",
        sa.Column(
            "email_type",
            sa.String(length=30),
            server_default="instant",
            nullable=False,
        ),
    )

    op.create_index(
        op.f(
            "ix_email_queue_email_type"
        ),
        "email_queue",
        ["email_type"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f(
            "ix_email_queue_email_type"
        ),
        table_name="email_queue",
    )

    op.drop_column(
        "email_queue",
        "email_type",
    )

    op.alter_column(
        "email_queue",
        "notification_id",
        existing_type=sa.Integer(),
        nullable=False,
    )
