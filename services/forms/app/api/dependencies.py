"""Common API dependencies."""

from app.core import get_async_session, get_current_user, get_db

# Re-export commonly used dependencies
__all__ = ["get_db", "get_async_session", "get_current_user"]

