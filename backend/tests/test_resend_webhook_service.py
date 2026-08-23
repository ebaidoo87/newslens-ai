from app.models.email_queue import (
    EmailQueue,
)
from app.services.resend_webhook_service import (
    ResendWebhookService,
)

from tests.database import (
    TestingSessionLocal,
)
from tests.helpers.auth import (
    create_authenticated_user,
)


def create_email_queue_row(
    client,
    *,
    provider_message_id: str = "msg_test_123",
    recipient: str | None = None,
):
    auth = create_authenticated_user(
        client
    )

    db = TestingSessionLocal()

    try:
        email = EmailQueue(
            user_id=auth["user"]["id"],
            notification_id=None,
            email_type="instant",
            recipient=(
                recipient
                or auth["user"]["email"]
            ),
            subject="Webhook test",
            body="Webhook body",
            html_body=None,
            status="sent",
            retry_count=0,
            provider="resend",
            provider_message_id=(
                provider_message_id
            ),
            provider_status="accepted",
        )

        db.add(email)
        db.commit()
        db.refresh(email)

        return email.id

    finally:
        db.close()


def test_webhook_rejects_missing_email_id():
    db = TestingSessionLocal()

    try:
        service = ResendWebhookService(
            db
        )

        result = service.process_event(
            {
                "type": "email.delivered",
                "data": {},
            }
        )

        assert result is False

    finally:
        db.close()


def test_webhook_rejects_unknown_email():
    db = TestingSessionLocal()

    try:
        service = ResendWebhookService(
            db
        )

        result = service.process_event(
            {
                "type": "email.delivered",
                "data": {
                    "email_id":
                        "missing-message-id",
                },
            }
        )

        assert result is False

    finally:
        db.close()


def test_webhook_rejects_unknown_event(
    client,
):
    create_email_queue_row(
        client
    )

    db = TestingSessionLocal()

    try:
        service = ResendWebhookService(
            db
        )

        result = service.process_event(
            {
                "type": "email.unknown",
                "data": {
                    "email_id":
                        "msg_test_123",
                },
            }
        )

        assert result is False

    finally:
        db.close()


def test_delivered_event_updates_status(
    client,
):
    email_id = create_email_queue_row(
        client
    )

    db = TestingSessionLocal()

    try:
        service = ResendWebhookService(
            db
        )

        result = service.process_event(
            {
                "type": "email.delivered",
                "data": {
                    "email_id":
                        "msg_test_123",
                },
            }
        )

        assert result is True

        email = db.get(
            EmailQueue,
            email_id,
        )

        assert email is not None
        assert (
            email.provider_status
            == "delivered"
        )

    finally:
        db.close()


def test_failed_event_records_error(
    client,
):
    email_id = create_email_queue_row(
        client,
        provider_message_id=(
            "msg_failed"
        ),
    )

    db = TestingSessionLocal()

    try:
        service = ResendWebhookService(
            db
        )

        result = service.process_event(
            {
                "type": "email.failed",
                "data": {
                    "email_id":
                        "msg_failed",
                    "error":
                        "Provider failure",
                },
            }
        )

        assert result is True

        email = db.get(
            EmailQueue,
            email_id,
        )

        assert email is not None
        assert (
            email.provider_status
            == "failed"
        )
        assert (
            email.last_error
            == "Provider failure"
        )

    finally:
        db.close()

def test_bounce_suppresses_recipient(
    client,
):
    email_id = create_email_queue_row(
        client,
        provider_message_id="msg_bounce",
        recipient="bounce@example.com",
    )

    db = TestingSessionLocal()

    try:
        service = ResendWebhookService(
            db
        )

        result = service.process_event(
            {
                "type": "email.bounced",
                "data": {
                    "email_id":
                        "msg_bounce",
                    "bounce":
                        "Mailbox rejected",
                },
            }
        )

        assert result is True

        email = db.get(
            EmailQueue,
            email_id,
        )

        assert email is not None
        assert (
            email.provider_status
            == "bounced"
        )

        assert (
            service.suppression_service
            .is_suppressed(
                "bounce@example.com"
            )
            is True
        )

    finally:
        db.close()


def test_complaint_suppresses_recipient(
    client,
):
    create_email_queue_row(
        client,
        provider_message_id=(
            "msg_complaint"
        ),
        recipient=(
            "complaint@example.com"
        ),
    )

    db = TestingSessionLocal()

    try:
        service = ResendWebhookService(
            db
        )

        result = service.process_event(
            {
                "type":
                    "email.complained",
                "data": {
                    "email_id":
                        "msg_complaint",
                },
            }
        )

        assert result is True

        assert (
            service.suppression_service
            .is_suppressed(
                "complaint@example.com"
            )
            is True
        )

    finally:
        db.close()