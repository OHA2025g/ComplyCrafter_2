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
    
    # CORS Settings
    cors_origins: list[str] = ["http://localhost:4200", "http://localhost:3000"]
    
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        case_sensitive=False
    )


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()

