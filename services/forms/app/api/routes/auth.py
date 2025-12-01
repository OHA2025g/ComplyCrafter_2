from __future__ import annotations
from datetime import timedelta
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.database import get_async_session
from app.schemas.auth import SignupRequest, UserPublic
from app.services.auth_service import AuthService
from app.core.jwt import create_access_token, create_refresh_token
from app.core.config import get_settings
from app.core.security import get_current_user, get_current_admin_user
from app.models.auth import User

settings = get_settings()


router = APIRouter(prefix="/auth", tags=["auth"])


# Login Request Schema
class LoginRequest(BaseModel):
    username: str
    password: str


# Login Response Schema
class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds
    user: UserPublic


# Logout Response Schema
class LogoutResponse(BaseModel):
    message: str
    success: bool = True


@router.post("/signup", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def signup(payload: SignupRequest, db: AsyncSession = Depends(get_async_session)) -> UserPublic:
    """
    Create a new user account
    """
    service = AuthService(db)
    try:
        user = await service.create_user(payload.username, payload.email, payload.password)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return UserPublic(id=user.id, username=user.username, email=user.email, is_active=user.is_active)


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_async_session)) -> LoginResponse:
    """
    Login with username/email and password
    Returns JWT access token and refresh token
    """
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        service = AuthService(db)
        user = await service.verify_user(payload.username, payload.password)
        
        if not user:
            logger.warning(f"Login failed: Invalid credentials for username: {payload.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not user.is_active:
            logger.warning(f"Login failed: Inactive account for username: {payload.username}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive"
            )
        
        # Fetch user roles from database
        from sqlalchemy.orm import selectinload
        from sqlalchemy import select
        from app.models.user_account import UserAccount
        from app.models.role import Role
        
        # Load user with roles
        user_result = await db.execute(
            select(UserAccount)
            .where(UserAccount.id == user.id)
            .options(selectinload(UserAccount.roles))
        )
        user_with_roles = user_result.scalar_one()
        
        # Extract role names from database
        user_roles = [role.name for role in user_with_roles.roles] if user_with_roles.roles else []
        
        # Ensure at least "user" role is present (fallback for users without roles)
        if not user_roles:
            user_roles = ["user"]
        elif "user" not in user_roles:
            user_roles.append("user")
        
        # Prepare token data
        token_data = {
            "sub": str(user.id),  # Subject (user ID)
            "username": user.username,
            "email": user.email,
            "roles": user_roles,
            "permissions": []  # Can be extended from user model
        }
        
        # Generate tokens
        try:
            access_token = create_access_token(data=token_data)
            refresh_token = create_refresh_token(data=token_data)
        except Exception as e:
            logger.error(f"Error generating JWT tokens: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error generating authentication tokens"
            )
        
        # Calculate expiration time in seconds
        expires_in = settings.access_token_expire_minutes * 60
        
        logger.info(f"Login successful for user: {user.username} (ID: {user.id})")
        
        return LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=expires_in,
            user=UserPublic(id=user.id, username=user.username, email=user.email, is_active=user.is_active)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during login: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login. Please try again."
        )


@router.post("/logout", response_model=LogoutResponse)
async def logout(
    current_user: User = Depends(get_current_admin_user)
) -> LogoutResponse:
    """
    Logout user - invalidate session/token
    Requires valid JWT token with admin role for authentication
    Only administrators can logout users
    Returns success message
    """
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        # TODO: Add token to blacklist in Redis/database for proper invalidation
        # For now, token invalidation is handled client-side
        # In production, you would:
        # 1. Add token to blacklist (Redis or database)
        # 2. Check blacklist on subsequent requests
        # 3. Return error if token is already blacklisted
        
        logger.info(f"Admin user {current_user.username} (ID: {current_user.id}) logged out successfully")
        
        return LogoutResponse(
            message="Logged out successfully",
            success=True
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during logout: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during logout. Please try again."
        )


@router.get("/me", response_model=UserPublic)
async def get_current_user_info(current_user: User = Depends(get_current_user)) -> UserPublic:
    """
    Get current logged-in user information from JWT token
    """
    return UserPublic(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        is_active=current_user.is_active
    )


@router.get("/users", response_model=List[UserPublic])
async def get_all_users(
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_admin_user)
) -> List[UserPublic]:
    """
    Get all users.
    Requires admin authentication.
    """
    from app.models.user_account import UserAccount
    from sqlalchemy import select
    
    result = await db.execute(select(UserAccount).order_by(UserAccount.username))
    users = result.scalars().all()
    
    return [
        UserPublic(
            id=user.id,
            username=user.username,
            email=user.email,
            is_active=user.is_active
        )
        for user in users
    ]
