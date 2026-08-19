from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

from pydantic import model_validator


class Settings(BaseSettings):
    app_name: str = "NewsLens AI API"
    app_version: str = "1.0.0"

    api_prefix: str = "/api"

    debug: bool = True

    host: str = "127.0.0.1"
    port: int = 8000

    database_url: str

    NEWS_API_KEY: str
    NEWS_API_URL: str

    log_level: str = "INFO"

    SECRET_KEY: str


    DATABASE_URL: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    RESEND_API_KEY: str | None = None
    RESEND_WEBHOOK_SECRET: str | None = None

    EMAIL_FROM: str = "NewsLens AI <noreply@example.com>"


    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

@model_validator(mode="after")
def validate_production(self):

    if self.ENVIRONMENT == "production":

        if self.DEBUG:
            raise ValueError(
                "DEBUG cannot be enabled in production."
            )

    return self