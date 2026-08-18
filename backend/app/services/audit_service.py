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