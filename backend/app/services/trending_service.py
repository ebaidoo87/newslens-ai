from dataclasses import dataclass
from datetime import (
    datetime,
    timezone,
)

from sqlalchemy.orm import Session

from app.models.article import Article
from app.repositories.trending_repository import (
    TrendingRepository,
)


@dataclass
class TrendingArticle:
    article: Article
    trending_score: float
    bookmark_count: int
    view_count: int
    reasons: list[str]


class TrendingService:

    BOOKMARK_WEIGHT = 12
    VIEW_WEIGHT = 6

    FRESHNESS_24_HOURS = 50
    FRESHNESS_72_HOURS = 30
    FRESHNESS_7_DAYS = 15


    def __init__(self, db: Session):
        self.db = db
        self.repository = TrendingRepository()


    @staticmethod
    def make_aware(
        value: datetime | None,
    ) -> datetime | None:
        if not value:
            return None

        if value.tzinfo is None:
            return value.replace(
                tzinfo=timezone.utc
            )

        return value


    def calculate_freshness_score(
        self,
        article: Article,
    ) -> tuple[float, str | None]:
        published_at = self.make_aware(
            article.published_at
        )

        if not published_at:
            return 0, None

        now = datetime.now(
            timezone.utc
        )

        age_hours = (
            now - published_at
        ).total_seconds() / 3600

        if age_hours <= 24:
            return (
                self.FRESHNESS_24_HOURS,
                "Published within 24 hours",
            )

        if age_hours <= 72:
            return (
                self.FRESHNESS_72_HOURS,
                "Published within 3 days",
            )

        if age_hours <= 168:
            return (
                self.FRESHNESS_7_DAYS,
                "Published within 7 days",
            )

        return 0, None


    def score_article(
        self,
        article: Article,
        bookmark_count: int,
        view_count: int,
    ) -> TrendingArticle:
        score = 0.0
        reasons: list[str] = []

        if bookmark_count > 0:
            bookmark_score = (
                bookmark_count
                * self.BOOKMARK_WEIGHT
            )

            score += bookmark_score

            reasons.append(
                f"{bookmark_count} bookmark"
                f"{'' if bookmark_count == 1 else 's'}"
            )

        if view_count > 0:
            view_score = (
                view_count
                * self.VIEW_WEIGHT
            )

            score += view_score

            reasons.append(
                f"{view_count} recent view"
                f"{'' if view_count == 1 else 's'}"
            )

        (
            freshness_score,
            freshness_reason,
        ) = self.calculate_freshness_score(
            article
        )

        score += freshness_score

        if freshness_reason:
            reasons.append(
                freshness_reason
            )

        return TrendingArticle(
            article=article,
            trending_score=round(
                score,
                2,
            ),
            bookmark_count=bookmark_count,
            view_count=view_count,
            reasons=reasons,
        )


    def get_trending_articles(
        self,
        country: str | None = None,
        limit: int = 20,
        candidate_limit: int = 200,
    ) -> list[TrendingArticle]:
        rows = (
            self.repository
            .get_article_activity(
                self.db,
                country=country,
                candidate_limit=(
                    candidate_limit
                ),
            )
        )

        trending_articles = [
            self.score_article(
                article=article,
                bookmark_count=int(
                    bookmark_count
                ),
                view_count=int(
                    view_count
                ),
            )
            for (
                article,
                bookmark_count,
                view_count,
            ) in rows
        ]

        trending_articles.sort(
            key=lambda item: (
                item.trending_score,
                item.article.published_at
                or item.article.created_at,
                item.article.id,
            ),
            reverse=True,
        )

        return trending_articles[:limit]