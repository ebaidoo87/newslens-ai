from datetime import datetime

from sqlalchemy import (
    DateTime,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)
from sqlalchemy.sql import func

from app.db.base import Base


class EmailSuppression(Base):
    __tablename__ = "email_suppressions"

    __table_args__ = (
        UniqueConstraint(
            "email",
            name="uq_email_suppressions_email",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    reason: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    provider: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="resend",
        server_default="resend",
    )

    provider_message_id: Mapped[
        str | None
    ] = mapped_column(
        String(255),
        nullable=True,
    )

    details: Mapped[
        str | None
    ] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )