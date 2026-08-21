"""create email queue

Revision ID: abfb26df0433
Revises: d7f149a3dc28
Create Date: 2026-08-08 23:13:13.299983
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "abfb26df0433"

down_revision: Union[
    str,
    Sequence[str],
    None,
] = "d7f149a3dc28"

branch_labels: Union[
    str,
    Sequence[str],
    None,
] = None

depends_on: Union[
    str,
    Sequence[str],
    None,
] = None


def upgrade() -> None:
    op.create_table(
        "email_queue",

        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "user_id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "notification_id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "recipient",
            sa.String(length=255),
            nullable=False,
        ),

        sa.Column(
            "subject",
            sa.String(length=255),
            nullable=False,
        ),

        sa.Column(
            "body",
            sa.Text(),
            nullable=False,
        ),

        sa.Column(
            "status",
            sa.String(length=20),
            server_default="pending",
            nullable=False,
        ),

        sa.Column(
            "retry_count",
            sa.Integer(),
            server_default="0",
            nullable=False,
        ),

        sa.Column(
            "last_error",
            sa.Text(),
            nullable=True,
        ),

        sa.Column(
            "sent_at",
            sa.DateTime(),
            nullable=True,
        ),

        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text(
                "now()"
            ),
            nullable=False,
        ),

        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
        ),

        sa.ForeignKeyConstraint(
            ["notification_id"],
            ["notifications.id"],
            ondelete="CASCADE",
        ),

        sa.PrimaryKeyConstraint(
            "id"
        ),

        sa.UniqueConstraint(
            "notification_id"
        ),
    )

    op.create_index(
        op.f("ix_email_queue_user_id"),
        "email_queue",
        ["user_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_email_queue_user_id"),
        table_name="email_queue",
    )

    op.drop_table(
        "email_queue"
    )