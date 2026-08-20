from datetime import (
    datetime,
    timedelta,
    timezone,
)

from sqlalchemy.orm import Session

from app.models.email_queue import EmailQueue
from app.models.user import User
from app.models.user_preference import (
    UserPreference,
)
from app.repositories.digest_repository import (
    DigestRepository,
)
from app.repositories.email_queue_repository import (
    EmailQueueRepository,
)
from app.services.email_suppression_service import (
    EmailSuppressionService,
)
from app.services.email_template_service import (
    EmailTemplateService,
)


class DigestService:

    def __init__(
        self,
        db: Session,
    ):
        self.db = db
        self.digest_repository = (
            DigestRepository()
        )
        self.email_repository = (
            EmailQueueRepository()
        )
        self.template_service = (
            EmailTemplateService()
        )
        self.suppression_service = (
        EmailSuppressionService(db)
        )

    def get_email_preferences(
        self,
        user_id: int,
    ) -> set[str]:
        rows = (
            self.db.query(
                UserPreference
            )
            .filter(
                UserPreference.user_id
                == user_id,
                UserPreference.preference_type
                == "email_alert",
            )
            .all()
        )

        return {
            row.preference_value
            for row in rows
        }

    def get_digest_users(
        self,
        digest_type: str,
    ) -> list[User]:
        users = (
            self.db.query(User)
            .all()
        )

        result: list[User] = []

        required_setting = (
            "email_daily_digest"
            if digest_type
            == "daily_digest"
            else "email_weekly_digest"
        )

        for user in users:

            if (
                self.suppression_service
                .is_suppressed(
                    user.email
                )
            ):
                continue

            preferences = (
                self.get_email_preferences(
                    user.id
                )
            )

            if (
                "email_enabled"
                in preferences
                and required_setting
                in preferences
            ):
                result.append(
                    user
                )

        return result

    @staticmethod
    def build_digest_body(
        notifications,
        digest_type: str,
    ) -> str:
        label = (
            "Daily"
            if digest_type
            == "daily_digest"
            else "Weekly"
        )

        lines = [
            "NewsLens AI",
            "",
            f"{label} News Digest",
            "",
            (
                f"You have "
                f"{len(notifications)} "
                f"new matching stories."
            ),
            "",
        ]

        for index, notification in enumerate(
            notifications,
            start=1,
        ):
            article = (
                notification.article
            )

            lines.extend(
                [
                    (
                        f"{index}. "
                        f"{article.title}"
                    ),
                    (
                        f"Source: "
                        f"{article.source}"
                    ),
                    (
                        f"Category: "
                        f"{article.category}"
                    ),
                    (
                        f"Read: "
                        f"{article.url}"
                    ),
                    "",
                ]
            )

        lines.extend(
            [
                (
                    "You received this digest "
                    "because these stories "
                    "matched your NewsLens "
                    "preferences."
                ),
            ]
        )

        return "\n".join(lines)

    def queue_user_digest(
        self,
        user: User,
        digest_type: str,
    ) -> EmailQueue | None:
        now = datetime.now(
            timezone.utc
        )


        if digest_type == "daily_digest":
            since = now - timedelta(
                days=1
            )
            subject = (
                "Your NewsLens Daily Digest"
            )

        elif digest_type == "weekly_digest":
            since = now - timedelta(
                days=7
            )
            subject = (
                "Your NewsLens Weekly Digest"
            )

        else:
            raise ValueError(
                "Invalid digest type"
            )

        notifications = (
            self.digest_repository
            .get_undelivered_notifications(
                self.db,
                user.id,
                since,
            )
        )

        plain_body = (
            self.template_service
            .build_digest_text(
                notifications,
                digest_type,
            )
        )
        
        html_body = (
            self.template_service
            .build_digest_html(
                notifications,
                digest_type,
            )
        )

        if not notifications:
            return None

        

        email = EmailQueue(
            user_id=user.id,
            notification_id=None,
            recipient=user.email,
            subject=subject,
            body=plain_body,
            html_body=html_body,
            email_type=digest_type,
            status="pending",
            retry_count=0,
        )

        created_email = (
            self.email_repository.create(
                self.db,
                email,
            )
        )

        self.digest_repository\
            .mark_notifications_in_digest(
                self.db,
                user_id=user.id,
                email_queue_id=(
                    created_email.id
                ),
                notification_ids=[
                    notification.id
                    for notification
                    in notifications
                ],
            )

        return created_email

    def queue_digests(
        self,
        digest_type: str,
    ) -> int:
        users = self.get_digest_users(
            digest_type
        )

        queued = 0

        for user in users:
            result = (
                self.queue_user_digest(
                    user,
                    digest_type,
                )
            )

            if result:
                queued += 1

        return queued