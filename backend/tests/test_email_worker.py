from app.jobs import email_worker
from app.models.email_queue import EmailQueue
from app.services.email_sender import EmailSender

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