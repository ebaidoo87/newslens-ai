from tests.helpers.auth import (
    auth_headers,
    login_user,
    register_user,
)

from app.models.user import User
from tests.database import (
    TestingSessionLocal,
)


def test_register_user(
    client,
):
    response = register_user(
        client
    )

    assert response.status_code == 201

    data = response.json()

    assert data["email"] == (
        "testuser@example.com"
    )

    assert data["username"] == (
        "testuser"
    )

    assert "hashed_password" not in data
    assert "password" not in data

def test_register_duplicate_email(
    client,
):
    register_user(
        client
    )

    response = register_user(
        client,
        username="seconduser",
    )

    assert response.status_code == 409

def test_register_duplicate_username(   
    client,
):
    register_user(
        client
    )

    response = register_user(
        client,
        email="different@example.com",
    )

    assert response.status_code == 409


def test_login_user(
    client,
):
    register_user(
        client
    )

    response = login_user(
        client
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data

    assert data["token_type"] == (
        "bearer"
    )

    assert len(
        data["access_token"]
    ) > 20

def test_login_wrong_password(
    client,
):
    register_user(
        client
    )

    response = login_user(
        client,
        password="WrongPassword123!",
    )

    assert response.status_code == 401

def test_login_unknown_user(
    client,
):
    response = login_user(
        client,
        email="missing@example.com",
    )

    assert response.status_code == 401

def get_token(
    client,
    *,
    email="testuser@example.com",
    username="testuser",
    password="Password123!",
):
    register_user(
        client,
        email=email,
        username=username,
        password=password,
    )

    response = login_user(
        client,
        email=email,
        password=password,
    )

    assert response.status_code == 200

    return response.json()[
        "access_token"
    ]


def test_get_current_user(
    client,
):
    token = get_token(
        client
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


def test_update_profile_username(
    client,
):
    token = get_token(
        client
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

    assert (
        response.json()["username"]
        == "updateduser"
    )

def test_update_profile_wrong_password(
    client,
):
    token = get_token(
        client
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
                "WrongPassword123!",
        },
    )

    assert response.status_code == 400

def test_change_password(
    client,
):
    token = get_token(
        client
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

def test_password_change_updates_login(
    client,
):
    token = get_token(
        client
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

def test_change_password_wrong_current_password(
    client,
):
    token = get_token(
        client
    )

    response = client.patch(
        "/api/auth/password",
        headers=auth_headers(
            token
        ),
        json={
            "current_password":
                "WrongPassword123!",
            "new_password":
                "NewPassword123!",
            "confirm_new_password":
                "NewPassword123!",
        },
    )

    assert response.status_code == 400

def test_change_password_confirmation_mismatch(
    client,
):
    token = get_token(
        client
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
                "DifferentPassword123!",
        },
    )

    assert response.status_code == 400


def test_password_change_invalidates_old_token(
    client,
):
    token = get_token(
        client
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

    response = client.get(
        "/api/auth/me",
        headers=auth_headers(
            token
        ),
    )

    assert response.status_code == 401


def test_logout_all_invalidates_token(
    client,
):
    token = get_token(
        client
    )

    response = client.post(
        "/api/auth/logout-all",
        headers=auth_headers(
            token
        ),
    )

    assert response.status_code == 204

    response = client.get(
        "/api/auth/me",
        headers=auth_headers(
            token
        ),
    )

    assert response.status_code == 401

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

