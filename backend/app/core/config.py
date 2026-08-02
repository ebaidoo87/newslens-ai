from functools import lru_cache

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

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()