from sqlalchemy.orm import Session

from app.models.bookmark import Bookmark
from app.repositories.article_repository import (
    ArticleRepository,
)
from app.repositories.bookmark_repository import (
    BookmarkRepository,
)


class BookmarkService:

    def __init__(self, db: Session):
        self.db = db
        self.bookmark_repository = (
            BookmarkRepository()
        )
        self.article_repository = (
            ArticleRepository()
        )

    def create_bookmark(
        self,
        user_id: int,
        article_id: int,
    ) -> Bookmark:
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
            self.bookmark_repository
            .get_by_user_and_article(
                self.db,
                user_id,
                article_id,
            )
        )

        if existing:
            return existing

        bookmark = Bookmark(
            user_id=user_id,
            article_id=article_id,
        )

        return (
            self.bookmark_repository.create(
                self.db,
                bookmark,
            )
        )

    def remove_bookmark(
        self,
        user_id: int,
        article_id: int,
    ) -> None:
        bookmark = (
            self.bookmark_repository
            .get_by_user_and_article(
                self.db,
                user_id,
                article_id,
            )
        )

        if not bookmark:
            raise ValueError(
                "Bookmark not found"
            )

        self.bookmark_repository.delete(
            self.db,
            bookmark,
        )

    def get_user_bookmarks(
        self,
        user_id: int,
    ) -> list[Bookmark]:
        return (
            self.bookmark_repository
            .get_all_by_user(
                self.db,
                user_id,
            )
        )

    def get_bookmark_status(
        self,
        user_id: int,
        article_id: int,
    ) -> bool:
        bookmark = (
            self.bookmark_repository
            .get_by_user_and_article(
                self.db,
                user_id,
                article_id,
            )
        )

        return bookmark is not None