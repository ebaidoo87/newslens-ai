from app.models.user import User

from tests.database import (
    TestingSessionLocal,
)

def register_user(
    client,
    *,
    email: str = "testuser@example.com",
    username: str = "testuser",
    password: str = "Password123!",
):
    return client.post(
        "/api/auth/register",
        json={
            "email": email,
            "username": username,
            "password": password,
        },
    )


def login_user(
    client,
    *,
    email: str = "testuser@example.com",
    password: str = "Password123!",
):
    return client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": password,
        },
    )


def auth_headers(
    token: str,
) -> dict[str, str]:
    return {
        "Authorization":
            f"Bearer {token}"
    }

def test_get_current_user(
    client,
):
    register_user(
        client
    )

    login_response = login_user(
        client
    )

    token = (
        login_response.json()[
            "access_token"
        ]
    )

    response = client.get(
        "/api/auth/me",
        headers=auth_headers(
            token
        ),
    )

    assert response.status_code == 200

    data = response.json()

    assert data["email"] == (
        "testuser@example.com"
    )

    assert data["username"] == (
        "testuser"
    )

def test_get_current_user_without_token(
    client,
):
    response = client.get(
        "/api/auth/me"
    )

    assert response.status_code == 401

def test_update_profile(
    client,
):
    register_user(
        client
    )

    login_response = login_user(
        client
    )

    token = (
        login_response.json()[
            "access_token"
        ]
    )

    response = client.patch(
        "/api/auth/me",
        headers=auth_headers(
            token
        ),
        json={
            "username":
                "updateduser",
            "current_password":
                "Password123!",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["username"] == (
        "updateduser"
    )

def test_change_password(
    client,
):
    register_user(
        client
    )

    login_response = login_user(
        client
    )

    token = (
        login_response.json()[
            "access_token"
        ]
    )

    response = client.patch(
        "/api/auth/password",
        headers=auth_headers(
            token
        ),
        json={
            "current_password":
                "Password123!",
            "new_password":
                "NewPassword123!",
            "confirm_new_password":
                "NewPassword123!",
        },
    )

    assert response.status_code == 204

def test_old_password_fails_after_change(
    client,
):
    register_user(
        client
    )

    login_response = login_user(
        client
    )

    token = (
        login_response.json()[
            "access_token"
        ]
    )

    client.patch(
        "/api/auth/password",
        headers=auth_headers(
            token
        ),
        json={
            "current_password":
                "Password123!",
            "new_password":
                "NewPassword123!",
            "confirm_new_password":
                "NewPassword123!",
        },
    )

    old_login = login_user(
        client,
        password="Password123!",
    )

    assert old_login.status_code == 401

    new_login = login_user(
        client,
        password="NewPassword123!",
    )

    assert new_login.status_code == 200

def test_password_change_invalidates_old_token(
    client,
):
    register_user(
        client
    )

    login_response = login_user(
        client
    )

    token = (
        login_response.json()[
            "access_token"
        ]
    )

    response = client.patch(
        "/api/auth/password",
        headers=auth_headers(
            token
        ),
        json={
            "current_password":
                "Password123!",
            "new_password":
                "NewPassword123!",
            "confirm_new_password":
                "NewPassword123!",
        },
    )

    assert response.status_code == 204

    old_token_response = client.get(
        "/api/auth/me",
        headers=auth_headers(
            token
        ),
    )

    assert (
        old_token_response.status_code
        == 401
    )

def test_logout_all_invalidates_token(
    client,
):
    register_user(
        client
    )

    login_response = login_user(
        client
    )

    token = (
        login_response.json()[
            "access_token"
        ]
    )

    response = client.post(
        "/api/auth/logout-all",
        headers=auth_headers(
            token
        ),
    )

    assert response.status_code == 204

    me_response = client.get(
        "/api/auth/me",
        headers=auth_headers(
            token
        ),
    )

    assert me_response.status_code == 401


def test_suspended_user_cannot_login(
    client,
):
    register_user(
        client
    )

    db = TestingSessionLocal()

    try:
        user = (
            db.query(User)
            .filter(
                User.email
                == "testuser@example.com"
            )
            .first()
        )

        assert user is not None

        user.is_active = False

        db.commit()

    finally:
        db.close()

    response = login_user(
        client
    )

    assert response.status_code == 401