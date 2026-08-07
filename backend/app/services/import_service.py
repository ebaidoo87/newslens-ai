from datetime import datetime

from sqlalchemy.orm import Session

from app.data.category_queries import (
    CATEGORY_QUERIES,
)
from app.data.source_metadata import (
    get_source_metadata,
)
from app.models.article import Article
from app.repositories.article_repository import (
    ArticleRepository,
)
from app.services.news_provider import (
    NewsProvider,
)
from app.services.notification_service import (
    NotificationService,
)

from langdetect import (
    DetectorFactory,
    LangDetectException,
    detect,
)

DetectorFactory.seed = 0


class ImportService:

    def __init__(self, db: Session):
        self.db = db
        self.provider = NewsProvider()
        self.repository = ArticleRepository()

        self.notification_service = (
        NotificationService(db)
        )


    @staticmethod
    def parse_published_at(
        value: str | None,
    ) -> datetime | None:
        if not value:
            return None

        try:
            return datetime.fromisoformat(
                value.replace("Z", "+00:00")
            )
        except ValueError:
            return None


    async def import_articles(
        self,
        category: str,
    ) -> dict:
        query = CATEGORY_QUERIES.get(category)

        if not query:
            raise ValueError(
                "Unsupported news category"
            )

        response = (
            await self.provider.search_articles(
                query=query,
            )
        )

        articles = response.get("articles", [])

        imported = 0
        skipped = 0
        language_skipped = 0
        notifications_created = 0

        country_counts: dict[str, int] = {}


        for item in articles:
            url = item.get("url")
            title = item.get("title")
            summary = item.get("description")
            content = item.get("content")

            

            if not url or not title:
                skipped += 1
                continue

            if not self.is_english_article(
                title=title,
                summary=summary,
                content=content,
            ):
                language_skipped += 1
                skipped += 1
                continue

            existing = self.repository.get_by_url(
                self.db,
                url,
            )

            if existing:
                skipped += 1
                continue

            source_data = item.get("source") or {}

            raw_source_name = (
                source_data.get("name")
                or "Unknown"
            )

            source_metadata = get_source_metadata(
                source_name=raw_source_name,
                article_url=url,
            )

            source_name = (
                source_metadata.display_name
                or raw_source_name
            )

            article = Article(
                title=title,
                summary=summary,
                content=content,
                url=url,
                image_url=item.get(
                    "urlToImage"
                ),
                source=source_name,
                author=item.get(
                    "author"
                ),
                language="en",
                country=(
                    source_metadata.country
                ),
                category=category,
                published_at=(
                    self.parse_published_at(
                        item.get(
                            "publishedAt"
                        )
                    )
                ),
            )

            created_article = (
                self.repository.create(
                    self.db,
                    article,
                )
            )

            notification_count = (
                self.notification_service
                    .create_article_notifications(
                        created_article
                )
            )

            notifications_created += (
                notification_count
            )

            imported += 1

            country_counts[
                source_metadata.country
            ] = (
                country_counts.get(
                    source_metadata.country,
                    0,
                )
                + 1
            )

        return {
            "category": category,
            "received": len(articles),
            "imported": imported,
            "skipped": skipped,
            "language_skipped": language_skipped,
            "notifications_created": (
                notifications_created
            ),
            "countries": country_counts,
        }


    @staticmethod
    def is_english_article(
        title: str | None,
        summary: str | None,
        content: str | None,
) -> bool:
        text = " ".join(
            part.strip()
            for part in (
                title,
                summary,
                content,
            )
        if part and part.strip()
    )

    # Very short text is unreliable for detection.
        if len(text) < 40:
            return True

        try:
            return detect(text) == "en"
        except LangDetectException:
            return False