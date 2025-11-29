from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.database import get_async_session
from app.schemas.auth import SignupRequest, UserPublic
from app.services.auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["auth"])


# Login Request Schema
class LoginRequest(BaseModel):
    username: str
    password: str


# Login Response Schema
class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
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
    Returns JWT access token
    """
    service = AuthService(db)
    user = await service.verify_user(payload.username, payload.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # For now, generate simple token (username-based)
    # TODO: Replace with proper JWT implementation
    access_token = f"mock_token_{user.username}_{user.id}"
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserPublic(id=user.id, username=user.username, email=user.email, is_active=user.is_active)
    )


@router.post("/logout", response_model=LogoutResponse)
async def logout() -> LogoutResponse:
    """
    Logout user - invalidate session/token
    Returns success message
    """
    # TODO: When JWT is implemented, add token to blacklist or invalidate session
    # For now, just return success as token invalidation is handled client-side
    return LogoutResponse(
        message="Logged out successfully",
        success=True
    )


@router.get("/me", response_model=UserPublic)
async def get_current_user_info(db: AsyncSession = Depends(get_async_session)) -> UserPublic:
    """
    Get current logged-in user information
    For now returns mock user
    """
    # TODO: Extract user from JWT token
    return UserPublic(id=1, username="mockuser", email="mock@example.com", is_active=True)
