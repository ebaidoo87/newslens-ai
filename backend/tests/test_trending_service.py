from datetime import (
    datetime,
    timedelta,
    timezone,
)

from app.models.article import Article
from app.services.trending_service import (
    TrendingService,
)


def make_article(
    article_id=1,
    published_at=None,
):
    return Article(
        id=article_id,
        title=f"Article {article_id}",
        summary="Summary",
        content="Content",
        url=(
            f"https://example.com/"
            f"trending-{article_id}"
        ),
        source="NewsLens",
        category="technology",
        country="uk",
        language="en",
        published_at=published_at,
        created_at=datetime.now(
            timezone.utc
        ),
    )


def test_make_aware_none():
    assert (
        TrendingService.make_aware(
            None
        )
        is None
    )


def test_make_aware_naive_datetime():
    value = datetime.now()

    result = (
        TrendingService.make_aware(
            value
        )
    )

    assert (
        result.tzinfo
        == timezone.utc
    )


def test_make_aware_keeps_aware_datetime():
    value = datetime.now(
        timezone.utc
    )

    result = (
        TrendingService.make_aware(
            value
        )
    )

    assert result is value


def test_freshness_within_24_hours(
    test_database,
):
    service = TrendingService(
        test_database
    )

    article = make_article(
        published_at=(
            datetime.now(timezone.utc)
            - timedelta(hours=5)
        )
    )

    score, reason = (
        service
        .calculate_freshness_score(
            article
        )
    )

    assert score == 50

    assert (
        reason
        == "Published within 24 hours"
    )


def test_freshness_within_72_hours(
    test_database,
):
    service = TrendingService(
        test_database
    )

    article = make_article(
        published_at=(
            datetime.now(timezone.utc)
            - timedelta(hours=48)
        )
    )

    score, reason = (
        service
        .calculate_freshness_score(
            article
        )
    )

    assert score == 30

    assert (
        reason
        == "Published within 3 days"
    )


def test_freshness_within_seven_days(
    test_database,
):
    service = TrendingService(
        test_database
    )

    article = make_article(
        published_at=(
            datetime.now(timezone.utc)
            - timedelta(days=5)
        )
    )

    score, reason = (
        service
        .calculate_freshness_score(
            article
        )
    )

    assert score == 15

    assert (
        reason
        == "Published within 7 days"
    )


def test_old_article_has_no_freshness_score(
    test_database,
):
    service = TrendingService(
        test_database
    )

    article = make_article(
        published_at=(
            datetime.now(timezone.utc)
            - timedelta(days=10)
        )
    )

    score, reason = (
        service
        .calculate_freshness_score(
            article
        )
    )

    assert score == 0
    assert reason is None


def test_article_without_date_has_no_freshness_score(
    test_database,
):
    service = TrendingService(
        test_database
    )

    article = make_article(
        published_at=None
    )

    score, reason = (
        service
        .calculate_freshness_score(
            article
        )
    )

    assert score == 0
    assert reason is None


def test_trending_score_combines_activity_and_freshness(
    test_database,
):
    service = TrendingService(
        test_database
    )

    article = make_article(
        published_at=(
            datetime.now(timezone.utc)
            - timedelta(hours=2)
        )
    )

    result = service.score_article(
        article=article,
        bookmark_count=2,
        view_count=3,
    )

    # 2 bookmarks * 12 = 24
    # 3 views * 6 = 18
    # freshness = 50
    assert (
        result.trending_score
        == 92
    )

    assert (
        result.bookmark_count
        == 2
    )

    assert (
        result.view_count
        == 3
    )

    assert (
        "2 bookmarks"
        in result.reasons
    )

    assert (
        "3 recent views"
        in result.reasons
    )


def test_singular_activity_reasons(
    test_database,
):
    service = TrendingService(
        test_database
    )

    article = make_article(
        published_at=None
    )

    result = service.score_article(
        article=article,
        bookmark_count=1,
        view_count=1,
    )

    assert (
        "1 bookmark"
        in result.reasons
    )

    assert (
        "1 recent view"
        in result.reasons
    )


def test_get_trending_articles_orders_by_score(
    test_database,
    monkeypatch,
):
    service = TrendingService(
        test_database
    )

    low = make_article(
        article_id=1,
        published_at=None,
    )

    high = make_article(
        article_id=2,
        published_at=None,
    )

    monkeypatch.setattr(
        service.repository,
        "get_article_activity",
        lambda db, country, candidate_limit: [
            (
                low,
                0,
                1,
            ),
            (
                high,
                3,
                5,
            ),
        ],
    )

    results = (
        service.get_trending_articles(
            country="uk",
            limit=10,
        )
    )

    assert len(results) == 2

    assert (
        results[0].article.id
        == 2
    )

    assert (
        results[0].trending_score
        > results[1].trending_score
    )