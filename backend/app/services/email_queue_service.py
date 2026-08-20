from html import escape

from sqlalchemy.orm import Session

from app.models.email_queue import EmailQueue
from app.models.notification import Notification
from app.models.user import User
from app.repositories.email_queue_repository import (
    EmailQueueRepository,
)
from app.services.email_suppression_service import (
    EmailSuppressionService,
)


class EmailQueueService:

    def __init__(self, db: Session):
        self.db = db

        self.repository = (
            EmailQueueRepository()
        )

        self.suppression_service = (
        EmailSuppressionService(db)
        )


    def should_queue_email(
        self,
        user_id: int,
    ) -> bool:
        from app.models.user_preference import (
            UserPreference,
        )

        preferences = (
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

        values = {
            preference.preference_value
            for preference
            in preferences
        }

        return (
            "email_enabled" in values
            and "email_instant" in values
        )


    def build_subject(
        self,
        notification: Notification,
    ) -> str:
        return (
            f"NewsLens Alert: "
            f"{notification.title}"
        )[:255]


    def build_body(
        self,
        notification: Notification,
    ) -> str:
        article = notification.article

        article_title = (
            article.title
            if article
            else "New article"
        )

        article_url = (
            article.url
            if article
            else ""
        )

        return (
            "NewsLens AI\n\n"
            f"{notification.message}\n\n"
            f"Article: {article_title}\n"
            f"Source: "
            f"{article.source if article else 'Unknown'}\n"
            f"Category: "
            f"{article.category if article else 'Unknown'}\n"
            f"Read more: {article_url}\n\n"
            "You received this email because "
            "this article matched your saved "
            "NewsLens preferences."
        )


    def queue_notification_email(
        self,
        notification: Notification,
        user: User,
    ) -> EmailQueue | None:
        if not self.should_queue_email(
            user.id
        ):
            return None

        if self.suppression_service.is_suppressed(
            user.email
        ):
            return None

        existing = (
            self.repository
            .get_by_notification_id(
                self.db,
                notification.id,
            )
        )

        if existing:
            return existing

        email = EmailQueue(
            user_id=user.id,
            notification_id=(
                notification.id
            ),
            recipient=user.email,
            subject=self.build_subject(
                notification
            ),
            body=self.build_body(
                notification
            ),
            status="pending",
            retry_count=0,
        )

        return self.repository.create(
            self.db,
            email,
        )

    def build_html_body(
        self,
        notification: Notification,
    ) -> str:
        article = notification.article

        title = escape(
            article.title
            if article
            else notification.title
        )

        source = escape(
            article.source
            if article
            else "Unknown source"
        )

        url = escape(
            article.url
            if article
            else "#",
            quote=True,
        )

        return f"""
        <html>
        <body style="
            margin:0;
            padding:32px;
            background:#030712;
            font-family:Arial,sans-serif;
        ">
            <div style="
            max-width:600px;
            margin:auto;
            background:#111827;
            padding:28px;
            border-radius:14px;
            color:#ffffff;
            ">
            <h1 style="
                color:#60a5fa;
                margin-top:0;
            ">
                NewsLens AI
            </h1>

            <h2>
                {title}
            </h2>

            <p style="
                color:#9ca3af;
            ">
                Source: {source}
            </p>

            <p style="
                color:#d1d5db;
                line-height:1.6;
            ">
                {escape(notification.message)}
            </p>

            <a
                href="{url}"
                style="
                display:inline-block;
                margin-top:16px;
                padding:12px 18px;
                background:#2563eb;
                color:#ffffff;
                text-decoration:none;
                border-radius:8px;
                font-weight:600;
                "
            >
                Read article →
            </a>
            </div>
        </body>
        </html>
        """