"""Authentication and authorization utilities."""

from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.models.auth import User

security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> User:
    """
    Get current authenticated user from token.
    
    Args:
        credentials: HTTP Authorization credentials
        
    Returns:
        User: User object
        
    Note: For testing, authentication is disabled. Always returns mock user.
    """
    # TESTING MODE: Authentication disabled for comprehensive testing
    # Returns mock user regardless of credentials
    return User(
        id=1,
        username="test-user",
        email="test@example.com",
        full_name="Test User",
        is_active=True,
        is_superuser=False
    )


async def verify_token(token: str) -> dict:
    """
    Verify JWT token.
    
    Args:
        token: JWT token string
        
    Returns:
        dict: Decoded token payload
        
    Raises:
        HTTPException: If token is invalid
    """
    # TODO: Implement actual JWT verification
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Token verification not implemented"
    )

