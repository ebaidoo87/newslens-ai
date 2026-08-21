from app.services.digest_service import (
    DigestService,
)

from tests.database import (
    TestingSessionLocal,
)

from tests.helpers.auth import (
    create_authenticated_user,
)

from app.services.email_suppression_service import (
    EmailSuppressionService,
)



def test_digest_returns_no_users_without_preferences(
    client,
):
    create_authenticated_user(
        client
    )

    db = TestingSessionLocal()

    try:
        service = DigestService(
            db
        )

        users = (
            service.get_digest_users(
                "daily_digest"
            )
        )

        assert users == []

    finally:
        db.close()


def test_suppressed_user_excluded_from_digest(
    client,
):
    auth = create_authenticated_user(
        client
    )

    db = TestingSessionLocal()

    try:
        suppression = (
            EmailSuppressionService(
                db
            )
        )

        suppression.suppress(
            auth["user"]["email"],
            reason="test",
        )

        service = DigestService(
            db
        )

        users = (
            service.get_digest_users(
                "daily_digest"
            )
        )

        assert all(
            user.email
            != auth["user"]["email"]
            for user in users
        )

    finally:
        db.close()