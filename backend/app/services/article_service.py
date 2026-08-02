from sqlalchemy.orm import Session

from app.repositories.article_repository import ArticleRepository


class ArticleService:

    def __init__(self, db: Session):
        self.db = db
        self.repository = ArticleRepository()

    def get_articles(
        self,
        search=None,
        category=None,
    ):
        return self.repository.get_articles(
            self.db,
            search,
            category,
        )

    def get_article_by_id(
        self,
        article_id: int,
    ):
        return self.repository.get_by_id(
            self.db,
            article_id,
        )