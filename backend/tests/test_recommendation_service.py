from datetime import (
    datetime,
    timezone,
)
from types import SimpleNamespace

from app.models.article import Article
from app.services.recommendation_service import (
    RecommendationService,
)


def make_article(
    article_id=1,
    title="AI breakthrough",
    summary="Technology update",
    content="Artificial intelligence",
    category="technology",
    country="uk",
):
    return Article(
        id=article_id,
        title=title,
        summary=summary,
        content=content,
        url=(
            f"https://example.com/"
            f"recommendation-{article_id}"
        ),
        source="NewsLens",
        category=category,
        country=country,
        language="en",
        published_at=None,
        created_at=datetime.now(
            timezone.utc
        ),
    )


def test_normalize_text():
    assert (
        RecommendationService
        .normalize_text(
            " AI News "
        )
        == "ai news"
    )

    assert (
        RecommendationService
        .normalize_text(None)
        == ""
    )


def test_recommendation_scores_category_country_and_title_keyword(
    test_database,
):
    service = RecommendationService(
        test_database
    )

    article = make_article(
        title="Major AI breakthrough",
    )

    result = service.score_article(
        article=article,
        categories={"technology"},
        countries={"uk"},
        keywords={"ai"},
        bookmarked_ids=set(),
        viewed_ids=set(),
    )

    assert result.score == 115

    assert any(
        "preferred category"
        in reason
        for reason in result.reasons
    )

    assert any(
        "preferred country"
        in reason
        for reason in result.reasons
    )

    assert any(
        'Keyword "ai"'
        in reason
        for reason in result.reasons
    )


def test_summary_keyword_score(
    test_database,
):
    service = RecommendationService(
        test_database
    )

    article = make_article(
        title="World update",
        summary="Major climate development",
        content="General report",
        category="general",
        country="global",
    )

    result = service.score_article(
        article=article,
        categories=set(),
        countries=set(),
        keywords={"climate"},
        bookmarked_ids=set(),
        viewed_ids=set(),
    )

    assert result.score == 30


def test_content_keyword_score(
    test_database,
):
    service = RecommendationService(
        test_database
    )

    article = make_article(
        title="World update",
        summary="Latest report",
        content=(
            "Researchers discuss quantum "
            "computing."
        ),
        category="general",
        country="global",
    )

    result = service.score_article(
        article=article,
        categories=set(),
        countries=set(),
        keywords={"quantum"},
        bookmarked_ids=set(),
        viewed_ids=set(),
    )

    assert result.score == 15


def test_bookmark_bonus_and_view_penalty(
    test_database,
):
    service = RecommendationService(
        test_database
    )

    article = make_article()

    result = service.score_article(
        article=article,
        categories=set(),
        countries=set(),
        keywords=set(),
        bookmarked_ids={1},
        viewed_ids={1},
    )

    assert result.score == -10

    assert (
        "Previously bookmarked"
        in result.reasons
    )

    assert (
        "Previously viewed"
        in result.reasons
    )


def test_get_recommendations_returns_positive_scores(
    test_database,
    monkeypatch,
):
    service = RecommendationService(
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

    strong = make_article(
        article_id=1,
        title="AI breakthrough",
    )

    weak = make_article(
        article_id=2,
        title="Sports report",
        summary="Football",
        content="Match results",
        category="sports",
        country="france",
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
            weak,
            strong,
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
        service.get_recommendations(
            user_id=1
        )
    )

    assert len(results) == 1

    assert (
        results[0].article.id
        == 1
    )

    assert (
        results[0].score
        > 0
    )


def test_new_user_receives_articles_without_preferences(
    test_database,
    monkeypatch,
):
    service = RecommendationService(
        test_database
    )

    article_one = make_article(
        article_id=1,
        title="Article one",
    )

    article_two = make_article(
        article_id=2,
        title="Article two",
    )

    monkeypatch.setattr(
        service.repository,
        "get_preferences",
        lambda db, user_id: [],
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
        service.get_recommendations(
            user_id=1,
            limit=2,
        )
    )

    assert len(results) == 2