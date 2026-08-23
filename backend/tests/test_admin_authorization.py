from tests.helpers.auth import (
    create_authenticated_user,
)

from app.models.user import User
from tests.database import (
    TestingSessionLocal,
)
from tests.helpers.auth import (
    login_user,
)



def test_normal_user_cannot_access_admin_users(
    client,
):
    auth = create_authenticated_user(
        client
    )

    response = client.get(
        "/api/admin/users",
        headers=auth["headers"],
    )

    assert response.status_code == 403



def test_admin_users_requires_authentication(
    client,
):
    response = client.get(
        "/api/admin/users"
    )

    assert response.status_code == 401


def test_admin_can_access_admin_users(
    client,
):
    auth = create_authenticated_user(
        client,
        email="admin@example.com",
        username="admin",
    )

    db = TestingSessionLocal()

    try:
        user = db.get(
            User,
            auth["user"]["id"],
        )

        assert user is not None

        user.role = "admin"

        db.commit()

    finally:
        db.close()

    login_response = login_user(
        client,
        email="admin@example.com",
        password="Password123!",
    )

    assert (
        login_response.status_code
        == 200
    )

    token = (
        login_response.json()[
            "access_token"
        ]
    )

    response = client.get(
        "/api/admin/users",
        headers={
            "Authorization":
                f"Bearer {token}"
        },
    )

    assert response.status_code == 200