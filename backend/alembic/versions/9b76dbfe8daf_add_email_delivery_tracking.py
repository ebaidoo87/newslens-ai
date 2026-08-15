"""add email delivery tracking

Revision ID: 9b76dbfe8daf
Revises: 116db0d01e5d
Create Date: 2026-08-15 17:39:02.828700

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9b76dbfe8daf'
down_revision: Union[str, Sequence[str], None] = '116db0d01e5d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "email_queue",
        sa.Column(
            "provider",
            sa.String(length=30),
            server_default="resend",
            nullable=False,
        ),
    )

    op.add_column(
        "email_queue",
        sa.Column(
            "provider_message_id",
            sa.String(length=255),
            nullable=True,
        ),
    )

    op.add_column(
        "email_queue",
        sa.Column(
            "provider_status",
            sa.String(length=40),
            nullable=True,
        ),
    )

    op.add_column(
        "email_queue",
        sa.Column(
            "last_attempt_at",
            sa.DateTime(),
            nullable=True,
        ),
    )

    op.add_column(
        "email_queue",
        sa.Column(
            "next_attempt_at",
            sa.DateTime(),
            nullable=True,
        ),
    )

    op.create_index(
        op.f(
            "ix_email_queue_provider_message_id"
        ),
        "email_queue",
        ["provider_message_id"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(
        op.f(
            "ix_email_queue_provider_message_id"
        ),
        table_name="email_queue",
    )

    op.drop_column(
        "email_queue",
        "next_attempt_at",
    )

    op.drop_column(
        "email_queue",
        "last_attempt_at",
    )

    op.drop_column(
        "email_queue",
        "provider_status",
    )

    op.drop_column(
        "email_queue",
        "provider_message_id",
    )

    op.drop_column(
        "email_queue",
        "provider",
    )
