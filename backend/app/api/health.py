from fastapi import (
    APIRouter,
    Depends,
)
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.health_service import (
    HealthService,
)

from app.core.config import settings


router = APIRouter(
    prefix="/health",
    tags=["Health"],
)


@router.get("/live")
def liveness():
    return {
        "status": "alive",
        "application": settings.app_name,
        "version": settings.app_version,
    }


@router.get("/ready")
def readiness(
    db: Session = Depends(get_db),
):
    service = (
        HealthService(db)
    )

    if service.readiness():
        return {
            "status": "ready"
        }

    return JSONResponse(
        status_code=503,
        content={
            "status": "not_ready"
        },
    )


@router.get("/details")
def details(
    db: Session = Depends(get_db),
):
    service = (
        HealthService(db)
    )

    data = service.details()

    status = (
        200
        if data["status"]
        == "healthy"
        else 503
    )

    return JSONResponse(
        status_code=status,
        content=data,
    )