from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.models import Article


def seed_articles():
    db: Session = SessionLocal()

    try:
        if db.query(Article).count() > 0:
            print("Database already seeded.")
            return

        articles = [
            Article(
                title="AI transforms modern journalism",
                summary="Artificial intelligence is reshaping the news industry.",
                content="A longer article body goes here...",
                url="https://example.com/article-1",
                source="NewsLens",
                author="Admin",
                language="en",
                country="global",
                category="technology",
            ),
            Article(
                title="Global markets rally",
                summary="Stocks climbed after positive earnings reports.",
                content="Market analysis...",
                url="https://example.com/article-2",
                source="Reuters",
                author="Jane Doe",
                language="en",
                country="global",
                category="business",
            ),
            Article(
                title="New renewable energy breakthrough",
                summary="Scientists announce a major energy storage advance.",
                content="Research details...",
                url="https://example.com/article-3",
                source="BBC",
                author="John Smith",
                language="en",
                country="UK",
                category="science",
            ),
        ]

        db.add_all(articles)
        db.commit()

        print("Seed completed.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_articles()