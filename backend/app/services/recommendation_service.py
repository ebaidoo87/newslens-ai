from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.models.article import Article
from app.repositories.recommendation_repository import (
    RecommendationRepository,
)


@dataclass
class ScoredArticle:
    article: Article
    score: int
    reasons: list[str]


class RecommendationService:

    CATEGORY_SCORE = 40
    COUNTRY_SCORE = 25

    TITLE_KEYWORD_SCORE = 50
    SUMMARY_KEYWORD_SCORE = 30
    CONTENT_KEYWORD_SCORE = 15

    BOOKMARK_SCORE = 5
    VIEWED_PENALTY = 15


    def __init__(self, db: Session):
        self.db = db
        self.repository = (
            RecommendationRepository()
        )


    @staticmethod
    def normalize_text(
        value: str | None,
    ) -> str:
        return (
            value
            or ""
        ).strip().lower()


    def score_article(
        self,
        article: Article,
        categories: set[str],
        countries: set[str],
        keywords: set[str],
        bookmarked_ids: set[int],
        viewed_ids: set[int],
    ) -> ScoredArticle:
        score = 0
        reasons: list[str] = []

        article_category = (
            self.normalize_text(
                article.category
            )
        )

        article_country = (
            self.normalize_text(
                article.country
            )
        )

        title = self.normalize_text(
            article.title
        )

        summary = self.normalize_text(
            article.summary
        )

        content = self.normalize_text(
            article.content
        )


        if article_category in categories:
            score += self.CATEGORY_SCORE

            reasons.append(
                f"Matches preferred category: "
                f"{article.category}"
            )


        if article_country in countries:
            score += self.COUNTRY_SCORE

            reasons.append(
                f"Matches preferred country: "
                f"{article.country}"
            )


        for keyword in keywords:
            if keyword in title:
                score += (
                    self.TITLE_KEYWORD_SCORE
                )

                reasons.append(
                    f'Keyword "{keyword}" '
                    f"appears in title"
                )

            elif keyword in summary:
                score += (
                    self.SUMMARY_KEYWORD_SCORE
                )

                reasons.append(
                    f'Keyword "{keyword}" '
                    f"appears in summary"
                )

            elif keyword in content:
                score += (
                    self.CONTENT_KEYWORD_SCORE
                )

                reasons.append(
                    f'Keyword "{keyword}" '
                    f"appears in content"
                )


        if article.id in bookmarked_ids:
            score += self.BOOKMARK_SCORE

            reasons.append(
                "Previously bookmarked"
            )


        if article.id in viewed_ids:
            score -= self.VIEWED_PENALTY

            reasons.append(
                "Previously viewed"
            )


        return ScoredArticle(
            article=article,
            score=score,
            reasons=reasons,
        )


    def get_recommendations(
        self,
        user_id: int,
        limit: int = 20,
        candidate_limit: int = 200,
    ) -> list[ScoredArticle]:
        preferences = (
            self.repository.get_preferences(
                self.db,
                user_id,
            )
        )

        categories: set[str] = set()
        countries: set[str] = set()
        keywords: set[str] = set()


        for preference in preferences:
            preference_type = (
                preference.preference_type
                .strip()
                .lower()
            )

            preference_value = (
                preference.preference_value
                .strip()
                .lower()
            )

            if preference_type == "category":
                categories.add(
                    preference_value
                )

            elif preference_type == "country":
                countries.add(
                    preference_value
                )

            elif preference_type == "keyword":
                keywords.add(
                    preference_value
                )


        articles = (
            self.repository
            .get_recent_articles(
                self.db,
                limit=candidate_limit,
            )
        )

        bookmarked_ids = (
            self.repository
            .get_bookmarked_article_ids(
                self.db,
                user_id,
            )
        )

        viewed_ids = (
            self.repository
            .get_viewed_article_ids(
                self.db,
                user_id,
            )
        )


        scored_articles = [
            self.score_article(
                article=article,
                categories=categories,
                countries=countries,
                keywords=keywords,
                bookmarked_ids=(
                    bookmarked_ids
                ),
                viewed_ids=viewed_ids,
            )
            for article in articles
        ]


        scored_articles.sort(
            key=lambda item: (
                item.score,
                item.article.published_at
                or item.article.created_at,
                item.article.id,
            ),
            reverse=True,
        )


        positively_scored = [
            item
            for item in scored_articles
            if item.score > 0
        ]


        if positively_scored:
            return positively_scored[
                :limit
            ]


        # New users without preferences still
        # receive the newest articles.
        return scored_articles[:limit]