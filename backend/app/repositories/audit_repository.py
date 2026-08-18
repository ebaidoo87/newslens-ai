from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


class AuditRepository:

    def create(
        self,
        db: Session,
        audit_log: AuditLog,
    ) -> AuditLog:
        db.add(audit_log)

        db.commit()

        db.refresh(audit_log)

        return audit_log


    def get_recent(
        self,
        db: Session,
        limit: int = 100,
    ) -> list[AuditLog]:
        return (
            db.query(AuditLog)
            .order_by(
                AuditLog.created_at.desc()
            )
            .limit(limit)
            .all()
        )


    def get_all(
        self,
        db: Session,
    ) -> list[AuditLog]:
        return (
            db.query(AuditLog)
            .order_by(
                AuditLog.created_at.desc()
            )
            .all()
        )