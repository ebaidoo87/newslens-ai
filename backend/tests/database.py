import os

from sqlalchemy import create_engine
from sqlalchemy.orm import (
    Session,
    sessionmaker,
)

from app.db.base import Base


TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    (
        "postgresql+psycopg://"
        "postgres:postgres@"
        "localhost:5432/"
        "newslens_test"
    ),
)


test_engine = create_engine(
    TEST_DATABASE_URL,
    echo=False,
)


TestingSessionLocal = sessionmaker(
    bind=test_engine,
    autoflush=False,
    autocommit=False,
)


def create_test_schema() -> None:
    Base.metadata.create_all(
        bind=test_engine
    )


def drop_test_schema() -> None:
    Base.metadata.drop_all(
        bind=test_engine
    )


def get_test_db():
    db: Session = (
        TestingSessionLocal()
    )

    try:
        yield db

    finally:
        db.close()

def clear_test_data() -> None:
    with test_engine.begin() as connection:

        for table in reversed(
            Base.metadata.sorted_tables
        ):
            connection.execute(
                table.delete()
            )