from sqlalchemy.orm import Session

from app.models.article import Article
from app.repositories.article_repository import ArticleRepository
from app.services.news_provider import NewsProvider


class ImportService:

    def __init__(self, db: Session):
        self.db = db
        self.provider = NewsProvider()
        self.repository = ArticleRepository()

    async def import_articles(self):
        response = await self.provider.get_top_headlines()

        imported = 0

        for item in response.get("articles", []):

            url = item.get("url")

            if not url:
                continue

            existing = self.repository.get_by_url(self.db,url,)
            

            if existing:
                continue

            article = Article(
                title=item.get("title"),
                summary=item.get("description"),
                content=item.get("content"),
                url=url,
                
                image_url=(item.get("urlToImage")or item.get("image")),

                source=item.get("source", {}).get("name"),
                author=item.get("author"),
                language="en",
                country="us",
                category="technology",
            )

            self.repository.create(self.db,article,)

            imported += 1

        return {
            "received": len(response.get("articles", [])),
            "imported": imported,
        }
    