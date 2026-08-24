from datetime import datetime

import pytest
from langdetect import LangDetectException

from app.models.article import Article
from app.services.import_service import (
    ImportService,
)


def make_provider_article(
    *,
    title="AI transforms journalism",
    description=(
        "Artificial intelligence is "
        "reshaping modern journalism."
    ),
    content=(
        "Artificial intelligence tools "
        "are increasingly used by "
        "newsrooms around the world."
    ),
    url=(
        "https://example.com/"
        "ai-journalism"
    ),
    source_name="Unknown Source",
    author="Test Author",
    published_at=(
        "2026-08-24T10:00:00Z"
    ),
):
    return {
        "title": title,
        "description": description,
        "content": content,
        "url": url,
        "urlToImage": (
            "https://example.com/"
            "image.jpg"
        ),
        "author": author,
        "publishedAt": published_at,
        "source": {
            "name": source_name,
        },
    }


def test_parse_published_at_valid():
    result = (
        ImportService
        .parse_published_at(
            "2026-08-24T10:00:00Z"
        )
    )

    assert isinstance(
        result,
        datetime,
    )

    assert result.year == 2026
    assert result.month == 8
    assert result.day == 24


def test_parse_published_at_none():
    assert (
        ImportService
        .parse_published_at(None)
        is None
    )


def test_parse_published_at_invalid():
    assert (
        ImportService
        .parse_published_at(
            "not-a-date"
        )
        is None
    )


def test_short_text_is_treated_as_english():
    result = (
        ImportService
        .is_english_article(
            title="Short news",
            summary=None,
            content=None,
        )
    )

    assert result is True


def test_english_article_detected():
    result = (
        ImportService
        .is_english_article(
            title=(
                "Artificial intelligence "
                "continues to transform "
                "global journalism"
            ),
            summary=(
                "Newsrooms are adopting "
                "new technology across "
                "many countries."
            ),
            content=(
                "Editors and reporters "
                "are experimenting with "
                "artificial intelligence "
                "tools in daily work."
            ),
        )
    )

    assert result is True


def test_non_english_article_detected():
    result = (
        ImportService
        .is_english_article(
            title=(
                "Les nouvelles technologies "
                "transforment le journalisme"
            ),
            summary=(
                "Les rédactions utilisent "
                "de plus en plus de nouveaux "
                "outils numériques."
            ),
            content=(
                "Les journalistes adoptent "
                "ces technologies dans leur "
                "travail quotidien."
            ),
        )
    )

    assert result is False


def test_language_detection_exception_returns_false(
    monkeypatch,
):
    def fail_detect(
        text,
    ):
        raise LangDetectException(
            code=0,
            message="Detection failed",
        )

    monkeypatch.setattr(
        "app.services.import_service.detect",
        fail_detect,
    )

    result = (
        ImportService
        .is_english_article(
            title=(
                "This text is deliberately "
                "long enough to trigger "
                "language detection."
            ),
            summary=(
                "Additional words ensure "
                "the minimum text length "
                "is exceeded."
            ),
            content=(
                "More article content is "
                "included for the test."
            ),
        )
    )

    assert result is False


@pytest.mark.anyio
async def test_import_rejects_unsupported_category(
    test_database,
):
    service = ImportService(
        test_database
    )

    with pytest.raises(
        ValueError,
        match=(
            "Unsupported news category"
        ),
    ):
        await service.import_articles(
            "not-a-real-category"
        )


@pytest.mark.anyio
async def test_import_empty_provider_result(
    test_database,
    monkeypatch,
):
    service = ImportService(
        test_database
    )

    async def fake_search_articles(
        *,
        query,
    ):
        return {
            "articles": [],
        }

    monkeypatch.setattr(
        service.provider,
        "search_articles",
        fake_search_articles,
    )

    result = (
        await service.import_articles(
            "technology"
        )
    )

    assert (
        result["category"]
        == "technology"
    )
    assert result["received"] == 0
    assert result["imported"] == 0
    assert result["skipped"] == 0
    assert (
        result["language_skipped"]
        == 0
    )
    assert (
        result[
            "notifications_created"
        ]
        == 0
    )
    assert result["countries"] == {}


@pytest.mark.anyio
async def test_import_skips_missing_url(
    test_database,
    monkeypatch,
):
    service = ImportService(
        test_database
    )

    item = make_provider_article()
    item["url"] = None

    async def fake_search_articles(
        *,
        query,
    ):
        return {
            "articles": [
                item
            ],
        }

    monkeypatch.setattr(
        service.provider,
        "search_articles",
        fake_search_articles,
    )

    result = (
        await service.import_articles(
            "technology"
        )
    )

    assert result["received"] == 1
    assert result["imported"] == 0
    assert result["skipped"] == 1


@pytest.mark.anyio
async def test_import_skips_missing_title(
    test_database,
    monkeypatch,
):
    service = ImportService(
        test_database
    )

    item = make_provider_article()
    item["title"] = None

    async def fake_search_articles(
        *,
        query,
    ):
        return {
            "articles": [
                item
            ],
        }

    monkeypatch.setattr(
        service.provider,
        "search_articles",
        fake_search_articles,
    )

    result = (
        await service.import_articles(
            "technology"
        )
    )

    assert result["received"] == 1
    assert result["imported"] == 0
    assert result["skipped"] == 1


