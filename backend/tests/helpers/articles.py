from datetime import datetime

from app.models.article import Article
from tests.database import (
    TestingSessionLocal,
)


def create_article(
    *,
    title: str = "AI transforms journalism",
    summary: str | None = (
        "Artificial intelligence is reshaping "
        "the news industry."
    ),
    content: str | None = None,
    url: str = (
        "https://example.com/test-article"
    ),
    image_url: str | None = None,
    source: str = "NewsLens",
    author: str | None = None,
    language: str = "en",
    country: str = "global",
    category: str = "technology",
    published_at: datetime | None = None,
) -> Article:
    db = TestingSessionLocal()

    try:
        article = Article(
            title=title,
            summary=summary,
            content=content,
            url=url,
            image_url=image_url,
            source=source,
            author=author,
            language=language,
            country=country,
            category=category,
            published_at=published_at,
        )

        db.add(article)
        db.commit()
        db.refresh(article)

        # Detach so it can safely be returned
        # after the session closes.
        db.expunge(article)

        return article

    finally:
        db.close()