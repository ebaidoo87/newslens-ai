from tests.helpers.articles import (
    create_article,
)

from tests.helpers.auth import (
    create_authenticated_user,
)


def test_create_bookmark(
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
            "bookmark-test"
        ),
    )

    response = client.post(
        f"/api/bookmarks/{article.id}",
        headers=auth["headers"],
    )

    assert response.status_code in {
        200,
        201,
    }

    bookmarks = client.get(
        "/api/bookmarks",
        headers=auth["headers"],
    )

    assert bookmarks.status_code == 200

    data = bookmarks.json()

    assert len(data) == 1

def test_duplicate_bookmark_not_created(
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
            "duplicate-bookmark"
        ),
    )

    first = client.post(
        f"/api/bookmarks/{article.id}",
        headers=auth["headers"],
    )

    assert first.status_code in {
        200,
        201,
    }

    second = client.post(
        f"/api/bookmarks/{article.id}",
        headers=auth["headers"],
    )

    assert second.status_code in {
        200,
        201,
        400,
        409,
    }

    response = client.get(
        "/api/bookmarks",
        headers=auth["headers"],
    )

    assert response.status_code == 200

    assert len(
        response.json()
    ) == 1


def test_delete_bookmark(
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
            "delete-bookmark"
        ),
    )

    client.post(
        f"/api/bookmarks/{article.id}",
        headers=auth["headers"],
    )

    response = client.delete(
        f"/api/bookmarks/{article.id}",
        headers=auth["headers"],
    )

    assert response.status_code in {
        200,
        204,
    }

    bookmarks = client.get(
        "/api/bookmarks",
        headers=auth["headers"],
    )

    assert bookmarks.json() == []