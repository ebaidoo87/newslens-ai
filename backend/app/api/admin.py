from fastapi import (
    APIRouter,
    Depends,
    Query,
    Request,
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

from app.schemas.admin import (
    AdminUserResponse,
)

from app.services.admin_user_service import (
    AdminUserService,
)

from app.schemas.admin import (
    AdminUserResponse,
    AdminUserRoleUpdate,
)

from app.schemas.admin import (
    AdminUserResponse,
    AdminUserRoleUpdate,
    AdminUserStatusUpdate,
)

from app.schemas.admin import (
    AdminPasswordReset,
    AdminUserResponse,
    AdminUserRoleUpdate,
    AdminUserStatusUpdate,
)

from app.services.admin_analytics_service import (
    AdminAnalyticsService,
)

from app.core.rate_limit import (
    limiter,
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

@router.get(
    "/users",
    response_model=list[
        AdminUserResponse
    ],
)
def get_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    service = AdminUserService(
        db,
    )

    return service.get_users()

@router.patch(
    "/users/{user_id}/role",
    response_model=AdminUserResponse,
)
def update_user_role(
    user_id: int,
    payload: AdminUserRoleUpdate,
    current_admin: User = Depends(
        require_admin
    ),
    db: Session = Depends(get_db),
):
    service = AdminUserService(
        db
    )

    return service.update_role(
        user_id=user_id,
        new_role=payload.role,
        current_admin=(
            current_admin
        ),
    )

@router.patch(
    "/users/{user_id}/status",
    response_model=AdminUserResponse,
)
def update_user_status(
    user_id: int,
    payload: AdminUserStatusUpdate,
    current_admin: User = Depends(
        require_admin,
    ),
    db: Session = Depends(get_db),
):
    service = AdminUserService(
        db,
    )

    return service.update_active_status(
        user_id=user_id,
        active=payload.is_active,
        current_admin=current_admin,
    )



@router.delete(
    "/users/{user_id}",
)
def delete_user(
    user_id: int,
    current_admin: User = Depends(
        require_admin
    ),
    db: Session = Depends(get_db),
):
    service = AdminUserService(
        db
    )

    service.delete_user(
        user_id=user_id,
        current_admin=(
            current_admin
        ),
    )

    return {
        "success": True,
        "message": (
            "User account deleted."
        ),
    }

@router.patch(
    "/users/{user_id}/password",
)
@limiter.limit("5/minute")
def reset_user_password(
    request: Request,
    user_id: int,
    payload: AdminPasswordReset,
    current_admin: User = Depends(
        require_admin
    ),
    db: Session = Depends(
        get_db
    ),
):
    service = AdminUserService(
        db
    )

    service.reset_password(
        user_id=user_id,
        new_password=(
            payload.new_password
        ),
        confirm_new_password=(
            payload.confirm_new_password
        ),
        current_admin=current_admin,
    )

    return {
        "success": True,
        "message": (
            "Password reset successfully."
        ),
    }

@router.get(
    "/analytics/summary",
)
def get_admin_analytics_summary(
    db: Session = Depends(get_db),
):
    service = (
        AdminAnalyticsService(db)
    )

    return service.get_summary()