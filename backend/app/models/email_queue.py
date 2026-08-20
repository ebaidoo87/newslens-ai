from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.db.base import Base


class EmailQueue(Base):
    __tablename__ = "email_queue"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    notification_id: Mapped[int | None] = mapped_column(
    ForeignKey(
        "notifications.id",
        ondelete="CASCADE",
    ),
    nullable=True,
    unique=True,
    )

    email_type: Mapped[str] = mapped_column(
    String(30),
    nullable=False,
    default="instant",
    server_default="instant",
    index=True,
    )

    recipient: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    subject: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    body: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="pending",
    )

    retry_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    last_error: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    sent_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    html_body: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
    )

    user = relationship("User")

    notification = relationship(
        "Notification",
    )

    provider: Mapped[str] = mapped_column(
    String(30),
    nullable=False,
    default="resend",
    server_default="resend",
    )

    provider_message_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        unique=True,
        index=True,
    )

    last_attempt_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    next_attempt_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    provider_status: Mapped[str | None] = mapped_column(
        String(40),
        nullable=True,
    )