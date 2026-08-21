from app.services.email_suppression_service import (
    EmailSuppressionService,
)
from tests.database import (
    TestingSessionLocal,
)


def test_email_can_be_suppressed():
    db = TestingSessionLocal()

    try:
        service = (
            EmailSuppressionService(
                db
            )
        )

        service.suppress(
            "blocked@example.com",
            reason="test",
        )

        assert (
            service.is_suppressed(
                "blocked@example.com"
            )
            is True
        )

    finally:
        db.close()