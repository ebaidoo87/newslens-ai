from sqlalchemy.orm import Session

from app.models.email_suppression import (
    EmailSuppression,
)
from app.repositories.email_suppression_repository import (
    EmailSuppressionRepository,
)


class EmailSuppressionService:

    def __init__(
        self,
        db: Session,
    ):
        self.db = db
        self.repository = (
            EmailSuppressionRepository()
        )

    @staticmethod
    def normalize_email(
        email: str,
    ) -> str:
        return email.strip().lower()

    def is_suppressed(
        self,
        email: str,
    ) -> bool:
        return (
            self.repository.is_suppressed(
                self.db,
                self.normalize_email(
                    email
                ),
            )
        )

    def suppress(
        self,
        email: str,
        reason: str,
        provider: str = "resend",
        provider_message_id:
            str | None = None,
        details: str | None = None,
    ) -> EmailSuppression:
        normalized_email = (
            self.normalize_email(
                email
            )
        )

        existing = (
            self.repository.get_by_email(
                self.db,
                normalized_email,
            )
        )

        if existing:
            return existing

        suppression = EmailSuppression(
            email=normalized_email,
            reason=reason,
            provider=provider,
            provider_message_id=(
                provider_message_id
            ),
            details=details,
        )

        return self.repository.create(
            self.db,
            suppression,
        )