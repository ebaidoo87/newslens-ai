from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.reading_history import (
    ReadingHistoryResponse,
    ViewedArticleResponse,
)
from app.services.reading_history_service import (
    ReadingHistoryService,
)

router = APIRouter(
    prefix="/history",
    tags=["Reading History"],
)


@router.post(
    "/{article_id}",
    response_model=ReadingHistoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def record_article_view(
    article_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = ReadingHistoryService(db)

    try:
        return service.record_view(
            user_id=current_user.id,
            article_id=article_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.get(
    "",
    response_model=list[
        ViewedArticleResponse
    ],
)
def get_reading_history(
    limit: int = Query(
        default=50,
        ge=1,
        le=100,
    ),
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = ReadingHistoryService(db)

    return service.get_user_history(
        user_id=current_user.id,
        limit=limit,
    )


@router.delete(
    "",
    status_code=status.HTTP_204_NO_CONTENT,
)
def clear_reading_history(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = ReadingHistoryService(db)

    service.clear_user_history(
        user_id=current_user.id,
    )

