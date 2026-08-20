from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy.orm import Session

from app.data.category_queries import (
    ALLOWED_CATEGORIES,
)
from app.db.session import get_db
from app.services.import_service import (
    ImportService,
)

router = APIRouter(
    prefix="/news",
    tags=["News"],
)


@router.post("/import")
async def import_news(
    category: str = Query(
        default="general",
    ),
    db: Session = Depends(get_db),
):
    normalized_category = (
        category.strip().lower()
    )

    if (
        normalized_category
        not in ALLOWED_CATEGORIES
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Unsupported news category"
            ),
        )

    service = ImportService(db)

    try:
        return await service.import_articles(
            category=normalized_category,
        )

    except RuntimeError as error:
        raise HTTPException(
            status_code=(
                status.HTTP_429_TOO_MANY_REQUESTS
            ),
            detail=str(error),
        ) from error