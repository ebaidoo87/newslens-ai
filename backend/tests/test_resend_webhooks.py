def test_valid_resend_webhook(
    client,
    monkeypatch,
):
    event = {
        "type": "email.delivered",
        "data": {
            "email_id": "unknown-id",
        },
    }

    def fake_verify(
        *,
        payload,
        headers,
        secret,
    ):
        return event

    monkeypatch.setattr(
        "app.api.resend_webhooks."
        "resend.Webhooks.verify",
        fake_verify,
    )

    response = client.post(
        "/api/webhooks/resend",
        content=b"{}",
        headers={
            "Content-Type":
                "application/json",
        },
    )

    assert response.status_code == 200

    assert response.json() == {
        "received": True,
    }

def test_invalid_resend_webhook_signature(
    client,
    monkeypatch,
):
    def fake_verify(
        *,
        payload,
        headers,
        secret,
    ):
        raise ValueError(
            "Invalid signature"
        )

    monkeypatch.setattr(
        "app.api.resend_webhooks."
        "resend.Webhooks.verify",
        fake_verify,
    )

    response = client.post(
        "/api/webhooks/resend",
        content=b"{}",
    )

    assert response.status_code == 400


def test_webhook_falls_back_to_raw_json(
    client,
    monkeypatch,
):
    def fake_verify(
        *,
        payload,
        headers,
        secret,
    ):
        return object()

    monkeypatch.setattr(
        "app.api.resend_webhooks."
        "resend.Webhooks.verify",
        fake_verify,
    )

    response = client.post(
        "/api/webhooks/resend",
        content=(
            b'{"type":"email.sent",'
            b'"data":{"email_id":"unknown"}}'
        ),
    )

    assert response.status_code == 200


def test_webhook_requires_secret(
    client,
    monkeypatch,
):
    monkeypatch.setattr(
        "app.api.resend_webhooks."
        "settings.RESEND_WEBHOOK_SECRET",
        "",
    )

    response = client.post(
        "/api/webhooks/resend",
        content=b"{}",
    )

    assert response.status_code == 500