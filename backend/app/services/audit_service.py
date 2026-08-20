from datetime import datetime

from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog
from app.models.user import User
from app.repositories.audit_repository import (
    AuditRepository,
)


class AuditService:

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

        self.repository = (
            AuditRepository()
        )


    def log(
        self,
        *,
        admin: User,
        action: str,
        target: User | None = None,
        details: str | None = None,
    ) -> AuditLog:

        audit = AuditLog(
            admin_user_id=admin.id,
            target_user_id=(
                target.id
                if target
                else None
            ),
            action=action,
            details=details,
        )

        return self.repository.create(
            self.db,
            audit,
        )


    def recent(
        self,
        limit: int = 100,
    ) -> list[AuditLog]:
        return (
            self.repository.get_recent(
                self.db,
                limit,
            )
        )


    def all(
        self,
    ) -> list[AuditLog]:
        return (
            self.repository.get_all(
                self.db,
            )
        )

    def total_logs(
        self,
    ) -> int:
        return (
            self.repository.count(
                self.db,
            )
        )

    def paginated(
        self,
        skip: int = 0,
        limit: int = 50,
        action: str | None = None,
        admin_user_id: int | None = None,
        target_user_id: int | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
        search: str | None = None,
    ):
        items = (
            self.repository
            .get_paginated(
                self.db,
                skip=skip,
                limit=limit,
                action=action,
                admin_user_id=(
                    admin_user_id
                ),
                target_user_id=(
                    target_user_id
                ),
                date_from=date_from,
                date_to=date_to,
                search=search,
            )
        )

        total = (
            self.repository
            .count_filtered(
                self.db,
                action=action,
                admin_user_id=(
                    admin_user_id
                ),
                target_user_id=(
                    target_user_id
                ),
                date_from=date_from,
                date_to=date_to,
                search=search,
            )
        )

        return {
            "items": items,
            "total": total,
            "skip": skip,
            "limit": limit,
        }