@pytest.mark.anyio
async def test_import_skips_non_english_article(
    test_database,
    monkeypatch,
):
    service = ImportService(
        test_database
    )

    item = make_provider_article(
        title=(
            "Les nouvelles technologies "
            "transforment le journalisme"
        ),
        description=(
            "Les rédactions utilisent "
            "de nouveaux outils."
        ),
        content=(
            "Les journalistes adoptent "
            "rapidement ces technologies "
            "dans leur travail quotidien."
        ),
    )

    async def fake_search_articles(
        *,
        query,
    ):
        return {
            "articles": [
                item
            ],
        }

    monkeypatch.setattr(
        service.provider,
        "search_articles",
        fake_search_articles,
    )

    result = (
        await service.import_articles(
            "technology"
        )
    )

    assert result["received"] == 1
    assert result["imported"] == 0
    assert result["skipped"] == 1

    assert (
        result["language_skipped"]
        == 1
    )


@pytest.mark.anyio
async def test_import_skips_duplicate_article(
    test_database,
    monkeypatch,
):
    service = ImportService(
        test_database
    )

    item = make_provider_article()

    async def fake_search_articles(
        *,
        query,
    ):
        return {
            "articles": [
                item
            ],
        }

    monkeypatch.setattr(
        service.provider,
        "search_articles",
        fake_search_articles,
    )

    monkeypatch.setattr(
        service.repository,
        "get_by_url",
        lambda db, url: Article(
            id=999,
            title="Existing",
            url=url,
            source="Existing",
            category="technology",
            country="global",
            language="en",
        ),
    )

    result = (
        await service.import_articles(
            "technology"
        )
    )

    assert result["received"] == 1
    assert result["imported"] == 0
    assert result["skipped"] == 1


@pytest.mark.anyio
async def test_import_valid_article(
    test_database,
    monkeypatch,
):
    service = ImportService(
        test_database
    )

    item = make_provider_article(
        url=(
            "https://example.com/"
            "valid-import"
        ),
    )

    async def fake_search_articles(
        *,
        query,
    ):
        return {
            "articles": [
                item
            ],
        }

    created = []

    monkeypatch.setattr(
        service.provider,
        "search_articles",
        fake_search_articles,
    )

    monkeypatch.setattr(
        service.repository,
        "get_by_url",
        lambda db, url: None,
    )

    def fake_create(
        db,
        article,
    ):
        article.id = 101
        created.append(article)
        return article

    monkeypatch.setattr(
        service.repository,
        "create",
        fake_create,
    )

    monkeypatch.setattr(
        service.notification_service,
        "create_article_notifications",
        lambda article: 2,
    )

    result = (
        await service.import_articles(
            "technology"
        )
    )

    assert result["received"] == 1
    assert result["imported"] == 1
    assert result["skipped"] == 0

    assert (
        result[
            "notifications_created"
        ]
        == 2
    )

    # example.com has no specific
    # source/domain mapping here, so
    # metadata falls back to global.
    assert result["countries"] == {
        "global": 1,
    }

    assert len(created) == 1

    article = created[0]

    assert (
        article.title
        == "AI transforms journalism"
    )
    assert article.language == "en"
    assert (
        article.category
        == "technology"
    )
    assert (
        article.country
        == "global"
    )
    assert (
        article.source
        == "Unknown Source"
    )
    assert (
        article.author
        == "Test Author"
    )
    assert (
        article.image_url
        == (
            "https://example.com/"
            "image.jpg"
        )
    )
    assert (
        article.published_at
        is not None
    )


@pytest.mark.anyio
async def test_import_multiple_articles_produces_correct_totals(
    test_database,
    monkeypatch,
):
    service = ImportService(
        test_database
    )

    valid = make_provider_article(
        url=(
            "https://example.com/"
            "mixed-valid"
        ),
    )

    duplicate = make_provider_article(
        title=(
            "Existing article with "
            "enough English text"
        ),
        url=(
            "https://example.com/"
            "mixed-duplicate"
        ),
    )

    missing_url = (
        make_provider_article(
            title=(
                "Missing URL article "
                "with valid English text"
            ),
        )
    )
    missing_url["url"] = None

    non_english = (
        make_provider_article(
            title=(
                "Les technologies "
                "transforment profondément "
                "le journalisme moderne"
            ),
            description=(
                "Les rédactions adoptent "
                "de nouveaux outils."
            ),
            content=(
                "Les journalistes utilisent "
                "ces solutions dans leur "
                "travail quotidien."
            ),
            url=(
                "https://example.com/"
                "mixed-french"
            ),
        )
    )

    async def fake_search_articles(
        *,
        query,
    ):
        return {
            "articles": [
                valid,
                duplicate,
                missing_url,
                non_english,
            ],
        }

    monkeypatch.setattr(
        service.provider,
        "search_articles",
        fake_search_articles,
    )

    def fake_get_by_url(
        db,
        url,
    ):
        if (
            url
            == (
                "https://example.com/"
                "mixed-duplicate"
            )
        ):
            return Article(
                id=500,
                title="Existing",
                url=url,
                source="Existing",
                category="technology",
                country="global",
                language="en",
            )

        return None

    monkeypatch.setattr(
        service.repository,
        "get_by_url",
        fake_get_by_url,
    )

    def fake_create(
        db,
        article,
    ):
        article.id = 201
        return article

    monkeypatch.setattr(
        service.repository,
        "create",
        fake_create,
    )

    monkeypatch.setattr(
        service.notification_service,
        "create_article_notifications",
        lambda article: 3,
    )

    result = (
        await service.import_articles(
            "technology"
        )
    )

    assert result["received"] == 4
    assert result["imported"] == 1
    assert result["skipped"] == 3

    assert (
        result["language_skipped"]
        == 1
    )

    assert (
        result[
            "notifications_created"
        ]
        == 3
    )

    assert result["countries"] == {
        "global": 1,
    }