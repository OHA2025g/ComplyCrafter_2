from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ComplyCrafter Forms Service"
    environment: str = "dev"
    database_url: str = "postgresql+asyncpg://comply:comply@db:5432/comply"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    return Settings()
