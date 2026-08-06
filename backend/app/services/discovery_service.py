from dataclasses import dataclass
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.article import Article
from app.repositories.discovery_repository import (
    DiscoveryRepository,
)


@dataclass
class DiscoveredArticle:
    article: Article
    discovery_score: int
    reasons: list[str]


class DiscoveryService:

    NEW_CATEGORY_SCORE = 50
    NEW_COUNTRY_SCORE = 30
    UNVIEWED_SCORE = 25
    FRESH_SCORE = 20

    BOOKMARKED_PENALTY = 30
    KEYWORD_MATCH_PENALTY = 25

    def __init__(self, db: Session):
        self.db = db
        self.repository = (
            DiscoveryRepository()
        )

    @staticmethod
    def normalize(
        value: str | None,
    ) -> str:
        return (
            value
            or ""
        ).strip().lower()

    @staticmethod
    def is_recent(
        article: Article,
    ) -> bool:
        published_at = article.published_at

        if not published_at:
            return False

        if published_at.tzinfo is None:
            published_at = (
                published_at.replace(
                    tzinfo=timezone.utc
                )
            )

        age_hours = (
            datetime.now(timezone.utc)
            - published_at
        ).total_seconds() / 3600

        return age_hours <= 168

    def score_article(
        self,
        article: Article,
        categories: set[str],
        countries: set[str],
        keywords: set[str],
        bookmarked_ids: set[int],
        viewed_ids: set[int],
    ) -> DiscoveredArticle:
        score = 0
        reasons: list[str] = []

        category = self.normalize(
            article.category
        )

        country = self.normalize(
            article.country
        )

        searchable_text = " ".join(
            [
                self.normalize(
                    article.title
                ),
                self.normalize(
                    article.summary
                ),
                self.normalize(
                    article.content
                ),
            ]
        )

        if category not in categories:
            score += self.NEW_CATEGORY_SCORE

            reasons.append(
                f"Explore a new category: "
                f"{article.category}"
            )

        if (
            countries
            and country not in countries
        ):
            score += self.NEW_COUNTRY_SCORE

            reasons.append(
                f"Discover news from "
                f"{article.country}"
            )

        if article.id not in viewed_ids:
            score += self.UNVIEWED_SCORE

            reasons.append(
                "You have not viewed this article"
            )

        if self.is_recent(article):
            score += self.FRESH_SCORE

            reasons.append(
                "Recently published"
            )

        if article.id in bookmarked_ids:
            score -= self.BOOKMARKED_PENALTY

            reasons.append(
                "Already saved"
            )

        matched_keywords = [
            keyword
            for keyword in keywords
            if keyword in searchable_text
        ]

        if matched_keywords:
            score -= (
                len(matched_keywords)
                * self.KEYWORD_MATCH_PENALTY
            )

        return DiscoveredArticle(
            article=article,
            discovery_score=score,
            reasons=reasons,
        )

    def get_discovery_articles(
        self,
        user_id: int,
        limit: int = 20,
        candidate_limit: int = 300,
    ) -> list[DiscoveredArticle]:
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
            self.repository.get_recent_articles(
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

        results = [
            self.score_article(
                article=article,
                categories=categories,
                countries=countries,
                keywords=keywords,
                bookmarked_ids=bookmarked_ids,
                viewed_ids=viewed_ids,
            )
            for article in articles
        ]

        results.sort(
            key=lambda item: (
                item.discovery_score,
                item.article.published_at
                or item.article.created_at,
                item.article.id,
            ),
            reverse=True,
        )

        positive_results = [
            item
            for item in results
            if item.discovery_score > 0
        ]

        return positive_results[:limit]