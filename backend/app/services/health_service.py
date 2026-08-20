from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.article import Article
from app.models.user import User

import platform
import sys
import time

class HealthService:

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def check_database(self):
        try:
            start = time.perf_counter()

            self.db.execute(
                text("SELECT 1")
            )

            latency = (
                time.perf_counter()
                - start
            ) * 1000

            return {
                "status": "healthy",
                "latency_ms": round(
                    latency,
                    2,
                ),
            }

        except Exception as error:
            return {
                "status": "unhealthy",
                "error": str(error),
            }

        
    def check_articles(self):
        try:
            count = (
                self.db.query(Article)
                .count()
            )

            return {
                "status": "healthy",
                "count": count,
            }

        except Exception as error:
            return {
                "status": "unhealthy",
                "error": str(error),
            }

    def check_users(self):
        try:
            count = (
                self.db.query(User)
                .count()
            )

            return {
                "status": "healthy",
                "count": count,
            }

        except Exception as error:
            return {
                "status": "unhealthy",
                "error": str(error),
            }

    def readiness(self):
        database = (
            self.check_database()
        )

        return (
            database["status"]
            == "healthy"
        )

    def details(self):
        database = (
            self.check_database()
        )

        users = (
            self.check_users()
        )

        articles = (
            self.check_articles()
        )

        overall = (
            "healthy"
            if (
                database["status"]
                == "healthy"
            )
            else "unhealthy"
        )

        return {
            "status": overall,
            "database": database,
            "users": users,
            "articles": articles,

            "runtime": {
                "python": sys.version.split()[0],
                "platform": platform.system(),
            },
        }