"""Configuration management for the Forms service."""

from __future__ import annotations

import base64
import configparser
import os
from functools import lru_cache
from pathlib import Path
from typing import Dict

from pydantic_settings import BaseSettings, SettingsConfigDict

try:
    # Strong symmetric encryption for secrets at rest in .ini file
    from cryptography.fernet import Fernet
except ImportError as exc:  # pragma: no cover - only hit when dependency missing
    Fernet = None  # type: ignore[assignment]


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
    # NOTE:
    #   Real credentials can be stored encrypted in an .ini file.
    #   - In production: the encryption key is provided via environment variable.
    #   - In development: the encryption key can be stored in a local file that is NOT committed.
    mobilogic_base_url: str
    mobilogic_username: str
    mobilogic_password: str
    mobilogic_route: str | None = None
    mobilogic_sender: str | None = None
    mobilogic_default_template_id: str | None = None
    mobilogic_named_template_id: str | None = None
    mobilogic_request_timeout_seconds: int = 10
    mobilogic_retry_attempts: int = 3
    mobilogic_retry_backoff_seconds: int = 2
    mobilogic_verify_ssl: bool = True  # SSL certificate verification (set False if certificate issues)

    # CORS Settings
    cors_origins: str = (
        "https://menindata.org,https://www.menindata.org,"
        "http://localhost:4200,http://localhost:3000"
    )

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
        case_sensitive=False,
    )


def _load_encryption_key() -> bytes | None:
    """Load the symmetric encryption key for .ini secrets.

    Priority:
    1. `MOBILOGIC_ENC_KEY` env var (base64-encoded Fernet key)  [PRODUCTION]
    2. Local key file `secrets/mobilogic.key` (relative to forms service root) [DEV]
    """
    # 1) Production: key from environment
    key_env = os.getenv("MOBILOGIC_ENC_KEY")
    if key_env:
        return key_env.encode("utf-8")

    # 2) Development: key from local file, e.g. services/forms/secrets/mobilogic.key
    base_dir = Path(__file__).resolve().parents[2]  # services/forms
    key_path = base_dir / "secrets" / "mobilogic.key"
    if key_path.is_file():
        return key_path.read_bytes().strip()

    return None


def _decrypt_value(encrypted_value: str, key: bytes) -> str:
    """Decrypt a single encrypted value using Fernet."""
    if Fernet is None:  # pragma: no cover - guard if dependency missing
        raise RuntimeError(
            "cryptography library is required for decrypting .ini secrets. "
            "Install it with: pip install cryptography"
        )

    f = Fernet(key)
    # Ensure the value is bytes; assume stored as base64 urlsafe string
    token = encrypted_value.encode("utf-8")
    decrypted = f.decrypt(token)
    return decrypted.decode("utf-8")


def _load_mobilogic_from_ini() -> Dict[str, str]:
    """Load and decrypt Mobilogic / OTP SMS settings from an encrypted .ini file.

    - INI path is controlled by `MOBILOGIC_INI_PATH` env var or defaults to:
      `secrets/mobilogic_secrets.ini` under the forms service directory.
    - Values in the ini are expected to be Fernet-encrypted strings.
    - If file / section / key is missing, this function returns {} to let
      normal env / .env handling take over.
    """
    ini_overrides: Dict[str, str] = {}

    key = _load_encryption_key()
    if key is None:
        # No key configured: fall back to env / .env only
        return ini_overrides

    base_dir = Path(__file__).resolve().parents[2]  # services/forms
    ini_path_env = os.getenv("MOBILOGIC_INI_PATH")
    ini_path = Path(ini_path_env) if ini_path_env else base_dir / "secrets" / "mobilogic_secrets.ini"

    if not ini_path.is_file():
        return ini_overrides

    config = configparser.ConfigParser()
    config.read(ini_path)

    if "mobilogic" not in config:
        return ini_overrides

    section = config["mobilogic"]

    def get_dec(key_name: str) -> str | None:
        raw = section.get(key_name)
        if not raw:
            return None
        return _decrypt_value(raw, key)

    # Map ini keys -> Settings field names
    mapping = {
        "base_url": "mobilogic_base_url",
        "username": "mobilogic_username",
        "password": "mobilogic_password",
        "route": "mobilogic_route",
        "sender": "mobilogic_sender",
        "default_template_id": "mobilogic_default_template_id",
        "named_template_id": "mobilogic_named_template_id",
    }

    for ini_key, field_name in mapping.items():
        value = get_dec(ini_key)
        if value is not None:
            ini_overrides[field_name] = value

    return ini_overrides


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance.

    Load base settings from env / .env and optionally override Mobilogic
    secrets from an encrypted .ini file.
    """
    ini_overrides = _load_mobilogic_from_ini()
    # Explicit kwargs (ini_overrides) override env / .env values for those fields
    return Settings(**ini_overrides)

