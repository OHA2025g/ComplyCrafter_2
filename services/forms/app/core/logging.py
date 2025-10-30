"""Logging configuration for the Forms service."""

import logging
import sys
from typing import Any

from .config import get_settings

settings = get_settings()


def setup_logging() -> None:
    """
    Configure logging for the application.
    
    Sets up structured logging with appropriate log levels
    based on the environment.
    """
    log_level = logging.DEBUG if settings.debug else logging.INFO
    
    # Configure root logger
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Set specific log levels for third-party libraries
    logging.getLogger("uvicorn").setLevel(log_level)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance with the given name.
    
    Args:
        name: Logger name (typically __name__ of the module)
        
    Returns:
        logging.Logger: Configured logger instance
    """
    return logging.getLogger(name)


class StructuredLogger:
    """
    Structured logger for JSON logging.
    
    This can be enhanced to output JSON logs for production environments.
    """
    
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
    
    def info(self, message: str, **kwargs: Any) -> None:
        """Log info message with structured data."""
        extra = {"extra": kwargs} if kwargs else {}
        self.logger.info(message, extra=extra)
    
    def error(self, message: str, **kwargs: Any) -> None:
        """Log error message with structured data."""
        extra = {"extra": kwargs} if kwargs else {}
        self.logger.error(message, extra=extra)
    
    def warning(self, message: str, **kwargs: Any) -> None:
        """Log warning message with structured data."""
        extra = {"extra": kwargs} if kwargs else {}
        self.logger.warning(message, extra=extra)
    
    def debug(self, message: str, **kwargs: Any) -> None:
        """Log debug message with structured data."""
        extra = {"extra": kwargs} if kwargs else {}
        self.logger.debug(message, extra=extra)

