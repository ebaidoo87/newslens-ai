from fastapi import (
    APIRouter,
    Depends,
    Query,
)
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.dependencies.roles import (
    require_admin,
)
from app.db.session import get_db
from app.models.article import Article
from app.models.notification import Notification
from app.models.user import User
from app.services.email_monitoring_service import (
    EmailMonitoringService,
)


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[
        Depends(require_admin)
    ],
)


@router.get(
    "/dashboard",
)
def get_admin_dashboard(
    db: Session = Depends(get_db),
):
    user_count = (
        db.query(User)
        .count()
    )

    article_count = (
        db.query(Article)
        .count()
    )

    notification_count = (
        db.query(Notification)
        .count()
    )

    email_service = (
        EmailMonitoringService(db)
    )

    return {
        "users": user_count,
        "articles": article_count,
        "notifications": (
            notification_count
        ),
        "email": (
            email_service.get_stats()
        ),
    }


@router.get(
    "/email/stats",
)
def get_admin_email_stats(
    db: Session = Depends(get_db),
):
    service = (
        EmailMonitoringService(db)
    )

    return service.get_stats()


@router.get(
    "/email/recent",
)
def get_admin_recent_emails(
    limit: int = Query(
        default=25,
        ge=1,
        le=100,
    ),
    db: Session = Depends(get_db),
):
    service = (
        EmailMonitoringService(db)
    )

    return service.get_recent_emails(
        limit
    )


@router.get(
    "/system/health",
)
def get_system_health(
    db: Session = Depends(get_db),
):
    database_ok = False

    try:
        db.execute(
            text("SELECT 1")
        )

        database_ok = True

    except Exception:
        database_ok = False

    return {
        "status": (
            "healthy"
            if database_ok
            else "degraded"
        ),
        "database": (
            "connected"
            if database_ok
            else "unavailable"
        ),
    }


@router.get(
    "/users/stats",
)
def get_user_stats(
    db: Session = Depends(get_db),
):
    total_users = (
        db.query(User)
        .count()
    )

    admin_users = (
        db.query(User)
        .filter(
            User.role == "admin"
        )
        .count()
    )

    normal_users = (
        db.query(User)
        .filter(
            User.role == "user"
        )
        .count()
    )

    return {
        "total": total_users,
        "admins": admin_users,
        "users": normal_users,
    }