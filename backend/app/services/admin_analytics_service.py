from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.article import Article
from app.models.audit_log import AuditLog
from app.models.email_queue import EmailQueue
from app.models.user import User


class AdminAnalyticsService:

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def get_summary(self):
        now = datetime.utcnow()

        last_7_days = (
            now - timedelta(days=7)
        )

        last_30_days = (
            now - timedelta(days=30)
        )

        total_users = (
            self.db.query(User)
            .count()
        )

        active_users = (
            self.db.query(User)
            .filter(
                User.is_active.is_(True)
            )
            .count()
        )

        suspended_users = (
            self.db.query(User)
            .filter(
                User.is_active.is_(False)
            )
            .count()
        )

        admin_users = (
            self.db.query(User)
            .filter(
                User.role == "admin"
            )
            .count()
        )

        normal_users = (
            self.db.query(User)
            .filter(
                User.role == "user"
            )
            .count()
        )

        new_users_7d = (
            self.db.query(User)
            .filter(
                User.created_at
                >= last_7_days
            )
            .count()
        )

        new_users_30d = (
            self.db.query(User)
            .filter(
                User.created_at
                >= last_30_days
            )
            .count()
        )

        total_articles = (
            self.db.query(Article)
            .count()
        )

        new_articles_7d = (
            self.db.query(Article)
            .filter(
                Article.created_at
                >= last_7_days
            )
            .count()
        )

        total_emails = (
            self.db.query(EmailQueue)
            .count()
        )

        delivered_emails = (
            self.db.query(EmailQueue)
            .filter(
                EmailQueue.provider_status
                == "delivered"
            )
            .count()
        )

        failed_emails = (
            self.db.query(EmailQueue)
            .filter(
                EmailQueue.status
                == "failed"
            )
            .count()
        )

        audit_events_7d = (
            self.db.query(AuditLog)
            .filter(
                AuditLog.created_at
                >= last_7_days
            )
            .count()
        )

        return {
            "users": {
                "total": total_users,
                "active": active_users,
                "suspended": suspended_users,
                "admins": admin_users,
                "regular": normal_users,
                "new_7d": new_users_7d,
                "new_30d": new_users_30d,
            },

            "articles": {
                "total": total_articles,
                "new_7d": new_articles_7d,
            },

            "emails": {
                "total": total_emails,
                "delivered": delivered_emails,
                "failed": failed_emails,
            },

            "audit": {
                "events_7d": audit_events_7d,
            },
        }