from tests.helpers.articles import (
    create_article,
)


def test_get_articles_empty(
    client,
):
    response = client.get(
        "/api/articles"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(
        data,
        list,
    )

    assert data == []


def test_get_articles(
    client,
):
    create_article()

    response = client.get(
        "/api/articles"
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1

    article = data[0]

    assert article["title"] == (
        "AI transforms journalism"
    )

    assert article["source"] == (
        "NewsLens"
    )

    assert article["category"] == (
        "technology"
    )

def test_article_response_contract(
    client,
):
    create_article()

    response = client.get(
        "/api/articles"
    )

    assert response.status_code == 200

    article = response.json()[0]

    assert "id" in article
    assert "title" in article
    assert "url" in article
    assert "source" in article

    assert "hashed_password" not in article

def test_get_multiple_articles(
    client,
):
    create_article(
        title="AI News",
        url=(
            "https://example.com/"
            "ai-news"
        ),
        category="technology",
    )

    create_article(
        title="Markets Rally",
        url=(
            "https://example.com/"
            "markets"
        ),
        category="business",
        source="Reuters",
    )

    response = client.get(
        "/api/articles"
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2

    titles = {
        item["title"]
        for item in data
    }

    assert "AI News" in titles
    assert "Markets Rally" in titles

def test_search_articles(
    client,
):
    create_article(
        title=(
            "Artificial Intelligence "
            "Transforms Journalism"
        ),
        url=(
            "https://example.com/ai"
        ),
    )

    create_article(
        title="Global Markets Rally",
        url=(
            "https://example.com/"
            "markets"
        ),
        category="business",
    )

    response = client.get(
        "/api/articles",
        params={
            "search":
                "Artificial",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) >= 1

    titles = [
        article["title"]
        for article in data
    ]

    assert (
        "Artificial Intelligence "
        "Transforms Journalism"
        in titles
    )

def test_filter_articles_by_category(
    client,
):
    create_article(
        title="Technology Story",
        url=(
            "https://example.com/"
            "technology"
        ),
        category="technology",
    )

    create_article(
        title="Business Story",
        url=(
            "https://example.com/"
            "business"
        ),
        category="business",
    )

    response = client.get(
        "/api/articles",
        params={
            "category":
                "technology",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1

    assert data[0][
        "category"
    ] == "technology"


    assert response.status_code == 200

    data = response.json()

    assert all(
        item["language"] == "en"
        for item in data
    )

def test_get_article_by_id(
    client,
):
    article = create_article()

    response = client.get(
        f"/api/articles/{article.id}"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == (
        article.id
    )

    assert data["title"] == (
        "AI transforms journalism"
    )

def test_get_missing_article(
    client,
):
    response = client.get(
        "/api/articles/999999"
    )

    assert response.status_code == 404