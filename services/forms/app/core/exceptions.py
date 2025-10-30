"""Custom exceptions for the Forms service."""

from typing import Any, Optional

from fastapi import HTTPException, status


class FormsServiceException(Exception):
    """Base exception for Forms service."""
    
    def __init__(self, message: str, details: Optional[dict[str, Any]] = None):
        self.message = message
        self.details = details or {}
        super().__init__(self.message)


class SubmissionNotFoundError(FormsServiceException):
    """Raised when a form submission is not found."""
    
    def __init__(self, submission_id: int, form_type: Optional[str] = None):
        message = f"Submission with ID {submission_id} not found"
        if form_type:
            message += f" for form type {form_type}"
        super().__init__(message, {"submission_id": submission_id, "form_type": form_type})


class ValidationError(FormsServiceException):
    """Raised when form data validation fails."""
    
    def __init__(self, message: str, errors: Optional[list[dict[str, Any]]] = None):
        super().__init__(message, {"validation_errors": errors or []})


class DatabaseError(FormsServiceException):
    """Raised when a database operation fails."""
    
    def __init__(self, message: str, original_error: Optional[Exception] = None):
        details = {"original_error": str(original_error)} if original_error else {}
        super().__init__(message, details)


class AuthenticationError(FormsServiceException):
    """Raised when authentication fails."""
    
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message)


class AuthorizationError(FormsServiceException):
    """Raised when authorization fails."""
    
    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(message)


# HTTP Exception helpers
def not_found(message: str = "Resource not found") -> HTTPException:
    """Create a 404 Not Found exception."""
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=message)


def bad_request(message: str = "Bad request") -> HTTPException:
    """Create a 400 Bad Request exception."""
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=message)


def unauthorized(message: str = "Unauthorized") -> HTTPException:
    """Create a 401 Unauthorized exception."""
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=message,
        headers={"WWW-Authenticate": "Bearer"},
    )


def forbidden(message: str = "Forbidden") -> HTTPException:
    """Create a 403 Forbidden exception."""
    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=message)


def internal_error(message: str = "Internal server error") -> HTTPException:
    """Create a 500 Internal Server Error exception."""
    return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=message)

