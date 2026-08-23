from app.services.health_service import (
    HealthService,
)

from tests.database import (
    TestingSessionLocal,
)
from tests.helpers.articles import (
    create_article,
)
from tests.helpers.auth import (
    create_authenticated_user,
)


def test_database_health():
    db = TestingSessionLocal()

    try:
        service = HealthService(
            db
        )

        result = (
            service.check_database()
        )

        assert (
            result["status"]
            == "healthy"
        )

        assert (
            "latency_ms"
            in result
        )

        assert (
            result["latency_ms"]
            >= 0
        )

    finally:
        db.close()


def test_database_health_failure(
    monkeypatch,
):
    db = TestingSessionLocal()

    try:
        service = HealthService(
            db
        )

        def fail_execute(
            statement,
        ):
            raise RuntimeError(
                "Database unavailable"
            )

        monkeypatch.setattr(
            db,
            "execute",
            fail_execute,
        )

        result = (
            service.check_database()
        )

        assert (
            result["status"]
            == "unhealthy"
        )

        assert (
            result["error"]
            == "Database unavailable"
        )

    finally:
        db.close()


def test_article_health_count(
    client,
):
    create_article(
        url=(
            "https://example.com/"
            "health-article"
        ),
    )

    db = TestingSessionLocal()

    try:
        service = HealthService(
            db
        )

        result = (
            service.check_articles()
        )

        assert (
            result["status"]
            == "healthy"
        )

        assert result["count"] == 1

    finally:
        db.close()


def test_article_health_failure(
    monkeypatch,
):
    db = TestingSessionLocal()

    try:
        service = HealthService(
            db
        )

        class BrokenQuery:
            def count(self):
                raise RuntimeError(
                    "Article query failed"
                )

        monkeypatch.setattr(
            db,
            "query",
            lambda model: BrokenQuery(),
        )

        result = (
            service.check_articles()
        )

        assert (
            result["status"]
            == "unhealthy"
        )

        assert (
            result["error"]
            == "Article query failed"
        )

    finally:
        db.close()


def test_user_health_count(
    client,
):
    create_authenticated_user(
        client
    )

    db = TestingSessionLocal()

    try:
        service = HealthService(
            db
        )

        result = (
            service.check_users()
        )

        assert (
            result["status"]
            == "healthy"
        )

        assert result["count"] == 1

    finally:
        db.close()


def test_user_health_failure(
    monkeypatch,
):
    db = TestingSessionLocal()

    try:
        service = HealthService(
            db
        )

        class BrokenQuery:
            def count(self):
                raise RuntimeError(
                    "User query failed"
                )

        monkeypatch.setattr(
            db,
            "query",
            lambda model: BrokenQuery(),
        )

        result = (
            service.check_users()
        )

        assert (
            result["status"]
            == "unhealthy"
        )

        assert (
            result["error"]
            == "User query failed"
        )

    finally:
        db.close()


def test_readiness_true_when_database_healthy(
    monkeypatch,
):
    db = TestingSessionLocal()

    try:
        service = HealthService(
            db
        )

        monkeypatch.setattr(
            service,
            "check_database",
            lambda: {
                "status": "healthy",
            },
        )

        assert (
            service.readiness()
            is True
        )

    finally:
        db.close()


def test_readiness_false_when_database_unhealthy(
    monkeypatch,
):
    db = TestingSessionLocal()

    try:
        service = HealthService(
            db
        )

        monkeypatch.setattr(
            service,
            "check_database",
            lambda: {
                "status": "unhealthy",
            },
        )

        assert (
            service.readiness()
            is False
        )

    finally:
        db.close()


def test_health_details(
    monkeypatch,
):
    db = TestingSessionLocal()

    try:
        service = HealthService(
            db
        )

        monkeypatch.setattr(
            service,
            "check_database",
            lambda: {
                "status": "healthy",
                "latency_ms": 1.5,
            },
        )

        monkeypatch.setattr(
            service,
            "check_users",
            lambda: {
                "status": "healthy",
                "count": 2,
            },
        )

        monkeypatch.setattr(
            service,
            "check_articles",
            lambda: {
                "status": "healthy",
                "count": 5,
            },
        )

        result = service.details()

        assert (
            result["status"]
            == "healthy"
        )

        assert (
            result["users"]["count"]
            == 2
        )

        assert (
            result["articles"]["count"]
            == 5
        )

        assert (
            "python"
            in result["runtime"]
        )

        assert (
            "platform"
            in result["runtime"]
        )

    finally:
        db.close()


def test_health_details_unhealthy_when_database_fails(
    monkeypatch,
):
    db = TestingSessionLocal()

    try:
        service = HealthService(
            db
        )

        monkeypatch.setattr(
            service,
            "check_database",
            lambda: {
                "status": "unhealthy",
                "error": "DB down",
            },
        )

        monkeypatch.setattr(
            service,
            "check_users",
            lambda: {
                "status": "healthy",
                "count": 0,
            },
        )

        monkeypatch.setattr(
            service,
            "check_articles",
            lambda: {
                "status": "healthy",
                "count": 0,
            },
        )

        result = service.details()

        assert (
            result["status"]
            == "unhealthy"
        )

    finally:
        db.close()