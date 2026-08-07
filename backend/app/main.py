from fastapi import FastAPI

from app.core.config import settings
from app.core.logging import logger

from sqlalchemy import text

from app.db import SessionLocal
from app.db.init_db import init_db

from contextlib import asynccontextmanager

from app.api.articles import router as articles_router

from fastapi.middleware.cors import CORSMiddleware

from app.api.news import router as news_router

from app.core.config import settings

from app.services.scheduler import start_scheduler

from app.api.auth import router as auth_router

from app.api.bookmarks import (
    router as bookmarks_router,
)

from app.api.reading_history import (
    router as reading_history_router,
)

from app.api.preferences import (
    router as preferences_router,
)

from app.api.recommendations import (
    router as recommendations_router,
)

from app.api.trending import (
    router as trending_router,
)

from app.api.discovery import (
    router as discovery_router,
)

from app.api.notifications import (
    router as notification_router,
)


print("News API URL:", settings.NEWS_API_URL)
print("API Key Loaded:", bool(settings.NEWS_API_KEY))

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    logger.info("Database initialized")
    start_scheduler()
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    articles_router,
    prefix="/api"
)

app.include_router(
    news_router,
    prefix=settings.api_prefix,
)

app.include_router(
    auth_router,
    prefix=settings.api_prefix,
)

app.include_router(
    bookmarks_router,
    prefix=settings.api_prefix,
)

app.include_router(
    reading_history_router,
    prefix=settings.api_prefix,
)

app.include_router(
    preferences_router,
    prefix=settings.api_prefix,
)

app.include_router(
    recommendations_router,
    prefix=settings.api_prefix,
)

app.include_router(
    trending_router,
    prefix=settings.api_prefix,
)

app.include_router(
    discovery_router,
    prefix=settings.api_prefix,
)

app.include_router(
    notification_router,
    prefix=settings.api_prefix,
)


logger.info("Starting NewsLens AI")



@app.get("/")
def root():
    logger.info("Root endpoint called")

    return {
        "message": f"Welcome to {settings.app_name}"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "version": settings.app_version,
    }

@app.get("/db-check")
def db_check():
    db = SessionLocal()

    try:
        db.execute(text("SELECT 1"))

        return {
            "database": "connected"
        }
    
    

    finally:
        db.close()


