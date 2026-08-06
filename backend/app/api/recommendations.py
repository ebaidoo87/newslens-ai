from fastapi import (
    APIRouter,
    Depends,
    Query,
)
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.recommendation import (
    RecommendedArticleResponse,
)
from app.services.recommendation_service import (
    RecommendationService,
)


router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"],
)


@router.get(
    "",
    response_model=list[
        RecommendedArticleResponse
    ],
)
def get_recommendations(
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
    service = RecommendationService(db)

    recommendations = (
        service.get_recommendations(
            user_id=current_user.id,
            limit=limit,
        )
    )

    return [
        {
            "article": item.article,
            "score": item.score,
            "reasons": item.reasons,
        }
        for item in recommendations
    ]