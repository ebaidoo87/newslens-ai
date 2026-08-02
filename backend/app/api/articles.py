from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.article_service import ArticleService


router = APIRouter(
    prefix="/articles",
    tags=["Articles"],
)


@router.get("")
def get_articles(
    search: str = "",
    category: str = "",
    db: Session = Depends(get_db),
):

    article_service = ArticleService(db)

    return article_service.get_articles(
        search=search,
        category=category,
    )


@router.get("/{article_id}")
def get_article_by_id(
    article_id: int,
    db: Session = Depends(get_db),
):
    article_service = ArticleService(db)

    article = article_service.get_article_by_id(
        article_id=article_id,
    )

    if not article:
        raise HTTPException(
            status_code=404,
            detail="Article not found",
        )

    if not article:
        raise HTTPException(
            status_code=404,
            detail="Article not found",
        )

    return article