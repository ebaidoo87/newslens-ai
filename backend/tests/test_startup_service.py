import pytest

from sqlalchemy import text

from app.services.startup_service import (
    StartupService,
)
from tests.database import (
    TestingSessionLocal,
)


def test_database_connection_succeeds():
    db = TestingSessionLocal()

    try:
        service = StartupService(
            db
        )

        service.check_database_connection()

    finally:
        db.close()


def test_get_database_revision(
    monkeypatch,
):
    db = TestingSessionLocal()

    class FakeResult:
        def first(self):
            return (
                "6b90357fc181",
            )

    try:
        service = StartupService(
            db
        )

        monkeypatch.setattr(
            db,
            "execute",
            lambda statement: FakeResult(),
        )

        revision = (
            service
            .get_database_revision()
        )

        assert (
            revision
            == "6b90357fc181"
        )

    finally:
        db.close()


def test_get_database_revision_returns_none_when_no_row(
    monkeypatch,
):
    db = TestingSessionLocal()

    class FakeResult:
        def first(self):
            return None

    try:
        service = StartupService(
            db
        )

        monkeypatch.setattr(
            db,
            "execute",
            lambda statement: FakeResult(),
        )

        revision = (
            service.get_database_revision()
        )

        assert revision is None

    finally:
        db.close()


def test_get_latest_revision():
    db = TestingSessionLocal()

    try:
        service = StartupService(
            db
        )

        revision = (
            service.get_latest_revision()
        )

        assert revision is not None
        assert isinstance(
            revision,
            str,
        )

    finally:
        db.close()


def test_schema_validation_passes_when_revisions_match(
    monkeypatch,
):
    db = TestingSessionLocal()

    try:
        service = StartupService(
            db
        )

        monkeypatch.setattr(
            service,
            "get_database_revision",
            lambda: "test-revision",
        )

        monkeypatch.setattr(
            service,
            "get_latest_revision",
            lambda: "test-revision",
        )

        service.validate_schema()

    finally:
        db.close()


def test_schema_validation_fails_when_revisions_differ(
    monkeypatch,
):
    db = TestingSessionLocal()

    try:
        service = StartupService(
            db
        )

        monkeypatch.setattr(
            service,
            "get_database_revision",
            lambda: "old-revision",
        )

        monkeypatch.setattr(
            service,
            "get_latest_revision",
            lambda: "new-revision",
        )

        with pytest.raises(
            RuntimeError
        ) as error:
            service.validate_schema()

        assert (
            "Database schema is not "
            "up to date"
            in str(error.value)
        )

        assert (
            "old-revision"
            in str(error.value)
        )

        assert (
            "new-revision"
            in str(error.value)
        )

    finally:
        db.close()