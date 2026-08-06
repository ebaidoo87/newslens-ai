from sqlalchemy.orm import Session

from app.models.reading_history import (
    ReadingHistory,
)
from app.repositories.article_repository import (
    ArticleRepository,
)
from app.repositories.reading_history_repository import (
    ReadingHistoryRepository,
)


class ReadingHistoryService:

    def __init__(self, db: Session):
        self.db = db
        self.history_repository = (
            ReadingHistoryRepository()
        )
        self.article_repository = (
            ArticleRepository()
        )

    def record_view(
        self,
        user_id: int,
        article_id: int,
    ) -> ReadingHistory:
        article = (
            self.article_repository.get_by_id(
                self.db,
                article_id,
            )
        )

        if not article:
            raise ValueError(
                "Article not found"
            )

        existing = (
            self.history_repository
            .get_by_user_and_article(
                self.db,
                user_id,
                article_id,
            )
        )

        if existing:
            return (
                self.history_repository
                .update_viewed_at(
                    self.db,
                    existing,
                )
            )

        history = ReadingHistory(
            user_id=user_id,
            article_id=article_id,
        )

        return (
            self.history_repository.create(
                self.db,
                history,
            )
        )

    def get_user_history(
        self,
        user_id: int,
        limit: int = 50,
    ) -> list[ReadingHistory]:
        return (
            self.history_repository
            .get_all_by_user(
                self.db,
                user_id,
                limit,
            )
        )

    def clear_user_history(
        self,
        user_id: int,
    ) -> None:
        self.history_repository.clear_all_by_user(
            self.db,
            user_id,
        )