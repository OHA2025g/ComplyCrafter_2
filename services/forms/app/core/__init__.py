"""Core module for the Forms service."""

from .config import Settings, get_settings
from .database import engine, get_async_session, get_db
from .exceptions import (
    AuthenticationError,
    AuthorizationError,
    DatabaseError,
    FormsServiceException,
    SubmissionNotFoundError,
    ValidationError,
    bad_request,
    forbidden,
    internal_error,
    not_found,
    unauthorized,
)
from .logging import StructuredLogger, get_logger, setup_logging
from .security import get_current_user, verify_token

__all__ = [
    # Config
    "Settings",
    "get_settings",
    # Database
    "engine",
    "get_db",
    "get_async_session",
    # Exceptions
    "FormsServiceException",
    "SubmissionNotFoundError",
    "ValidationError",
    "DatabaseError",
    "AuthenticationError",
    "AuthorizationError",
    "not_found",
    "bad_request",
    "unauthorized",
    "forbidden",
    "internal_error",
    # Logging
    "setup_logging",
    "get_logger",
    "StructuredLogger",
    # Security
    "get_current_user",
    "verify_token",
]

