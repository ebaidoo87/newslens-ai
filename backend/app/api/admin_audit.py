from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.api.dependencies.roles import (
    require_admin,
)
from app.db.session import get_db

from app.models.user import User

from app.schemas.audit_log import (
    AuditLogResponse,
)

from app.services.audit_service import (
    AuditService,
)

from datetime import datetime

from fastapi import (
    APIRouter,
    Depends,
    Query,
)

from app.schemas.audit_log import (
    AuditLogListResponse,
    AuditLogResponse,
)

router = APIRouter(
    prefix="/admin/audit",
    tags=["Admin Audit"],
)

@router.get(
    "/recent",
    response_model=list[
        AuditLogResponse
    ],
)
def recent_logs(
    limit: int = 50,
    current_admin: User = Depends(
        require_admin
    ),
    db: Session = Depends(get_db),
):
    service = AuditService(db)

    return service.recent(
        limit
    )

@router.get(
    "",
    response_model=(
        AuditLogListResponse
    ),
)
def all_logs(
    skip: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=25,
        ge=1,
        le=100,
    ),
    action: str | None = None,
    admin_user_id: int | None = None,
    target_user_id: int | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    search: str | None = None,
    current_admin: User = Depends(
        require_admin
    ),
    db: Session = Depends(get_db),
):
    service = AuditService(
        db
    )

    return service.paginated(
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

@router.get(
    "/stats",
)
def audit_stats(
    current_admin: User = Depends(
        require_admin
    ),
    db: Session = Depends(get_db),
):
    service = AuditService(
        db
    )

    return {
        "total": service.total_logs(),
    }