"""Configuration management for the Forms service."""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""
    
    app_name: str = "ComplyCrafter Forms Service"
    environment: str = "dev"
    database_url: str = "postgresql+asyncpg://comply:comply@db:5432/comply"
    
    # API Settings
    api_prefix: str = "/api/v1"
    debug: bool = False
    
    # JWT Settings
    secret_key: str = "your-secret-key-change-in-production-use-env-var"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS Settings
    # Allow common local dev variants (http/https on ports 4200, 3000, 8000, 8001)
    cors_origins: str = (
        "https://menindata.org,https://www.menindata.org," \
        "http://localhost:4200,https://localhost:4200," \
        "http://localhost:3000,https://localhost:3000," \
        "http://localhost:8000,https://localhost:8000," \
        "http://localhost:8001,https://localhost:8001"
    )
    
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        case_sensitive=False
    )


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()

