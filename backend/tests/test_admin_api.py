from app.models.user import User
from app.services.admin_analytics_service import (
    AdminAnalyticsService,
)
from app.services.email_monitoring_service import (
    EmailMonitoringService,
)
from tests.database import (
    TestingSessionLocal,
)
from tests.helpers.auth import (
    auth_headers,
    create_authenticated_user,
    login_user,
)


def promote_to_admin(
    user_id: int,
):
    db = TestingSessionLocal()

    try:
        user = db.get(
            User,
            user_id,
        )

        assert user is not None

        user.role = "admin"

        db.commit()

    finally:
        db.close()


def create_admin(
    client,
    *,
    email: str = "admin@example.com",
    username: str = "admin",
):
    auth = create_authenticated_user(
        client,
        email=email,
        username=username,
    )

    promote_to_admin(
        auth["user"]["id"]
    )

    login_response = login_user(
        client,
        email=email,
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

    return {
        "user": auth["user"],
        "token": token,
        "headers": auth_headers(
            token
        ),
    }


def test_admin_endpoint_requires_authentication(
    client,
):
    response = client.get(
        "/api/admin/dashboard"
    )

    assert response.status_code == 401


def test_normal_user_cannot_access_admin_dashboard(
    client,
):
    auth = create_authenticated_user(
        client
    )

    response = client.get(
        "/api/admin/dashboard",
        headers=auth["headers"],
    )

    assert response.status_code == 403

    data = response.json()

    assert (
        data["error"]["code"]
        == "ADMIN_REQUIRED"
    )


def test_admin_dashboard(
    client,
    monkeypatch,
):
    admin = create_admin(
        client
    )

    monkeypatch.setattr(
        EmailMonitoringService,
        "get_stats",
        lambda self: {
            "pending": 1,
            "sent": 2,
            "failed": 0,
        },
    )

    response = client.get(
        "/api/admin/dashboard",
        headers=admin["headers"],
    )

    assert response.status_code == 200

    data = response.json()

    assert "users" in data
    assert "articles" in data
    assert "notifications" in data
    assert "email" in data


def test_admin_email_stats(
    client,
    monkeypatch,
):
    admin = create_admin(
        client
    )

    expected = {
        "pending": 1,
        "sent": 10,
        "failed": 2,
    }

    monkeypatch.setattr(
        EmailMonitoringService,
        "get_stats",
        lambda self: expected,
    )

    response = client.get(
        "/api/admin/email/stats",
        headers=admin["headers"],
    )

    assert response.status_code == 200
    assert response.json() == expected


def test_admin_recent_emails(
    client,
    monkeypatch,
):
    admin = create_admin(
        client
    )

    expected = [
        {
            "id": 1,
            "recipient":
                "one@example.com",
        },
        {
            "id": 2,
            "recipient":
                "two@example.com",
        },
    ]

    monkeypatch.setattr(
        EmailMonitoringService,
        "get_recent_emails",
        lambda self, limit: expected,
    )

    response = client.get(
        (
            "/api/admin/email/"
            "recent?limit=2"
        ),
        headers=admin["headers"],
    )

    assert response.status_code == 200
    assert response.json() == expected


def test_admin_system_health_healthy(
    client,
):
    admin = create_admin(
        client
    )

    response = client.get(
        "/api/admin/system/health",
        headers=admin["headers"],
    )

    assert response.status_code == 200

    assert response.json() == {
        "status": "healthy",
        "database": "connected",
    }


def test_admin_system_health_degraded(
    client,
    monkeypatch,
):
    admin = create_admin(
        client
    )

    from app.api import admin as admin_api

    original_execute = (
        admin_api.Session.execute
    )

    def fail_health_check_only(
        self,
        statement,
        *args,
        **kwargs,
    ):
        statement_text = str(
            statement
        ).strip().upper()

        if (
            statement_text
            == "SELECT 1"
        ):
            raise RuntimeError(
                "Database unavailable"
            )

        return original_execute(
            self,
            statement,
            *args,
            **kwargs,
        )

    monkeypatch.setattr(
        admin_api.Session,
        "execute",
        fail_health_check_only,
    )

    response = client.get(
        "/api/admin/system/health",
        headers=admin["headers"],
    )

    assert response.status_code == 200

    assert response.json() == {
        "status": "degraded",
        "database": "unavailable",
    }


def test_admin_user_stats(
    client,
):
    admin = create_admin(
        client
    )

    create_authenticated_user(
        client,
        email="user1@example.com",
        username="user1",
    )

    create_authenticated_user(
        client,
        email="user2@example.com",
        username="user2",
    )

    response = client.get(
        "/api/admin/users/stats",
        headers=admin["headers"],
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 3
    assert data["admins"] == 1
    assert data["users"] == 2


def test_admin_can_list_users(
    client,
):
    admin = create_admin(
        client
    )

    create_authenticated_user(
        client,
        email="member@example.com",
        username="member",
    )

    response = client.get(
        "/api/admin/users",
        headers=admin["headers"],
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2


def test_admin_can_change_user_role(
    client,
):
    admin = create_admin(
        client
    )

    user = create_authenticated_user(
        client,
        email="target@example.com",
        username="target",
    )

    response = client.patch(
        (
            "/api/admin/users/"
            f"{user['user']['id']}"
            "/role"
        ),
        headers=admin["headers"],
        json={
            "role": "admin",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["role"] == "admin"


def test_admin_cannot_change_own_role(
    client,
):
    admin = create_admin(
        client
    )

    response = client.patch(
        (
            "/api/admin/users/"
            f"{admin['user']['id']}"
            "/role"
        ),
        headers=admin["headers"],
        json={
            "role": "user",
        },
    )

    assert response.status_code == 400


def test_admin_can_suspend_user(
    client,
):
    admin = create_admin(
        client
    )

    user = create_authenticated_user(
        client,
        email="suspend@example.com",
        username="suspend",
    )

    response = client.patch(
        (
            "/api/admin/users/"
            f"{user['user']['id']}"
            "/status"
        ),
        headers=admin["headers"],
        json={
            "is_active": False,
        },
    )

    assert response.status_code == 200

    assert (
        response.json()[
            "is_active"
        ]
        is False
    )


def test_admin_can_reactivate_user(
    client,
):
    admin = create_admin(
        client
    )

    user = create_authenticated_user(
        client,
        email=(
            "reactivate@example.com"
        ),
        username="reactivate",
    )

    target_id = user["user"]["id"]

    first = client.patch(
        (
            "/api/admin/users/"
            f"{target_id}/status"
        ),
        headers=admin["headers"],
        json={
            "is_active": False,
        },
    )

    assert first.status_code == 200

    second = client.patch(
        (
            "/api/admin/users/"
            f"{target_id}/status"
        ),
        headers=admin["headers"],
        json={
            "is_active": True,
        },
    )

    assert second.status_code == 200

    assert (
        second.json()["is_active"]
        is True
    )


def test_admin_cannot_suspend_self(
    client,
):
    admin = create_admin(
        client
    )

    response = client.patch(
        (
            "/api/admin/users/"
            f"{admin['user']['id']}"
            "/status"
        ),
        headers=admin["headers"],
        json={
            "is_active": False,
        },
    )

    assert response.status_code == 400


def test_admin_can_reset_user_password(
    client,
):
    admin = create_admin(
        client
    )

    user = create_authenticated_user(
        client,
        email="reset@example.com",
        username="resetuser",
    )

    response = client.patch(
        (
            "/api/admin/users/"
            f"{user['user']['id']}"
            "/password"
        ),
        headers=admin["headers"],
        json={
            "new_password":
                "NewPassword123!",
            "confirm_new_password":
                "NewPassword123!",
        },
    )

    assert response.status_code == 200

    assert response.json() == {
        "success": True,
        "message":
            "Password reset successfully.",
    }

    login_response = login_user(
        client,
        email="reset@example.com",
        password="NewPassword123!",
    )

    assert (
        login_response.status_code
        == 200
    )


def test_admin_password_reset_rejects_mismatch(
    client,
):
    admin = create_admin(
        client
    )

    user = create_authenticated_user(
        client,
        email=(
            "mismatch@example.com"
        ),
        username="mismatch",
    )

    response = client.patch(
        (
            "/api/admin/users/"
            f"{user['user']['id']}"
            "/password"
        ),
        headers=admin["headers"],
        json={
            "new_password":
                "Password123!",
            "confirm_new_password":
                "Different123!",
        },
    )

    assert response.status_code == 400


def test_admin_can_delete_user(
    client,
):
    admin = create_admin(
        client
    )

    user = create_authenticated_user(
        client,
        email="delete@example.com",
        username="deleteuser",
    )

    user_id = user["user"]["id"]

    response = client.delete(
        (
            "/api/admin/users/"
            f"{user_id}"
        ),
        headers=admin["headers"],
    )

    assert response.status_code == 200

    assert response.json() == {
        "success": True,
        "message":
            "User account deleted.",
    }

    db = TestingSessionLocal()

    try:
        deleted = db.get(
            User,
            user_id,
        )

        assert deleted is None

    finally:
        db.close()


def test_admin_cannot_delete_self(
    client,
):
    admin = create_admin(
        client
    )

    response = client.delete(
        (
            "/api/admin/users/"
            f"{admin['user']['id']}"
        ),
        headers=admin["headers"],
    )

    assert response.status_code == 400


def test_admin_analytics_summary(
    client,
    monkeypatch,
):
    admin = create_admin(
        client
    )

    expected = {
        "total_users": 10,
        "active_users": 8,
        "total_articles": 25,
    }

    monkeypatch.setattr(
        AdminAnalyticsService,
        "get_summary",
        lambda self: expected,
    )

    response = client.get(
        "/api/admin/analytics/summary",
        headers=admin["headers"],
    )

    assert response.status_code == 200
    assert response.json() == expected