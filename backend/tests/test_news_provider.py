from unittest.mock import AsyncMock, MagicMock

import httpx
import pytest

from app.services.news_provider import (
    NewsProvider,
)


def make_response(
    status_code: int,
) -> httpx.Response:
    """
    Create a real HTTPX response with a
    request attached so raise_for_status()
    behaves normally.
    """
    request = httpx.Request(
        "GET",
        "https://example.com/everything",
    )

    return httpx.Response(
        status_code=status_code,
        request=request,
    )


def test_check_response_accepts_success():
    response = make_response(200)

    NewsProvider._check_response(
        response
    )


def test_check_response_rejects_rate_limit():
    response = make_response(429)

    with pytest.raises(
        RuntimeError,
        match="request limit reached",
    ):
        NewsProvider._check_response(
            response
        )


def test_check_response_rejects_invalid_api_key():
    response = make_response(401)

    with pytest.raises(
        RuntimeError,
        match="rejected the API key",
    ):
        NewsProvider._check_response(
            response
        )


def test_check_response_rejects_subscription_error():
    response = make_response(426)

    with pytest.raises(
        RuntimeError,
        match="different subscription plan",
    ):
        NewsProvider._check_response(
            response
        )


def test_check_response_raises_for_other_http_errors():
    response = make_response(500)

    with pytest.raises(
        httpx.HTTPStatusError
    ):
        NewsProvider._check_response(
            response
        )


@pytest.mark.anyio
async def test_search_articles_returns_provider_response(
    monkeypatch,
):
    payload = {
        "status": "ok",
        "totalResults": 1,
        "articles": [
            {
                "title": "AI transforms news",
                "url": (
                    "https://example.com/article"
                ),
            }
        ],
    }

    response = MagicMock()
    response.status_code = 200
    response.json.return_value = payload

    mock_client = MagicMock()

    mock_client.get = AsyncMock(
        return_value=response
    )

    context_manager = MagicMock()

    context_manager.__aenter__ = (
        AsyncMock(
            return_value=mock_client
        )
    )

    context_manager.__aexit__ = (
        AsyncMock(
            return_value=None
        )
    )

    monkeypatch.setattr(
        "app.services.news_provider."
        "httpx.AsyncClient",
        MagicMock(
            return_value=context_manager
        ),
    )

    monkeypatch.setattr(
        NewsProvider,
        "_check_response",
        MagicMock(),
    )

    provider = NewsProvider()

    result = await provider.search_articles(
        query="artificial intelligence",
        language="en",
        page_size=10,
    )

    assert result == payload

    mock_client.get.assert_awaited_once()

    call = (
        mock_client.get.await_args
    )

    assert (
        call.args[0]
        == "/everything"
    )

    assert (
        call.kwargs["params"]["q"]
        == "artificial intelligence"
    )

    assert (
        call.kwargs["params"]["language"]
        == "en"
    )

    assert (
        call.kwargs["params"]["sortBy"]
        == "publishedAt"
    )

    assert (
        call.kwargs["params"]["pageSize"]
        == 10
    )

    assert (
        "X-Api-Key"
        in call.kwargs["headers"]
    )


@pytest.mark.anyio
async def test_search_articles_uses_defaults(
    monkeypatch,
):
    payload = {
        "status": "ok",
        "articles": [],
    }

    response = MagicMock()
    response.status_code = 200
    response.json.return_value = payload

    mock_client = MagicMock()

    mock_client.get = AsyncMock(
        return_value=response
    )

    context_manager = MagicMock()

    context_manager.__aenter__ = (
        AsyncMock(
            return_value=mock_client
        )
    )

    context_manager.__aexit__ = (
        AsyncMock(
            return_value=None
        )
    )

    monkeypatch.setattr(
        "app.services.news_provider."
        "httpx.AsyncClient",
        MagicMock(
            return_value=context_manager
        ),
    )

    monkeypatch.setattr(
        NewsProvider,
        "_check_response",
        MagicMock(),
    )

    provider = NewsProvider()

    result = await provider.search_articles(
        query="technology"
    )

    assert result == payload

    call = (
        mock_client.get.await_args
    )

    assert (
        call.kwargs["params"]["language"]
        == "en"
    )

    assert (
        call.kwargs["params"]["pageSize"]
        == 20
    )