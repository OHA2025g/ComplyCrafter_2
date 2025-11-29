"""Configuration management for the Forms service."""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""
    
    app_name: str = "ComplyCrafter Forms Service"
    environment: str = "dev"
    database_url: str = "postgresql+asyncpg://comply:comply@db:5432/comply"
    frontend_base_url: str = "http://localhost:4200"
    
    # API Settings
    api_prefix: str = "/api/v1"
    debug: bool = False

    # OTP / SMS Settings
    mobilogic_base_url: str = "http://vas.mobilogi.com/api.php"
    mobilogic_username: str = "cspltp"
    mobilogic_password: str = "Pass@1234"
    mobilogic_route: str = "1"
    mobilogic_sender: str = "CSPLTP"
    mobilogic_default_template_id: str = "1207175405837058152"
    mobilogic_named_template_id: str = "1207175405379469327"
    mobilogic_request_timeout_seconds: int = 10
    mobilogic_retry_attempts: int = 3
    mobilogic_retry_backoff_seconds: int = 2
    
    # CORS Settings
    cors_origins: str = "https://menindata.org,https://www.menindata.org,http://localhost:4200,http://localhost:3000"

    # Email / password reset settings
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_sender: str | None = None
    smtp_use_tls: bool = True
    password_reset_token_expiry_minutes: int = 30
    
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        case_sensitive=False
    )


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()

