from app.models.notification import Notification
from app.models.user_preference import (
    UserPreference,
)
from app.services.notification_service import (
    NotificationService,
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


def test_article_with_no_preferences_creates_no_notifications(
    client,
):
    create_authenticated_user(
        client
    )

    article = create_article(
        title="Technology News",
        category="technology",
        url=(
            "https://example.com/"
            "no-preferences"
        ),
    )

    db = TestingSessionLocal()

    try:
        service = NotificationService(
            db
        )

        created = (
            service
            .create_article_notifications(
                article
            )
        )

        assert created == 0

        notifications = (
            db.query(Notification)
            .all()
        )

        assert notifications == []

    finally:
        db.close()


def test_matching_preference_creates_notification(
    client,
):
    auth = create_authenticated_user(
        client
    )

    article = create_article(
        title=(
            "Artificial Intelligence "
            "Changes Journalism"
        ),
        category="technology",
        url=(
            "https://example.com/"
            "notification-match"
        ),
    )

    db = TestingSessionLocal()

    try:
        db.add_all(
            [
                UserPreference(
                    user_id=auth["user"]["id"],
                    preference_type="category",
                    preference_value="technology",
                ),
                UserPreference(
                    user_id=auth["user"]["id"],
                    preference_type="alert",
                    preference_value=(
                        "notifications_enabled"
                    ),
                ),
                UserPreference(
                    user_id=auth["user"]["id"],
                    preference_type="alert",
                    preference_value=(
                        "category_alerts"
                    ),
                ),
            ]
        )

        db.commit()

        service = NotificationService(
            db
        )

        created = (
            service
            .create_article_notifications(
                article
            )
        )

        assert created == 1

        notification = (
            db.query(Notification)
            .filter(
                Notification.user_id
                == auth["user"]["id"]
            )
            .first()
        )

        assert notification is not None

        assert (
            notification.article_id
            == article.id
        )

        assert (
            notification.notification_type
            == "preference_match"
        )

        assert (
            notification.is_read
            is False
        )

    finally:
        db.close()


def test_duplicate_article_notification_not_created(
    client,
):
    auth = create_authenticated_user(
        client
    )

    article = create_article(
        title="Duplicate Story",
        category="technology",
        url=(
            "https://example.com/"
            "duplicate-notification"
        ),
    )

    db = TestingSessionLocal()

    try:
        db.add_all(
            [
                UserPreference(
                    user_id=auth["user"]["id"],
                    preference_type="category",
                    preference_value="technology",
                ),
                UserPreference(
                    user_id=auth["user"]["id"],
                    preference_type="alert",
                    preference_value=(
                        "notifications_enabled"
                    ),
                ),
                UserPreference(
                    user_id=auth["user"]["id"],
                    preference_type="alert",
                    preference_value=(
                        "category_alerts"
                    ),
                ),
            ]
        )

        db.commit()

        service = NotificationService(
            db
        )

        first = (
            service
            .create_article_notifications(
                article
            )
        )

        second = (
            service
            .create_article_notifications(
                article
            )
        )

        assert first == 1
        assert second == 0

        count = (
            db.query(Notification)
            .filter(
                Notification.user_id
                == auth["user"]["id"],
                Notification.article_id
                == article.id,
            )
            .count()
        )

        assert count == 1

    finally:
        db.close()