from tests.helpers.auth import (
    auth_headers,
    login_user,
    register_user,
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