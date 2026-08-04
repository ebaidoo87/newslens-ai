from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.import_service import ImportService


router = APIRouter(
    prefix="/news",
    tags=["News"],
)


@router.post("/import")
async def import_news(
    db: Session = Depends(get_db),
):
    service = ImportService(db)

    try:
        return await service.import_articles()

    except RuntimeError as error:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=str(error),
        ) from error