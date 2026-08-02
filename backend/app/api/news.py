from fastapi import APIRouter, Depends
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

    return await service.import_articles()