from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ComplyCrafter Gateway"
    environment: str = "dev"
    database_url: str = "postgresql+asyncpg://comply:comply@db:5432/comply"
    auth_issuer: str = "http://keycloak:8080/realms/comply"
    # Allow frontend & local dev origins (include https variants)
    cors_origins: str = (
        "https://menindata.org,https://www.menindata.org," \
        "http://localhost:4200,https://localhost:4200," \
        "http://localhost:3000,https://localhost:3000," \
        "http://localhost:8000,https://localhost:8000," \
        "http://localhost:8001,https://localhost:8001"
    )

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    return Settings()
