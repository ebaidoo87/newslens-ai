from sqlalchemy.orm import Session

from app.repositories.email_queue_repository import (
    EmailQueueRepository,
)
from app.services.email_suppression_service import (
    EmailSuppressionService,
)


class ResendWebhookService:

    def __init__(self, db: Session):
        self.db = db
        self.repository = (
            EmailQueueRepository()
        )
        self.suppression_service = (
        EmailSuppressionService(db)
        )

    def process_event(
        self,
        event: dict,
    ) -> bool:
        event_type = event.get(
            "type"
        )

        data = event.get(
            "data",
            {},
        )

        email_id = data.get(
            "email_id"
        )

        if not email_id:
            return False

        email = (
            self.repository
            .get_by_provider_message_id(
                self.db,
                email_id,
            )
        )

        if not email:
            return False

        status_map = {
            "email.sent": "sent",
            "email.delivered": "delivered",
            "email.delivery_delayed": (
                "delivery_delayed"
            ),
            "email.bounced": "bounced",
            "email.failed": "failed",
            "email.opened": "opened",
            "email.clicked": "clicked",
            "email.complained": (
                "complained"
            ),
        }

        provider_status = (
            status_map.get(
                event_type
            )
        )

        if not provider_status:
            return False

        error_message = None

        if event_type in {
            "email.failed",
            "email.bounced",
        }:
            error_message = str(
                data.get(
                    "error"
                )
                or data.get(
                    "bounce"
                )
                or event_type
            )

        self.repository.update_provider_status(
            self.db,
            email,
            provider_status,
            error_message,
        )

        if event_type == "email.bounced":
            self.suppression_service.suppress(
                email=email.recipient,
                reason="bounce",
                provider="resend",
                provider_message_id=(
                    email.provider_message_id
                ),
                details=error_message,
            )

        elif event_type == "email.complained":
            self.suppression_service.suppress(
                email=email.recipient,
                reason="complaint",
                provider="resend",
                provider_message_id=(
                    email.provider_message_id
                ),
                details=(
                    "Recipient reported "
                    "the email as spam"
                ),
            )

        return True