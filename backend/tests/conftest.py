import os

from dotenv import load_dotenv


# Load test-specific environment variables
# BEFORE importing anything from app.
load_dotenv(
    ".env.test",
    override=True,
)


# Ensure the application itself uses
# the isolated test database.
test_database_url = os.getenv(
    "TEST_DATABASE_URL",
    os.getenv("DATABASE_URL"),
)

if not test_database_url:
    raise RuntimeError(
        "Test database URL is not configured."
    )

os.environ[
    "DATABASE_URL"
] = test_database_url

os.environ[
    "TESTING"
] = "true"


import pytest

from fastapi.testclient import (
    TestClient,
)

from app.core.rate_limit import limiter
from app.db.session import get_db
from app.main import app

from tests.database import (
    clear_test_data,
    create_test_schema,
    drop_test_schema,
    get_test_db,
)


@pytest.fixture(
    scope="session",
    autouse=True,
)
def disable_rate_limiting():
    original_enabled = (
        limiter.enabled
    )

    limiter.enabled = False

    yield

    limiter.enabled = (
        original_enabled
    )


@pytest.fixture(
    scope="session",
    autouse=True,
)
def test_database():
    drop_test_schema()

    create_test_schema()

    yield

    drop_test_schema()


@pytest.fixture
def client():
    app.dependency_overrides[
        get_db
    ] = get_test_db

    with TestClient(
        app,
        base_url="http://localhost",
    ) as test_client:
        yield test_client

    app.dependency_overrides.clear()

@pytest.fixture(
    autouse=True,
)
def clean_database():
    clear_test_data()

    yield

    clear_test_data()

