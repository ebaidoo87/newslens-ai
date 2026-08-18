from datetime import datetime

from sqlalchemy import or_
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

    def count(
        self,
        db: Session,
    ) -> int:
        return (
            db.query(AuditLog)
            .count()
        )

    def get_paginated(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 50,
        action: str | None = None,
        admin_user_id: int | None = None,
        target_user_id: int | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
        search: str | None = None,
    ) -> list[AuditLog]:

        query = db.query(
            AuditLog
        )

        if action:
            query = query.filter(
                AuditLog.action == action
            )

        if admin_user_id is not None:
            query = query.filter(
                AuditLog.admin_user_id
                == admin_user_id
            )

        if target_user_id is not None:
            query = query.filter(
                AuditLog.target_user_id
                == target_user_id
            )

        if date_from:
            query = query.filter(
                AuditLog.created_at
                >= date_from
            )

        if date_to:
            query = query.filter(
                AuditLog.created_at
                <= date_to
            )

        if search:
            normalized = (
                f"%{search.strip()}%"
            )

            query = query.filter(
                or_(
                    AuditLog.action.ilike(
                        normalized
                    ),
                    AuditLog.details.ilike(
                        normalized
                    ),
                )
            )

        return (
            query
            .order_by(
                AuditLog.created_at.desc()
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count_filtered(
        self,
        db: Session,
        action: str | None = None,
        admin_user_id: int | None = None,
        target_user_id: int | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
        search: str | None = None,
    ) -> int:

        query = db.query(
            AuditLog
        )

        if action:
            query = query.filter(
                AuditLog.action == action
            )

        if admin_user_id is not None:
            query = query.filter(
                AuditLog.admin_user_id
                == admin_user_id
            )

        if target_user_id is not None:
            query = query.filter(
                AuditLog.target_user_id
                == target_user_id
            )

        if date_from:
            query = query.filter(
                AuditLog.created_at
                >= date_from
            )

        if date_to:
            query = query.filter(
                AuditLog.created_at
                <= date_to
            )

        if search:
            normalized = (
                f"%{search.strip()}%"
            )

            query = query.filter(
                or_(
                    AuditLog.action.ilike(
                        normalized
                    ),
                    AuditLog.details.ilike(
                        normalized
                    ),
                )
            )

        return query.count()