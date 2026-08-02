from typing import Optional

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.article import Article


class ArticleRepository:

    def get_articles(
        self,
        db: Session,
        search: Optional[str] = None,
        category: Optional[str] = None,
    ):
        query = db.query(Article)

        if search:
            query = query.filter(
                or_(
                    Article.title.ilike(f"%{search}%"),
                    Article.summary.ilike(f"%{search}%"),
                    Article.category.ilike(f"%{search}%"),
                )
            )

        if category:
            query = query.filter(
                Article.category == category
            )

        return query.order_by(
            Article.id.desc()
        ).all()

    def get_by_id(
        self,
        db: Session,
        article_id: int,
    ):
        return (
            db.query(Article)
            .filter(Article.id == article_id)
            .first()
        )