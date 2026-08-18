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
    response_model=list[
        AuditLogResponse
    ],
)
def all_logs(
    skip: int = 0,
    limit: int = 50,
    current_admin: User = Depends(
        require_admin
    ),
    db: Session = Depends(get_db),
):
    service = AuditService(db)

    return service.paginated(
        skip,
        limit,
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