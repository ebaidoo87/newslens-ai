from sqlalchemy.orm import Session

from app.models.article import Article
from app.models.bookmark import Bookmark
from app.models.reading_history import ReadingHistory
from app.models.user_preference import UserPreference


class DiscoveryRepository:

    def get_preferences(
        self,
        db: Session,
        user_id: int,
    ) -> list[UserPreference]:
        return (
            db.query(UserPreference)
            .filter(
                UserPreference.user_id
                == user_id
            )
            .all()
        )

    def get_recent_articles(
        self,
        db: Session,
        limit: int = 300,
    ) -> list[Article]:
        return (
            db.query(Article)
            .order_by(
                Article.published_at.desc()
                .nullslast(),
                Article.id.desc(),
            )
            .limit(limit)
            .all()
        )

    def get_bookmarked_article_ids(
        self,
        db: Session,
        user_id: int,
    ) -> set[int]:
        rows = (
            db.query(Bookmark.article_id)
            .filter(
                Bookmark.user_id == user_id
            )
            .all()
        )

        return {
            article_id
            for (article_id,) in rows
        }

    def get_viewed_article_ids(
        self,
        db: Session,
        user_id: int,
    ) -> set[int]:
        rows = (
            db.query(
                ReadingHistory.article_id
            )
            .filter(
                ReadingHistory.user_id
                == user_id
            )
            .all()
        )

        return {
            article_id
            for (article_id,) in rows
        }