from datetime import (
    datetime,
    timedelta,
    timezone,
)
from types import SimpleNamespace

from app.models.article import Article
from app.services.discovery_service import (
    DiscoveryService,
)


def make_article(
    article_id=1,
    title="AI breakthrough",
    summary="Technology news",
    content="Artificial intelligence",
    category="technology",
    country="uk",
    published_at=None,
):
    return Article(
        id=article_id,
        title=title,
        summary=summary,
        content=content,
        url=(
            f"https://example.com/"
            f"discovery-{article_id}"
        ),
        source="NewsLens",
        category=category,
        country=country,
        language="en",
        published_at=published_at,
        created_at=datetime.now(
            timezone.utc
        ),
    )


def test_normalize():
    assert (
        DiscoveryService.normalize(
            " Technology "
        )
        == "technology"
    )

    assert (
        DiscoveryService.normalize(None)
        == ""
    )


def test_recent_article():
    article = make_article(
        published_at=(
            datetime.now(timezone.utc)
            - timedelta(hours=12)
        )
    )

    assert (
        DiscoveryService.is_recent(
            article
        )
        is True
    )


def test_old_article_not_recent():
    article = make_article(
        published_at=(
            datetime.now(timezone.utc)
            - timedelta(days=10)
        )
    )

    assert (
        DiscoveryService.is_recent(
            article
        )
        is False
    )


def test_article_without_date_not_recent():
    article = make_article(
        published_at=None
    )

    assert (
        DiscoveryService.is_recent(
            article
        )
        is False
    )


def test_naive_datetime_is_supported():
    article = make_article(
        published_at=(
            datetime.now()
            - timedelta(hours=1)
        )
    )

    assert (
        DiscoveryService.is_recent(
            article
        )
        is True
    )


def test_discovery_scoring_rewards_novel_article(
    test_database,
):
    service = DiscoveryService(
        test_database
    )

    article = make_article(
        published_at=(
            datetime.now(timezone.utc)
            - timedelta(hours=1)
        )
    )

    result = service.score_article(
        article=article,
        categories={"business"},
        countries={"us"},
        keywords=set(),
        bookmarked_ids=set(),
        viewed_ids=set(),
    )

    assert result.discovery_score == 125

    assert (
        "Explore a new category"
        in result.reasons[0]
    )

    assert any(
        "Discover news from"
        in reason
        for reason in result.reasons
    )

    assert (
        "You have not viewed this article"
        in result.reasons
    )

    assert (
        "Recently published"
        in result.reasons
    )


def test_discovery_penalizes_bookmark_and_keyword(
    test_database,
):
    service = DiscoveryService(
        test_database
    )

    article = make_article(
        title="AI market update",
        category="technology",
        country="uk",
        published_at=None,
    )

    result = service.score_article(
        article=article,
        categories={"technology"},
        countries={"uk"},
        keywords={"ai"},
        bookmarked_ids={1},
        viewed_ids={1},
    )

    assert result.discovery_score == -55

    assert (
        "Already saved"
        in result.reasons
    )


def test_discovery_without_country_preferences(
    test_database,
):
    service = DiscoveryService(
        test_database
    )

    article = make_article(
        country="france",
        published_at=None,
    )

    result = service.score_article(
        article=article,
        categories={"technology"},
        countries=set(),
        keywords=set(),
        bookmarked_ids=set(),
        viewed_ids={1},
    )

    assert (
        result.discovery_score
        == 0
    )


def test_get_discovery_articles_orders_and_filters(
    test_database,
    monkeypatch,
):
    service = DiscoveryService(
        test_database
    )

    preferences = [
        SimpleNamespace(
            preference_type="category",
            preference_value="technology",
        ),
        SimpleNamespace(
            preference_type="country",
            preference_value="uk",
        ),
        SimpleNamespace(
            preference_type="keyword",
            preference_value="ai",
        ),
    ]

    article_one = make_article(
        article_id=1,
        title="AI technology",
        category="technology",
        country="uk",
        published_at=None,
    )

    article_two = make_article(
        article_id=2,
        title="Sports update",
        category="sports",
        country="france",
        published_at=(
            datetime.now(
                timezone.utc
            )
            - timedelta(hours=2)
        ),
    )

    monkeypatch.setattr(
        service.repository,
        "get_preferences",
        lambda db, user_id: preferences,
    )

    monkeypatch.setattr(
        service.repository,
        "get_recent_articles",
        lambda db, limit: [
            article_one,
            article_two,
        ],
    )

    monkeypatch.setattr(
        service.repository,
        "get_bookmarked_article_ids",
        lambda db, user_id: set(),
    )

    monkeypatch.setattr(
        service.repository,
        "get_viewed_article_ids",
        lambda db, user_id: set(),
    )

    results = (
        service.get_discovery_articles(
            user_id=1,
            limit=10,
        )
    )

    # Article 1 scores exactly 0
    # and must therefore be filtered.
    assert len(results) == 1

    assert (
        results[0].article.id
        == 2
    )

    assert (
        results[0].discovery_score
        > 0
    )