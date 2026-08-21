from tests.helpers.auth import (
    create_authenticated_user,
)

from tests.helpers.articles import (
    create_article,
)

from tests.helpers.auth import (
    create_authenticated_user,
)

def test_notifications_empty(
    client,
):
    auth = (
        create_authenticated_user(
            client
        )
    )

    response = client.get(
        "/api/notifications",
        headers=auth["headers"],
    )

    assert response.status_code == 200

    assert response.json() == []

def test_bookmarks_are_user_specific(
    client,
):
    user_one = (
        create_authenticated_user(
            client,
            email="one@example.com",
            username="userone",
        )
    )

    article = create_article(
        url=(
            "https://example.com/"
            "private-bookmark"
        ),
    )

    client.post(
        f"/api/bookmarks/{article.id}",
        headers=user_one["headers"],
    )

    user_two = (
        create_authenticated_user(
            client,
            email="two@example.com",
            username="usertwo",
        )
    )

    response = client.get(
        "/api/bookmarks",
        headers=user_two["headers"],
    )

    assert response.status_code == 200

    assert response.json() == []