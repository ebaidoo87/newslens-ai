from sqlalchemy.orm import (
    Session,
    joinedload,
)

from app.models.bookmark import Bookmark


class BookmarkRepository:

    def get_by_user_and_article(
        self,
        db: Session,
        user_id: int,
        article_id: int,
    ) -> Bookmark | None:
        return (
            db.query(Bookmark)
            .filter(
                Bookmark.user_id == user_id,
                Bookmark.article_id == article_id,
            )
            .first()
        )

    def get_all_by_user(
        self,
        db: Session,
        user_id: int,
    ) -> list[Bookmark]:
        return (
            db.query(Bookmark)
            .options(
                joinedload(Bookmark.article)
            )
            .filter(
                Bookmark.user_id == user_id
            )
            .order_by(
                Bookmark.created_at.desc()
            )
            .all()
        )

    def create(
        self,
        db: Session,
        bookmark: Bookmark,
    ) -> Bookmark:
        db.add(bookmark)
        db.commit()
        db.refresh(bookmark)

        return bookmark

    def delete(
        self,
        db: Session,
        bookmark: Bookmark,
    ) -> None:
        db.delete(bookmark)
        db.commit()