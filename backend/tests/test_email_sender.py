from app.services.email_sender import (
    EmailSender,
)


def test_email_sender_success(
    monkeypatch,
):
    def fake_send(
        payload,
    ):
        return {
            "id": "msg_success_123"
        }

    monkeypatch.setattr(
        "app.services.email_sender."
        "resend.Emails.send",
        fake_send,
    )

    sender = EmailSender()

    result = sender.send(
        recipient="test@example.com",
        subject="Test subject",
        body="Test body",
        html_body="<p>Test</p>",
        idempotency_key="test/1",
    )

    assert result.success is True
    assert result.provider == "resend"
    assert (
        result.provider_message_id
        == "msg_success_123"
    )
    assert (
        result.provider_status
        == "accepted"
    )
    assert result.retryable is False
    assert result.error is None


def test_email_sender_retryable_failure(
    monkeypatch,
):
    class ProviderError(
        Exception
    ):
        status_code = 500
        code = "SERVER_ERROR"

    def fake_send(
        payload,
    ):
        raise ProviderError(
            "Provider unavailable"
        )

    monkeypatch.setattr(
        "app.services.email_sender."
        "resend.Emails.send",
        fake_send,
    )

    sender = EmailSender()

    result = sender.send(
        recipient="test@example.com",
        subject="Test",
        body="Body",
    )

    assert result.success is False
    assert result.retryable is True
    assert (
        result.provider_status
        == "failed"
    )
    assert (
        result.error
        == "Provider unavailable"
    )


def test_email_sender_non_retryable_failure(
    monkeypatch,
):
    class ProviderError(
        Exception
    ):
        status_code = 400
        code = "BAD_REQUEST"

    def fake_send(
        payload,
    ):
        raise ProviderError(
            "Invalid recipient"
        )

    monkeypatch.setattr(
        "app.services.email_sender."
        "resend.Emails.send",
        fake_send,
    )

    sender = EmailSender()

    result = sender.send(
        recipient="bad@example.com",
        subject="Test",
        body="Body",
    )

    assert result.success is False
    assert result.retryable is False
    assert (
        result.error
        == "Invalid recipient"
    )


def test_email_sender_rate_limit_is_retryable(
    monkeypatch,
):
    class ProviderError(
        Exception
    ):
        status_code = 429
        code = "RATE_LIMIT"

    def fake_send(
        payload,
    ):
        raise ProviderError(
            "Too many requests"
        )

    monkeypatch.setattr(
        "app.services.email_sender."
        "resend.Emails.send",
        fake_send,
    )

    sender = EmailSender()

    result = sender.send(
        recipient="test@example.com",
        subject="Test",
        body="Body",
    )

    assert result.success is False
    assert result.retryable is True


def test_email_sender_without_api_key(
    monkeypatch,
):
    monkeypatch.setattr(
        "app.services.email_sender."
        "settings.RESEND_API_KEY",
        "",
    )

    sender = EmailSender()

    result = sender.send(
        recipient="test@example.com",
        subject="Test",
        body="Body",
    )

    assert result.success is False

    assert (
        result.error
        == (
            "RESEND_API_KEY "
            "is not configured"
        )
    )

    assert result.retryable is False