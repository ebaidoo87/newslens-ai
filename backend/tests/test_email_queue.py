from app.models.notification import Notification
from app.services.email_queue_service import (
    EmailQueueService,
)

from tests.database import (
    TestingSessionLocal,
)
from tests.helpers.articles import (
    create_article,
)
from tests.helpers.auth import (
    create_authenticated_user,
)

from app.models.email_queue import (
    EmailQueue,
)

from app.models.user import User

from app.models.email_queue import EmailQueue
from app.models.notification import Notification
from app.models.user import User
from app.models.user_preference import (
    UserPreference,
)

from app.services.email_queue_service import (
    EmailQueueService,
)

from tests.database import (
    TestingSessionLocal,
)
from tests.helpers.articles import (
    create_article,
)
from tests.helpers.auth import (
    create_authenticated_user,
)


def enable_instant_email(
    db,
    user_id: int,
) -> None:
    db.add_all(
        [
            UserPreference(
                user_id=user_id,
                preference_type="email_alert",
                preference_value="email_enabled",
            ),
            UserPreference(
                user_id=user_id,
                preference_type="email_alert",
                preference_value="email_instant",
            ),
        ]
    )

    db.commit()


def test_queue_notification_email(
    client,
):
    auth = create_authenticated_user(
        client
    )

    article = create_article(
        url=(
            "https://example.com/"
            "email-queue"
        ),
    )

    db = TestingSessionLocal()

    try:
        user = db.get(
            User,
            auth["user"]["id"],
        )

        assert user is not None

        enable_instant_email(
            db,
            user.id,
        )

        notification = Notification(
            user_id=user.id,
            article_id=article.id,
            notification_type=(
                "preference_match"
            ),
            title="Test notification",
            message="Test message",
            is_read=False,
        )

        db.add(notification)
        db.commit()
        db.refresh(notification)

        service = EmailQueueService(
            db
        )

        email = (
            service
            .queue_notification_email(
                notification=notification,
                user=user,
            )
        )

        assert email is not None
        assert email.status == "pending"
        assert email.recipient == (
            user.email
        )

    finally:
        db.close()


def test_queued_email_is_saved(
    client,
):
    auth = create_authenticated_user(
        client
    )

    article = create_article(
        url=(
            "https://example.com/"
            "saved-email"
        ),
    )

    db = TestingSessionLocal()

    try:
        user = db.get(
            User,
            auth["user"]["id"],
        )

        assert user is not None

        enable_instant_email(
            db,
            user.id,
        )

        notification = Notification(
            user_id=user.id,
            article_id=article.id,
            notification_type=(
                "preference_match"
            ),
            title="Saved email test",
            message=(
                "Testing queue persistence"
            ),
            is_read=False,
        )

        db.add(notification)
        db.commit()
        db.refresh(notification)

        service = EmailQueueService(
            db
        )

        service.queue_notification_email(
            notification=notification,
            user=user,
        )

        queued = (
            db.query(EmailQueue)
            .all()
        )

        assert len(queued) == 1

        assert (
            queued[0].status
            == "pending"
        )

    finally:
        db.close()