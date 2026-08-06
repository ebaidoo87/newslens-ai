from sqlalchemy import (
    func,
    or_,
)
from sqlalchemy.orm import Session

from app.models.article import Article
from app.models.bookmark import Bookmark
from app.models.reading_history import (
    ReadingHistory,
)


class TrendingRepository:

    def get_article_activity(
        self,
        db: Session,
        country: str | None = None,
        candidate_limit: int = 200,
    ):
        bookmark_counts = (
            db.query(
                Bookmark.article_id.label(
                    "article_id"
                ),
                func.count(
                    Bookmark.id
                ).label(
                    "bookmark_count"
                ),
            )
            .group_by(
                Bookmark.article_id
            )
            .subquery()
        )

        view_counts = (
            db.query(
                ReadingHistory.article_id.label(
                    "article_id"
                ),
                func.count(
                    ReadingHistory.id
                ).label(
                    "view_count"
                ),
            )
            .group_by(
                ReadingHistory.article_id
            )
            .subquery()
        )

        query = (
            db.query(
                Article,
                func.coalesce(
                    bookmark_counts.c.bookmark_count,
                    0,
                ).label(
                    "bookmark_count"
                ),
                func.coalesce(
                    view_counts.c.view_count,
                    0,
                ).label(
                    "view_count"
                ),
            )
            .outerjoin(
                bookmark_counts,
                bookmark_counts.c.article_id
                == Article.id,
            )
            .outerjoin(
                view_counts,
                view_counts.c.article_id
                == Article.id,
            )
        )

        if country:
            normalized_country = (
                country.strip().lower()
            )

            if normalized_country == "world":
                query = query.filter(
                    or_(
                        Article.country
                        == "global",
                        Article.country
                        .is_not(None),
                    )
                )
            else:
                query = query.filter(
                    Article.country
                    == normalized_country
                )

        return (
            query
            .order_by(
                Article.published_at.desc()
                .nullslast(),
                Article.id.desc(),
            )
            .limit(candidate_limit)
            .all()
        )