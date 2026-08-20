from alembic.config import Config
from alembic.script import ScriptDirectory
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.logging import logger


class StartupService:

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def check_database_connection(
        self,
    ):
        self.db.execute(
            text("SELECT 1")
        )

    def get_database_revision(
        self,
    ) -> str | None:
        result = self.db.execute(
            text(
                "SELECT version_num "
                "FROM alembic_version"
            )
        )

        row = result.first()

        if row is None:
            return None

        return row[0]

    def get_latest_revision(
        self,
    ) -> str | None:
        config = Config(
            "alembic.ini"
        )

        script = (
            ScriptDirectory.from_config(
                config
            )
        )

        return script.get_current_head()

    def validate_schema(
        self,
    ) -> None:
        current = (
            self.get_database_revision()
        )

        latest = (
            self.get_latest_revision()
        )

        logger.info(
            "Database revision: %s",
            current,
        )

        logger.info(
            "Latest revision: %s",
            latest,
        )

        if current != latest:
            raise RuntimeError(
                "Database schema is not "
                "up to date. "
                f"Current: {current}, "
                f"Latest: {latest}"
            )