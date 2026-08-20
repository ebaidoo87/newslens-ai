from app.db.session import SessionLocal
from app.repositories.email_queue_repository import (
    EmailQueueRepository,
)
from app.services.email_sender import (
    EmailSender,
)
from app.services.email_suppression_service import (
    EmailSuppressionService,
)

MAX_RETRIES = 3
BATCH_SIZE = 25


def process_email_queue() -> None:
    db = SessionLocal()

    repository = EmailQueueRepository()
    sender = EmailSender()
    suppression_service = (
    EmailSuppressionService(db)
    )

    try:
        pending_emails = (
            repository.get_pending(
                db,
                limit=BATCH_SIZE,
                max_retries=MAX_RETRIES,
            )
        )

        for email in pending_emails:

            if not pending_emails:
                print(
                    "📭 No pending emails."
                )
                return

            print(
                f"📨 Processing "
                f"{len(pending_emails)} "
                f"queued emails..."
            )

            if suppression_service.is_suppressed(
                email.recipient
            ):
                repository.mark_failed(
                    db,
                    email,
                    (
                        "Recipient is on "
                        "email suppression list"
                    ),
                )

                print(
                    f"⛔ Email {email.id} skipped: "
                    f"{email.recipient} is suppressed."
                )

                try:
                    repository.mark_processing(
                        db,
                        email,
                    )

                    result = sender.send(
                        recipient=email.recipient,
                        subject=email.subject,
                        body=email.body,
                        html_body=email.html_body,
                        idempotency_key=(
                            f"newslens-email/{email.id}"
                        ),
                    )

                    if result.success:
                        repository.mark_sent(
                            db,
                            email,
                            provider=result.provider,
                            provider_message_id=(
                                result.provider_message_id
                            ),
                            provider_status=(
                                result.provider_status
                            ),
                        )

                        print(
                            f"✅ Email {email.id} accepted "
                            f"by {result.provider}. "
                            f"ID={result.provider_message_id}"
                        )

                        continue

                    next_retry_count = (
                        email.retry_count
                        + 1
                    )

                    if next_retry_count >= MAX_RETRIES:
                            email.retry_count = (
                                next_retry_count
                            )

                            repository.mark_failed(
                                db,
                                email,
                                result.error
                                or "Maximum retries reached",
                            )

                            print(
                                f"❌ Email {email.id} "
                                "exhausted retries."
                            )

                    else:
                        repository.schedule_retry(
                            db,
                            email,
                            result.error
                            or "Temporary email failure",
                        )

                        print(
                            f"⚠️ Email {email.id} "
                            f"scheduled for retry "
                            f"{email.retry_count}/"
                            f"{MAX_RETRIES}"
                        )

                except Exception as error:
                    error_message = str(error)

                    next_retry_count = (
                        email.retry_count
                        + 1
                    )

                    if (
                        next_retry_count
                        >= MAX_RETRIES
                    ):
                        email.retry_count = (
                            next_retry_count
                        )

                        repository.mark_failed(
                            db,
                            email,
                            error_message,
                        )

                        print(
                            f"❌ Email "
                            f"{email.id} "
                            f"failed permanently: "
                            f"{error_message}"
                        )

                    else:
                        repository.increment_retry(
                            db,
                            email,
                            error_message,
                        )

                        print(
                            f"⚠️ Email "
                            f"{email.id} "
                            f"failed: "
                            f"{error_message}. "
                            f"Retry "
                            f"{email.retry_count}"
                            f"/{MAX_RETRIES}"
                        )

    finally:
        db.close()


if __name__ == "__main__":
    process_email_queue()