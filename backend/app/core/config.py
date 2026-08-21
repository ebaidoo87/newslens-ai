from functools import lru_cache

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


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

    TESTING: bool = False

    RESEND_API_KEY: str | None = None
    RESEND_WEBHOOK_SECRET: str | None = None

    EMAIL_FROM: str = "NewsLens AI <noreply@example.com>"

    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    TRUSTED_HOSTS: list[str] = [
    "localhost",
    "127.0.0.1",
    ]


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

@field_validator(
    "CORS_ORIGINS",
    mode="before",
)
@classmethod
def parse_cors_origins(
    cls,
    value,
):
    if isinstance(value, str):
        return [
            item.strip()
            for item in value.split(",")
            if item.strip()
        ]

    return value


@field_validator(
    "TRUSTED_HOSTS",
    mode="before",
)
@classmethod
def parse_trusted_hosts(
    cls,
    value,
):
    if isinstance(value, str):
        return [
            item.strip()
            for item in value.split(",")
            if item.strip()
        ]

    return value