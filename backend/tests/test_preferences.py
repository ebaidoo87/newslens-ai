from tests.helpers.auth import (
    create_authenticated_user,
)


def test_get_preferences(
    client,
):
    auth = create_authenticated_user(
        client
    )

    response = client.get(
        "/api/preferences",
        headers=auth["headers"],
    )

    assert response.status_code == 200

    data = response.json()

    assert "preferences" in data
    assert isinstance(
        data["preferences"],
        list,
    )


def test_create_preference(
    client,
):
    auth = create_authenticated_user(
        client
    )

    response = client.put(
        "/api/preferences",
        headers=auth["headers"],
        json={
            "preferences": [
                {
                    "preference_type":
                        "category",
                    "preference_value":
                        "technology",
                }
            ]
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(
        data["preferences"]
    ) == 1

    assert (
        data["preferences"][0][
            "preference_type"
        ]
        == "category"
    )

    assert (
        data["preferences"][0][
            "preference_value"
        ]
        == "technology"
    )


def test_replace_preferences(
    client,
):
    auth = create_authenticated_user(
        client
    )

    client.put(
        "/api/preferences",
        headers=auth["headers"],
        json={
            "preferences": [
                {
                    "preference_type":
                        "category",
                    "preference_value":
                        "technology",
                }
            ]
        },
    )

    response = client.put(
        "/api/preferences",
        headers=auth["headers"],
        json={
            "preferences": [
                {
                    "preference_type":
                        "category",
                    "preference_value":
                        "business",
                }
            ]
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(
        data["preferences"]
    ) == 1

    assert (
        data["preferences"][0][
            "preference_value"
        ]
        == "business"
    )


def test_delete_preferences(
    client,
):
    auth = create_authenticated_user(
        client
    )

    client.put(
        "/api/preferences",
        headers=auth["headers"],
        json={
            "preferences": [
                {
                    "preference_type":
                        "category",
                    "preference_value":
                        "technology",
                }
            ]
        },
    )

    response = client.delete(
        "/api/preferences",
        headers=auth["headers"],
    )

    assert response.status_code == 204

    get_response = client.get(
        "/api/preferences",
        headers=auth["headers"],
    )

    assert (
        get_response.status_code
        == 200
    )

    assert (
        get_response.json()[
            "preferences"
        ]
        == []
    )


def test_preferences_require_authentication(
    client,
):
    response = client.get(
        "/api/preferences"
    )

    assert response.status_code == 401