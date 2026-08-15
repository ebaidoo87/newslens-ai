from sqlalchemy.orm import Session

from app.repositories.email_monitoring_repository import (
    EmailMonitoringRepository,
)


class EmailMonitoringService:

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

        self.repository = (
            EmailMonitoringRepository()
        )

    def get_stats(
        self,
    ) -> dict:
        statuses = (
            self.repository
            .count_by_status(
                self.db
            )
        )

        provider_statuses = (
            self.repository
            .count_by_provider_status(
                self.db
            )
        )

        total = sum(
            statuses.values()
        )

        return {
            "total": total,

            "pending":
                statuses.get(
                    "pending",
                    0,
                ),

            "processing":
                statuses.get(
                    "processing",
                    0,
                ),

            "sent":
                statuses.get(
                    "sent",
                    0,
                ),

            "failed":
                statuses.get(
                    "failed",
                    0,
                ),

            "accepted":
                provider_statuses.get(
                    "accepted",
                    0,
                ),

            "delivered":
                provider_statuses.get(
                    "delivered",
                    0,
                ),

            "bounced":
                provider_statuses.get(
                    "bounced",
                    0,
                ),

            "complained":
                provider_statuses.get(
                    "complained",
                    0,
                ),

            "delivery_delayed":
                provider_statuses.get(
                    "delivery_delayed",
                    0,
                ),

            "retrying":
                self.repository
                .count_retrying(
                    self.db
                ),

            "suppressed":
                self.repository
                .count_suppressed(
                    self.db
                ),
        }

    def get_recent_emails(
        self,
        limit: int = 25,
    ):
        return (
            self.repository
            .get_recent_emails(
                self.db,
                limit,
            )
        )