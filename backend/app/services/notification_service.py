from collections import defaultdict

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.article import Article
from app.models.notification import Notification
from app.models.user import User
from app.models.user_preference import UserPreference
from app.repositories.notification_repository import (
    NotificationRepository,
)
from app.services.email_queue_service import (
    EmailQueueService,
)


class NotificationService:

    def __init__(self, db: Session):
        self.db = db
        self.repository = NotificationRepository()

        self.email_queue_service = (EmailQueueService(db))

    @staticmethod
    def normalize(
        value: str | None,
    ) -> str:
        return (
            value
            or ""
        ).strip().lower()

    def get_preferences_by_user(
        self,
    ) -> dict[
        int,
        dict[str, set[str]],
    ]:
        rows = (
            self.db.query(UserPreference)
            .all()
        )

        preferences_by_user: dict[
            int,
            dict[str, set[str]],
        ] = defaultdict(
            lambda: {
                "category": set(),
                "country": set(),
                "keyword": set(),
                "alert": set(),
            }
        )

        for preference in rows:
            preference_type = self.normalize(
                preference.preference_type
            )

            preference_value = self.normalize(
                preference.preference_value
            )

            if (
                preference_type
                not in {
                    "category",
                    "country",
                    "keyword",
                    "alert",
                }
            ):
                continue

            if not preference_value:
                continue

            preferences_by_user[
                preference.user_id
            ][preference_type].add(
                preference_value
            )

        return dict(preferences_by_user)

    def get_match_reasons(
        self,
        article: Article,
        preferences: dict[
            str,
            set[str],
        ],
    ) -> list[str]:
        reasons: list[str] = []

        alert_settings = preferences[
            "alert"
        ]

        if (
            "notifications_enabled"
            not in alert_settings
        ):
            return reasons

        article_category = self.normalize(
            article.category
        )

        article_country = self.normalize(
            article.country
        )

        searchable_text = " ".join(
            [
                self.normalize(
                    article.title
                ),
                self.normalize(
                    article.summary
                ),
                self.normalize(
                    article.content
                ),
            ]
        )

        if (
            "category_alerts"
            in alert_settings
            and article_category
            in preferences["category"]
        ):
            reasons.append(
                f"Category: {article.category}"
            )

        if (
            "country_alerts"
            in alert_settings
            and article_country
            in preferences["country"]
        ):
            reasons.append(
                f"Country: {article.country}"
            )

        if (
            "keyword_alerts"
            in alert_settings
         ):
            for keyword in sorted(
                preferences["keyword"]
            ):
                if keyword in searchable_text:
                    reasons.append(
                        f"Topic: {keyword}"
                    )

        return reasons

    def create_article_notifications(
        self,
        article: Article,
    ) -> int:
        preferences_by_user = (
            self.get_preferences_by_user()
        )

        notifications: list[
            Notification
        ] = []

        for (
            user_id,
            preferences,
        ) in preferences_by_user.items():
            reasons = self.get_match_reasons(
                article,
                preferences,
            )

            if not reasons:
                continue

            existing = (
                self.repository
                .get_by_user_and_article(
                    self.db,
                    user_id,
                    article.id,
                )
            )

            if existing:
                continue

            reason_text = ", ".join(
                reasons[:3]
            )

            notifications.append(
                Notification(
                    user_id=user_id,
                    article_id=article.id,
                    notification_type=(
                        "preference_match"
                    ),
                    title=(
                        "New article matching "
                        "your interests"
                    ),
                    message=(
                        f"{article.title} — "
                        f"{reason_text}"
                    )[:500],
                    is_read=False,
                )
            )

        created_notifications = (
            self.repository.create_many(
                self.db,
                notifications,
            )
        )

        for created_notification in (
            created_notifications
        ):
            user = (
                self.db.query(User)
                .filter(
                    User.id
                    == created_notification.user_id
                )
                .first()
            )

            if not user:
                continue

            self.email_queue_service\
                .queue_notification_email(
                    notification=(
                        created_notification
                    ),
                    user=user,
                )

        return len(
            created_notifications
        )
    
    def get_notifications(
        self,
        user_id: int,
    ):
        return self.repository.get_all_by_user(
        self.db,
        user_id,
    )

    def get_unread_count(
        self,
        user_id: int,
    ):
        return self.repository.get_unread_count(
        self.db,
        user_id,
    )

    def mark_as_read(
        self,
        user_id: int,
        notification_id: int,
    ):
        notification = (
            self.repository.get_by_id(
                self.db,
                notification_id,
            )
        )

        if (
            not notification
            or notification.user_id != user_id
        ):
            raise HTTPException(
                status_code=404,
                detail="Notification not found",
            )

        return self.repository.mark_as_read(
            self.db,
            notification,
        )

    def mark_all_as_read(
        self,
        user_id: int,
    ):
        self.repository.mark_all_as_read(
            self.db,
            user_id,
        )

    def delete_notification(
        self,
        user_id: int,
        notification_id: int,
    ):
        notification = (
            self.repository.get_by_id(
                self.db,
                notification_id,
            )
        )

        if (
            not notification
            or notification.user_id != user_id
        ):
            raise HTTPException(
                status_code=404,
                detail="Notification not found",
            )

        self.repository.delete(
            self.db,
            notification,
        )

    def delete_all_notifications(
        self,
        user_id: int,
    ) -> int:
        return (
        self.repository.delete_all_by_user(
            self.db,
            user_id,
        )
    )


    def delete_read_notifications(
        self,
        user_id: int,
    ) -> int:
        return (
        self.repository.delete_read_by_user(
            self.db,
            user_id,
        )
    )