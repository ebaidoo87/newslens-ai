from datetime import datetime

from sqlalchemy.orm import (
    Session,
    joinedload,
)

from app.models.digest_notification import (
    DigestNotification,
)
from app.models.notification import (
    Notification,
)


class DigestRepository:

    def get_undelivered_notifications(
        self,
        db: Session,
        user_id: int,
        since: datetime,
        limit: int = 50,
    ) -> list[Notification]:
        already_used = (
            db.query(
                DigestNotification.notification_id
            )
            .filter(
                DigestNotification.user_id
                == user_id
            )
            .subquery()
        )

        return (
            db.query(Notification)
            .options(
                joinedload(
                    Notification.article
                )
            )
            .filter(
                Notification.user_id
                == user_id,
                Notification.created_at
                >= since,
                ~Notification.id.in_(
                    already_used
                ),
            )
            .order_by(
                Notification.created_at.desc()
            )
            .limit(limit)
            .all()
        )

    def mark_notifications_in_digest(
        self,
        db: Session,
        user_id: int,
        email_queue_id: int,
        notification_ids: list[int],
    ) -> None:
        rows = [
            DigestNotification(
                user_id=user_id,
                notification_id=(
                    notification_id
                ),
                email_queue_id=(
                    email_queue_id
                ),
            )
            for notification_id
            in notification_ids
        ]

        db.add_all(rows)
        db.commit()