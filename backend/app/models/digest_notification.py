from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    UniqueConstraint,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)
from sqlalchemy.sql import func

from app.db.base import Base


class DigestNotification(Base):
    __tablename__ = "digest_notifications"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "notification_id",
            name=(
                "uq_digest_notifications_"
                "user_notification"
            ),
        ),
    )

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

    notification_id: Mapped[int] = mapped_column(
        ForeignKey(
            "notifications.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    email_queue_id: Mapped[int] = mapped_column(
        ForeignKey(
            "email_queue.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )