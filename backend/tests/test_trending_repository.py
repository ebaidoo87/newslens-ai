from datetime import (
    datetime,
    timedelta,
)

import pytest

from app.models.article import Article
from app.models.bookmark import Bookmark
from app.models.reading_history import (
    ReadingHistory,
)
from app.models.user import User
from app.repositories.trending_repository import (
    TrendingRepository,
)

from tests.database import (
    TestingSessionLocal,
)


@pytest.fixture
def db(clean_database):
    """
    Provide a real SQLAlchemy Session while
    retaining the existing test DB cleanup.
    """
    session = TestingSessionLocal()

    try:
        yield session
    finally:
        session.rollback()
        session.close()


def create_user(
    db,
    *,
    username: str,
    email: str,
):
    user = User(
        username=username,
        email=email,
        hashed_password="test-hash",
        is_active=True,
        role="user",
        token_version=0,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def create_article(
    db,
    *,
    title: str,
    url: str,
    country: str = "global",
    published_at=None,
):
    article = Article(
        title=title,
        summary="Test article summary",
        content="Test article content",
        url=url,
        source="Test Source",
        language="en",
        country=country,
        category="technology",
        published_at=published_at,
    )

    db.add(article)
    db.commit()
    db.refresh(article)

    return article


def test_get_article_activity_empty(
    db,
):
    repository = TrendingRepository()

    results = (
        repository.get_article_activity(
            db
        )
    )

    assert results == []


def test_article_without_activity_returns_zero_counts(
    db,
):
    repository = TrendingRepository()

    article = create_article(
        db,
        title="No activity",
        url=(
            "https://example.com/"
            "no-activity"
        ),
    )

    results = (
        repository.get_article_activity(
            db
        )
    )

    assert len(results) == 1

    (
        returned_article,
        bookmark_count,
        view_count,
    ) = results[0]

    assert (
        returned_article.id
        == article.id
    )

    assert bookmark_count == 0
    assert view_count == 0


def test_bookmark_count_is_aggregated(
    db,
):
    repository = TrendingRepository()

    article = create_article(
        db,
        title="Bookmarked article",
        url=(
            "https://example.com/"
            "bookmarked"
        ),
    )

    user_one = create_user(
        db,
        username="trend_bookmark_one",
        email=(
            "trend-bookmark-one@"
            "example.com"
        ),
    )

    user_two = create_user(
        db,
        username="trend_bookmark_two",
        email=(
            "trend-bookmark-two@"
            "example.com"
        ),
    )

    db.add_all(
        [
            Bookmark(
                user_id=user_one.id,
                article_id=article.id,
            ),
            Bookmark(
                user_id=user_two.id,
                article_id=article.id,
            ),
        ]
    )

    db.commit()

    results = (
        repository.get_article_activity(
            db
        )
    )

    assert len(results) == 1

    (
        _,
        bookmark_count,
        view_count,
    ) = results[0]

    assert bookmark_count == 2
    assert view_count == 0


def test_view_count_is_aggregated(
    db,
):
    repository = TrendingRepository()

    article = create_article(
        db,
        title="Viewed article",
        url=(
            "https://example.com/"
            "viewed"
        ),
    )

    user_one = create_user(
        db,
        username="trend_view_one",
        email=(
            "trend-view-one@example.com"
        ),
    )

    user_two = create_user(
        db,
        username="trend_view_two",
        email=(
            "trend-view-two@example.com"
        ),
    )

    db.add_all(
        [
            ReadingHistory(
                user_id=user_one.id,
                article_id=article.id,
            ),
            ReadingHistory(
                user_id=user_two.id,
                article_id=article.id,
            ),
        ]
    )

    db.commit()

    results = (
        repository.get_article_activity(
            db
        )
    )

    assert len(results) == 1

    (
        _,
        bookmark_count,
        view_count,
    ) = results[0]

    assert bookmark_count == 0
    assert view_count == 2


def test_bookmarks_and_views_are_combined(
    db,
):
    repository = TrendingRepository()

    article = create_article(
        db,
        title="Popular article",
        url=(
            "https://example.com/"
            "popular"
        ),
    )

    user_one = create_user(
        db,
        username="trend_combined_one",
        email=(
            "trend-combined-one@"
            "example.com"
        ),
    )

    user_two = create_user(
        db,
        username="trend_combined_two",
        email=(
            "trend-combined-two@"
            "example.com"
        ),
    )

    db.add_all(
        [
            Bookmark(
                user_id=user_one.id,
                article_id=article.id,
            ),
            Bookmark(
                user_id=user_two.id,
                article_id=article.id,
            ),
            ReadingHistory(
                user_id=user_one.id,
                article_id=article.id,
            ),
            ReadingHistory(
                user_id=user_two.id,
                article_id=article.id,
            ),
        ]
    )

    db.commit()

    results = (
        repository.get_article_activity(
            db
        )
    )

    assert len(results) == 1

    (
        _,
        bookmark_count,
        view_count,
    ) = results[0]

    assert bookmark_count == 2
    assert view_count == 2


def test_country_filter(
    db,
):
    repository = TrendingRepository()

    uk_article = create_article(
        db,
        title="UK article",
        url="https://example.com/uk",
        country="uk",
    )

    create_article(
        db,
        title="US article",
        url="https://example.com/us",
        country="us",
    )

    results = (
        repository.get_article_activity(
            db,
            country=" UK ",
        )
    )

    assert len(results) == 1

    assert (
        results[0][0].id
        == uk_article.id
    )


def test_world_filter(
    db,
):
    repository = TrendingRepository()

    global_article = create_article(
        db,
        title="Global article",
        url=(
            "https://example.com/global"
        ),
        country="global",
    )

    uk_article = create_article(
        db,
        title="UK article",
        url=(
            "https://example.com/"
            "world-uk"
        ),
        country="uk",
    )

    results = (
        repository.get_article_activity(
            db,
            country="world",
        )
    )

    ids = {
        row[0].id
        for row in results
    }

    assert (
        global_article.id
        in ids
    )

    assert (
        uk_article.id
        in ids
    )


def test_results_are_ordered_newest_first(
    db,
):
    repository = TrendingRepository()

    now = datetime.now()

    older = create_article(
        db,
        title="Older article",
        url=(
            "https://example.com/older"
        ),
        published_at=(
            now - timedelta(days=2)
        ),
    )

    newer = create_article(
        db,
        title="Newer article",
        url=(
            "https://example.com/newer"
        ),
        published_at=now,
    )

    results = (
        repository.get_article_activity(
            db
        )
    )

    assert (
        results[0][0].id
        == newer.id
    )

    assert (
        results[1][0].id
        == older.id
    )


def test_candidate_limit(
    db,
):
    repository = TrendingRepository()

    for index in range(5):
        create_article(
            db,
            title=f"Article {index}",
            url=(
                "https://example.com/"
                f"limit-{index}"
            ),
        )

    results = (
        repository.get_article_activity(
            db,
            candidate_limit=2,
        )
    )

    assert len(results) == 2