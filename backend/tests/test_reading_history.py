from tests.helpers.articles import (
    create_article,
)

from tests.helpers.auth import (
    create_authenticated_user,
)


def test_reading_history_empty(
    client,
):
    auth = (
        create_authenticated_user(
            client
        )
    )

    response = client.get(
        "/api/history",
        headers=auth["headers"],
    )

    assert response.status_code == 200
    assert response.json() == []


def test_add_reading_history(
    client,
):
    auth = (
        create_authenticated_user(
            client
        )
    )

    article = create_article(
        url=(
            "https://example.com/"
            "reading-history"
        ),
    )

    response = client.post(
        f"/api/history/{article.id}",
        headers=auth["headers"],
    )

    assert response.status_code == 201

    history = client.get(
        "/api/history",
        headers=auth["headers"],
    )

    assert history.status_code == 200

    data = history.json()

    assert len(data) == 1


def test_clear_reading_history(
    client,
):
    auth = (
        create_authenticated_user(
            client
        )
    )

    article = create_article(
        url=(
            "https://example.com/"
            "clear-history"
        ),
    )

    client.post(
        f"/api/history/{article.id}",
        headers=auth["headers"],
    )

    response = client.delete(
        "/api/history",
        headers=auth["headers"],
    )

    assert response.status_code == 204

    history = client.get(
        "/api/history",
        headers=auth["headers"],
    )

    assert history.status_code == 200
    assert history.json() == []


def test_reading_history_requires_authentication(
    client,
):
    response = client.get(
        "/api/history"
    )

    assert response.status_code == 401