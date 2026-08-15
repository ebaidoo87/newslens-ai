from dataclasses import dataclass

import resend

from app.core.config import settings
from app.core.logging import logger


@dataclass
class EmailSendResult:
    success: bool
    provider: str
    provider_message_id: str | None
    provider_status: str
    retryable: bool
    error: str | None = None


class EmailSender:

    def __init__(self):
        resend.api_key = (
            settings.RESEND_API_KEY
        )

    def send(
        self,
        recipient: str,
        subject: str,
        body: str,
        html_body: str | None = None,
        idempotency_key: str | None = None,
    ) -> EmailSendResult:
        if not settings.RESEND_API_KEY:
            return EmailSendResult(
                success=False,
                provider="resend",
                provider_message_id=None,
                provider_status="failed",
                retryable=False,
                error=(
                    "RESEND_API_KEY is not configured"
                ),
            )

        payload = {
            "from": settings.EMAIL_FROM,
            "to": [recipient],
            "subject": subject,
            "text": body,
        }

        if html_body:
            payload["html"] = html_body

        try:
            response = resend.Emails.send(
                payload
            )

            message_id = response.get(
                "id"
            )

            logger.info(
                "Resend accepted email for %s. "
                "Message ID: %s",
                recipient,
                message_id,
            )

            return EmailSendResult(
                success=True,
                provider="resend",
                provider_message_id=(
                    message_id
                ),
                provider_status="accepted",
                retryable=False,
            )

        except Exception as error:
            status_code = getattr(
                error,
                "status_code",
                None,
            )

            error_code = getattr(
                error,
                "code",
                None,
            )

            retryable = (
                status_code == 429
                or status_code is None
                or (
                    isinstance(
                        status_code,
                        int,
                    )
                    and status_code >= 500
                )
            )

            error_message = str(error)

            logger.exception(
                "Resend email failure. "
                "recipient=%s status=%s "
                "code=%s retryable=%s",
                recipient,
                status_code,
                error_code,
                retryable,
            )

            return EmailSendResult(
                success=False,
                provider="resend",
                provider_message_id=None,
                provider_status="failed",
                retryable=retryable,
                error=error_message,
            )