"""create articles table

Revision ID: d804f8553929
Revises:
Create Date: 2026-07-31 16:42:56.361074
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "d804f8553929"
down_revision: Union[
    str,
    Sequence[str],
    None,
] = None

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
        "articles",

        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "title",
            sa.String(length=500),
            nullable=False,
        ),

        sa.Column(
            "summary",
            sa.Text(),
            nullable=True,
        ),

        sa.Column(
            "content",
            sa.Text(),
            nullable=True,
        ),

        sa.Column(
            "url",
            sa.String(length=1000),
            nullable=False,
        ),

        sa.Column(
            "image_url",
            sa.String(length=1000),
            nullable=True,
        ),

        sa.Column(
            "source",
            sa.String(length=100),
            nullable=False,
        ),

        sa.Column(
            "author",
            sa.String(length=200),
            nullable=True,
        ),

        sa.Column(
            "language",
            sa.String(length=20),
            nullable=False,
            server_default="en",
        ),

        sa.Column(
            "country",
            sa.String(length=20),
            nullable=False,
            server_default="global",
        ),

        sa.Column(
            "category",
            sa.String(length=50),
            nullable=False,
            server_default="general",
        ),

        sa.Column(
            "published_at",
            sa.DateTime(),
            nullable=True,
        ),

        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text(
                "now()"
            ),
        ),

        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text(
                "now()"
            ),
        ),

        sa.PrimaryKeyConstraint(
            "id"
        ),
    )

    op.create_index(
        op.f("ix_articles_url"),
        "articles",
        ["url"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_articles_url"),
        table_name="articles",
    )

    op.drop_table(
        "articles"
    )