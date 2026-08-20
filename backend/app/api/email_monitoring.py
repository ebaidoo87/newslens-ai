from fastapi import (
    APIRouter,
    Depends,
    Query,
)
from sqlalchemy.orm import Session

from app.api.dependencies.roles import (
    require_admin,
)
from app.db.session import get_db
from app.models.user import User
from app.schemas.email_monitoring import (
    EmailStatsResponse,
    RecentEmailResponse,
)
from app.services.email_monitoring_service import (
    EmailMonitoringService,
)

router = APIRouter(
    prefix="/email-monitoring",
    tags=["Email Monitoring"],
)


@router.get(
    "/stats",
    response_model=EmailStatsResponse,
)
def get_email_stats(
    current_user: User = Depends(
        require_admin
    ),
    db: Session = Depends(get_db),
):
    service = (
        EmailMonitoringService(db)
    )

    return service.get_stats()


@router.get(
    "/recent",
    response_model=list[
        RecentEmailResponse
    ],
)
def get_recent_emails(
    limit: int = Query(
        default=25,
        ge=1,
        le=100,
    ),
    current_user: User = Depends(
        require_admin
    ),
    db: Session = Depends(get_db),
):
    service = (
        EmailMonitoringService(db)
    )

    return service.get_recent_emails(
        limit
    )