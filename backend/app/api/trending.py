from fastapi import (
    APIRouter,
    Depends,
    Query,
)
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.trending import (
    TrendingArticleResponse,
)
from app.services.trending_service import (
    TrendingService,
)

router = APIRouter(
    prefix="/trending",
    tags=["Trending"],
)


@router.get(
    "",
    response_model=list[
        TrendingArticleResponse
    ],
)
def get_trending_articles(
    country: str | None = Query(
        default=None,
        min_length=2,
        max_length=20,
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=50,
    ),
    db: Session = Depends(get_db),
):
    service = TrendingService(db)

    results = (
        service.get_trending_articles(
            country=country,
            limit=limit,
        )
    )

    return [
        {
            "article": item.article,
            "trending_score": (
                item.trending_score
            ),
            "bookmark_count": (
                item.bookmark_count
            ),
            "view_count": (
                item.view_count
            ),
            "reasons": item.reasons,
        }
        for item in results
    ]