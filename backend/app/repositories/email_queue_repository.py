from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.email_queue import EmailQueue

from datetime import (
    datetime,
    timedelta,
    timezone,
)

class EmailQueueRepository:

    def create(
        self,
        db: Session,
        email: EmailQueue,
    ) -> EmailQueue:
        db.add(email)
        db.commit()
        db.refresh(email)

        return email


    def get_pending(
        self,
        db: Session,
        limit: int = 50,
        max_retries: int = 3,
    ) -> list[EmailQueue]:
        now = datetime.now(
            timezone.utc
        )

        return (
            db.query(EmailQueue)
            .filter(
                EmailQueue.status
                == "pending",

                EmailQueue.retry_count
                < max_retries,

                (
                    EmailQueue.next_attempt_at
                    .is_(None)
                )
                | (
                    EmailQueue.next_attempt_at
                    <= now
                ),
            )
            .order_by(
                EmailQueue.created_at.asc()
            )
            .limit(limit)
            .all()
        )


    def get_by_notification_id(
        self,
        db: Session,
        notification_id: int,
    ) -> EmailQueue | None:
        return (
            db.query(EmailQueue)
            .filter(
                EmailQueue.notification_id
                == notification_id
            )
            .first()
        )


    def mark_processing(
        self,
        db: Session,
        email: EmailQueue,
    ) -> EmailQueue:
        email.status = "processing"

        email.last_attempt_at = (
            datetime.now(
                timezone.utc
            )
        )

        db.commit()
        db.refresh(email)

        return email


    def mark_sent(
        self,
        db: Session,
        email: EmailQueue,
        provider: str,
        provider_message_id: str | None,
        provider_status: str,
    ) -> EmailQueue:
        email.status = "sent"

        email.provider = provider

        email.provider_message_id = (
            provider_message_id
        )

        email.provider_status = (
            provider_status
        )

        email.sent_at = datetime.now(
            timezone.utc
        )

        email.next_attempt_at = None
        email.last_error = None

        db.commit()
        db.refresh(email)

        return email


    def mark_failed(
        self,
        db: Session,
        email: EmailQueue,
        error_message: str,
    ) -> EmailQueue:
        email.status = "failed"
        email.last_error = error_message

        db.commit()
        db.refresh(email)

        return email


    def increment_retry(
        self,
        db: Session,
        email: EmailQueue,
        error_message: str | None = None,
    ) -> EmailQueue:
        email.retry_count += 1

        if error_message:
            email.last_error = (
                error_message
            )

        email.status = "pending"

        db.commit()
        db.refresh(email)

        return email


    def reset_failed_for_retry(
        self,
        db: Session,
        email: EmailQueue,
    ) -> EmailQueue:
        email.status = "pending"
        email.last_error = None

        db.commit()
        db.refresh(email)

        return email


    def delete_old_sent(
        self,
        db: Session,
        older_than_days: int = 30,
    ) -> int:
        cutoff = (
            datetime.now(
                timezone.utc
            )
            - timedelta(
                days=older_than_days
            )
        )

        deleted_count = (
            db.query(EmailQueue)
            .filter(
                EmailQueue.status == "sent",
                EmailQueue.sent_at.is_not(
                    None
                ),
                EmailQueue.sent_at
                < cutoff,
            )
            .delete(
                synchronize_session=False
            )
        )

        db.commit()

        return deleted_count

    def schedule_retry(
        self,
        db: Session,
        email: EmailQueue,
        error_message: str,
    ) -> EmailQueue:
        email.retry_count += 1

        delay_minutes = min(
            2 ** email.retry_count,
            60,
        )

        email.status = "pending"

        email.last_error = (
            error_message
        )

        email.next_attempt_at = (
            datetime.now(
                timezone.utc
            )
            + timedelta(
                minutes=delay_minutes
            )
        )

        db.commit()
        db.refresh(email)

        return email

    def mark_failed(
        self,
        db: Session,
        email: EmailQueue,
        error_message: str,
    ) -> EmailQueue:
        email.status = "failed"

        email.provider_status = (
            "failed"
        )

        email.last_error = (
            error_message
        )

        email.next_attempt_at = None

        db.commit()
        db.refresh(email)

        return email

    def get_by_provider_message_id(
        self,
        db: Session,
        provider_message_id: str,
    ) -> EmailQueue | None:
        return (
            db.query(EmailQueue)
            .filter(
                EmailQueue.provider_message_id
                == provider_message_id
            )
            .first()
        )

    def update_provider_status(
        self,
        db: Session,
        email: EmailQueue,
        provider_status: str,
        error_message: str | None = None,
    ) -> EmailQueue:
        email.provider_status = provider_status

        if error_message:
            email.last_error = error_message

        db.commit()
        db.refresh(email)

        return email