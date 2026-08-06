from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.bookmark import (
    BookmarkedArticleResponse,
    BookmarkResponse,
    BookmarkStatusResponse,
)
from app.services.bookmark_service import (
    BookmarkService,
)


router = APIRouter(
    prefix="/bookmarks",
    tags=["Bookmarks"],
)


@router.post(
    "/{article_id}",
    response_model=BookmarkResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_bookmark(
    article_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = BookmarkService(db)

    try:
        return service.create_bookmark(
            user_id=current_user.id,
            article_id=article_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.delete(
    "/{article_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_bookmark(
    article_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = BookmarkService(db)

    try:
        service.remove_bookmark(
            user_id=current_user.id,
            article_id=article_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return None


@router.get(
    "",
    response_model=list[
        BookmarkedArticleResponse
    ],
)
def get_bookmarks(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = BookmarkService(db)

    return service.get_user_bookmarks(
        user_id=current_user.id,
    )


@router.get(
    "/check/{article_id}",
    response_model=BookmarkStatusResponse,
)
def check_bookmark(
    article_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = BookmarkService(db)

    is_bookmarked = (
        service.get_bookmark_status(
            user_id=current_user.id,
            article_id=article_id,
        )
    )

    return {
        "article_id": article_id,
        "is_bookmarked": is_bookmarked,
    }