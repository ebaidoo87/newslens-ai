from fastapi import (
    APIRouter,
    Depends,
    Query,
)
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.discovery import (
    DiscoveredArticleResponse,
)
from app.services.discovery_service import (
    DiscoveryService,
)

router = APIRouter(
    prefix="/discover",
    tags=["Discovery"],
)


@router.get(
    "",
    response_model=list[
        DiscoveredArticleResponse
    ],
)
def get_discovery_articles(
    limit: int = Query(
        default=20,
        ge=1,
        le=50,
    ),
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = DiscoveryService(db)

    results = (
        service.get_discovery_articles(
            user_id=current_user.id,
            limit=limit,
        )
    )

    return [
        {
            "article": item.article,
            "discovery_score": (
                item.discovery_score
            ),
            "reasons": item.reasons,
        }
        for item in results
    ]