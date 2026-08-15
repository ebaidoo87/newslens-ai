from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.email_queue import EmailQueue
from app.models.email_suppression import EmailSuppression


class EmailMonitoringRepository:

    def count_by_status(
        self,
        db: Session,
    ) -> dict[str, int]:
        rows = (
            db.query(
                EmailQueue.status,
                func.count(
                    EmailQueue.id
                ),
            )
            .group_by(
                EmailQueue.status
            )
            .all()
        )

        return {
            status: count
            for status, count in rows
        }

    def count_by_provider_status(
        self,
        db: Session,
    ) -> dict[str, int]:
        rows = (
            db.query(
                EmailQueue.provider_status,
                func.count(
                    EmailQueue.id
                ),
            )
            .filter(
                EmailQueue.provider_status
                .is_not(None)
            )
            .group_by(
                EmailQueue.provider_status
            )
            .all()
        )

        return {
            status: count
            for status, count in rows
        }

    def count_retrying(
        self,
        db: Session,
    ) -> int:
        return (
            db.query(
                EmailQueue
            )
            .filter(
                EmailQueue.status
                == "pending",
                EmailQueue.retry_count > 0,
            )
            .count()
        )

    def count_suppressed(
        self,
        db: Session,
    ) -> int:
        return (
            db.query(
                EmailSuppression
            )
            .count()
        )

    def get_recent_emails(
        self,
        db: Session,
        limit: int = 25,
    ) -> list[EmailQueue]:
        return (
            db.query(
                EmailQueue
            )
            .order_by(
                EmailQueue.created_at.desc()
            )
            .limit(limit)
            .all()
        )