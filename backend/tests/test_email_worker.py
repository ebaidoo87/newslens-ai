from app.jobs import email_worker
from app.models.email_queue import EmailQueue
from app.services.email_sender import EmailSender

from tests.database import (
    TestingSessionLocal,
)
from tests.helpers.auth import (
    create_authenticated_user,
)

from app.jobs import email_worker
from app.models.email_queue import EmailQueue
from app.services.email_sender import (
    EmailSendResult,
    EmailSender,
)

from app.services.email_suppression_service import (
    EmailSuppressionService,
)

from tests.database import (
    TestingSessionLocal,
)
from tests.helpers.auth import (
    create_authenticated_user,
)

class FakeSendResult:
    success = True
    provider = "test"
    provider_message_id = (
        "test-message-id"
    )
    provider_status = "accepted"
    error = None


def test_email_worker_does_not_call_real_provider(
    client,
    monkeypatch,
):
    auth = create_authenticated_user(
        client
    )

    called = {
        "value": False,
    }

    def fake_send(
        self,
        *,
        recipient,
        subject,
        body,
        html_body=None,
        idempotency_key=None,
    ):
        called["value"] = True

        return FakeSendResult()

    monkeypatch.setattr(
        email_worker,
        "SessionLocal",
        TestingSessionLocal,
    )

    monkeypatch.setattr(
        EmailSender,
        "send",
        fake_send,
    )

    db = TestingSessionLocal()

    try:
        email = EmailQueue(
            user_id=auth["user"]["id"],
            notification_id=None,
            email_type="instant",
            recipient=(
                auth["user"]["email"]
            ),
            subject="Worker test",
            body="Test email body",
            html_body=None,
            status="pending",
            retry_count=0,
        )

        db.add(email)
        db.commit()

    finally:
        db.close()

    email_worker.process_email_queue()

    assert called["value"] is True


def create_pending_email(
    client,
    *,
    retry_count: int = 0,
    recipient: str | None = None,
) -> int:
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
            subject="Worker test",
            body="Worker test body",
            html_body=None,
            status="pending",
            retry_count=retry_count,
        )

        db.add(email)
        db.commit()
        db.refresh(email)

        return email.id

    finally:
        db.close()


def test_email_worker_schedules_retry(
    client,
    monkeypatch,
):
    email_id = create_pending_email(
        client,
        retry_count=0,
    )

    def fake_send(
        self,
        *,
        recipient,
        subject,
        body,
        html_body=None,
        idempotency_key=None,
    ):
        return EmailSendResult(
            success=False,
            provider="resend",
            provider_message_id=None,
            provider_status="failed",
            retryable=True,
            error=(
                "Temporary provider failure"
            ),
        )

    monkeypatch.setattr(
        email_worker,
        "SessionLocal",
        TestingSessionLocal,
    )

    monkeypatch.setattr(
        EmailSender,
        "send",
        fake_send,
    )

    email_worker.process_email_queue()

    db = TestingSessionLocal()

    try:
        email = db.get(
            EmailQueue,
            email_id,
        )

        assert email is not None

        assert email.status == "pending"

        assert email.retry_count == 1

        assert (
            email.last_error
            == "Temporary provider failure"
        )

        assert (
            email.next_attempt_at
            is not None
        )

    finally:
        db.close()


def test_email_worker_marks_failed_at_max_retries(
    client,
    monkeypatch,
):
    email_id = create_pending_email(
        client,
        retry_count=2,
    )

    def fake_send(
        self,
        *,
        recipient,
        subject,
        body,
        html_body=None,
        idempotency_key=None,
    ):
        return EmailSendResult(
            success=False,
            provider="resend",
            provider_message_id=None,
            provider_status="failed",
            retryable=True,
            error="Provider unavailable",
        )

    monkeypatch.setattr(
        email_worker,
        "SessionLocal",
        TestingSessionLocal,
    )

    monkeypatch.setattr(
        EmailSender,
        "send",
        fake_send,
    )

    email_worker.process_email_queue()

    db = TestingSessionLocal()

    try:
        email = db.get(
            EmailQueue,
            email_id,
        )

        assert email is not None

        assert email.status == "failed"

        assert email.retry_count == 3

        assert (
            email.provider_status
            == "failed"
        )

        assert (
            email.last_error
            == "Provider unavailable"
        )

        assert (
            email.next_attempt_at
            is None
        )

    finally:
        db.close()


def test_email_worker_retries_after_exception(
    client,
    monkeypatch,
):
    email_id = create_pending_email(
        client,
        retry_count=0,
    )

    def fake_send(
        self,
        *,
        recipient,
        subject,
        body,
        html_body=None,
        idempotency_key=None,
    ):
        raise RuntimeError(
            "Network unavailable"
        )

    monkeypatch.setattr(
        email_worker,
        "SessionLocal",
        TestingSessionLocal,
    )

    monkeypatch.setattr(
        EmailSender,
        "send",
        fake_send,
    )

    email_worker.process_email_queue()

    db = TestingSessionLocal()

    try:
        email = db.get(
            EmailQueue,
            email_id,
        )

        assert email is not None

        assert email.status == "pending"

        assert email.retry_count == 1

        assert (
            email.last_error
            == "Network unavailable"
        )

    finally:
        db.close()


def test_email_worker_exception_marks_failed_at_max_retries(
    client,
    monkeypatch,
):
    email_id = create_pending_email(
        client,
        retry_count=2,
    )

    def fake_send(
        self,
        *,
        recipient,
        subject,
        body,
        html_body=None,
        idempotency_key=None,
    ):
        raise RuntimeError(
            "Permanent failure"
        )

    monkeypatch.setattr(
        email_worker,
        "SessionLocal",
        TestingSessionLocal,
    )

    monkeypatch.setattr(
        EmailSender,
        "send",
        fake_send,
    )

    email_worker.process_email_queue()

    db = TestingSessionLocal()

    try:
        email = db.get(
            EmailQueue,
            email_id,
        )

        assert email is not None

        assert email.status == "failed"

        assert email.retry_count == 3

        assert (
            email.last_error
            == "Permanent failure"
        )

        assert (
            email.next_attempt_at
            is None
        )

    finally:
        db.close()


def test_suppressed_recipient_is_never_sent(
    client,
    monkeypatch,
):
    recipient = (
        "suppressed@example.com"
    )

    email_id = create_pending_email(
        client,
        recipient=recipient,
    )

    db = TestingSessionLocal()

    try:
        suppression = (
            EmailSuppressionService(
                db
            )
        )

        suppression.suppress(
            email=recipient,
            reason="test",
        )

    finally:
        db.close()

    called = {
        "value": False,
    }

    def fake_send(
        self,
        *,
        recipient,
        subject,
        body,
        html_body=None,
        idempotency_key=None,
    ):
        called["value"] = True

        raise AssertionError(
            "Provider must not be called"
        )

    monkeypatch.setattr(
        email_worker,
        "SessionLocal",
        TestingSessionLocal,
    )

    monkeypatch.setattr(
        EmailSender,
        "send",
        fake_send,
    )

    email_worker.process_email_queue()

    assert called["value"] is False

    db = TestingSessionLocal()

    try:
        email = db.get(
            EmailQueue,
            email_id,
        )

        assert email is not None

        assert email.status == "failed"

        assert (
            email.provider_status
            == "failed"
        )

        assert (
            "suppression"
            in email.last_error.lower()
        )

    finally:
        db.close()