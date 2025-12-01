from __future__ import annotations
from datetime import timedelta
from typing import List

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.database import get_async_session
from app.schemas.auth import (
    ForgotPasswordRequest,
    MessageResponse,
    ResetPasswordRequest,
    SendOTPRequest,
    SignupRequest,
    UserPublic,
    VerifyOTPRequest,
)
from app.services.auth_service import AuthService
<<<<<<< HEAD
from app.core.jwt import create_access_token, create_refresh_token
from app.core.config import get_settings
from app.core.security import get_current_user, get_current_admin_user
from app.models.auth import User

settings = get_settings()
=======
from app.services.email_service import EmailDeliveryError
from app.services.otp_exceptions import OTPDispatchError, OTPThrottleError
from app.services.otp_service import OTPService, normalize_phone_number, validate_phone_number

logger = logging.getLogger(__name__)
>>>>>>> f2e4bcee1c43520ce2e01f35c0bf908a9d3b1e16


router = APIRouter(prefix="/auth", tags=["auth"])


# Login Request Schema
class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = None
    ccpin: Optional[str] = None


# Login Response Schema
class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds
    user: UserPublic


<<<<<<< HEAD
# Logout Response Schema
class LogoutResponse(BaseModel):
    message: str
    success: bool = True
=======
@router.post("/send-otp", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def send_otp(payload: SendOTPRequest, db: AsyncSession = Depends(get_async_session)) -> MessageResponse:
    """
    Send OTP to phone number for verification
    """
    try:
        if not validate_phone_number(payload.phone_number):
            raise ValueError("Phone number must be exactly 10 digits")
        
        otp_service = OTPService(db)
        await otp_service.send_otp(
            payload.phone_number,
            template_id=payload.template_id,
            recipient_name=payload.name,
        )
        
        return MessageResponse(message="OTP sent successfully")
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except OTPThrottleError as exc:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(exc))
    except OTPDispatchError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        logger.exception("Failed to send OTP")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to send OTP") from exc


@router.post("/verify-otp", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def verify_otp(payload: VerifyOTPRequest, db: AsyncSession = Depends(get_async_session)) -> MessageResponse:
    """
    Verify OTP for phone number
    """
    try:
        if not validate_phone_number(payload.phone_number):
            raise ValueError("Phone number must be exactly 10 digits")
        
        otp_service = OTPService(db)
        is_valid = await otp_service.verify_otp(payload.phone_number, payload.otp)
        
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP"
            )
        
        return MessageResponse(message="OTP verified successfully")
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Failed to verify OTP")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to verify OTP") from exc
>>>>>>> f2e4bcee1c43520ce2e01f35c0bf908a9d3b1e16


@router.post("/signup", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def signup(payload: SignupRequest, db: AsyncSession = Depends(get_async_session)) -> UserPublic:
    """
    Create a new user account with OTP verification, CCPIN, and phone number
    """
    try:
        # Validate CCPIN match
        if payload.ccpin != payload.confirm_ccpin:
            raise ValueError("CCPIN and Confirm CCPIN must match")
        
        # Validate phone number
        if not validate_phone_number(payload.phone_number):
            raise ValueError("Phone number must be exactly 10 digits")
        
        # Validate CCPIN is 4 digits
        if not payload.ccpin.isdigit() or len(payload.ccpin) != 4:
            raise ValueError("CCPIN must be exactly 4 digits")
        
        # Verify OTP before allowing signup
        otp_service = OTPService(db)
        normalized_phone = normalize_phone_number(payload.phone_number)
        is_otp_verified = await otp_service.is_otp_verified(normalized_phone)
        
        if not is_otp_verified:
            raise ValueError("Phone number must be verified with OTP before signup")
        
        service = AuthService(db)
        user = await service.create_user(
            email=payload.email,
            password=payload.password,
            first_name=payload.first_name,
            last_name=payload.last_name,
            profession=payload.profession,
            firm_name=payload.firm_name,
            phone_number=normalized_phone,
            ccpin=payload.ccpin,
        )
        return UserPublic(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            is_active=user.is_active
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        logger.exception("Failed to create user")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create user") from exc


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_async_session)) -> LoginResponse:
    """
<<<<<<< HEAD
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
=======
    Login with email and either password OR CCPIN
    Returns JWT access token
    """
    # Validate that at least one credential is provided
    if not payload.password and not payload.ccpin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either password or CCPIN must be provided"
        )
    
    # Validate CCPIN format if provided
    if payload.ccpin:
        if not payload.ccpin.isdigit() or len(payload.ccpin) != 4:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CCPIN must be exactly 4 digits"
            )
    
    service = AuthService(db)
    user = await service.verify_user(
        username=payload.email,
        password=payload.password,
        ccpin=payload.ccpin,
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
>>>>>>> f2e4bcee1c43520ce2e01f35c0bf908a9d3b1e16
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
    
<<<<<<< HEAD
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
=======
    # For now, generate simple token (username-based)
    # TODO: Replace with proper JWT implementation
    access_token = f"mock_token_{user.username}_{user.id}"
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserPublic(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            is_active=user.is_active
        )
    )
>>>>>>> f2e4bcee1c43520ce2e01f35c0bf908a9d3b1e16


@router.get("/me", response_model=UserPublic)
async def get_current_user_info(current_user: User = Depends(get_current_user)) -> UserPublic:
    """
    Get current logged-in user information from JWT token
    """
<<<<<<< HEAD
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
=======
    # TODO: Extract user from JWT token
    return UserPublic(id=1, email="mock@example.com", first_name="Mock", last_name="User", is_active=True)


@router.post("/forgot-password", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def forgot_password(
    payload: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_async_session),
) -> MessageResponse:
    """
    Accept an email address and dispatch a reset link.
    """
    service = AuthService(db)
    try:
        await service.request_password_reset(payload.email)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except LookupError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    except EmailDeliveryError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))
    except Exception as exc:  # pragma: no cover - unexpected failures
        logger.exception("Failed to send password reset email")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to send reset email") from exc
    return MessageResponse(message="Reset link sent to registered email")


@router.post("/reset-password", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def reset_password(
    payload: ResetPasswordRequest,
    db: AsyncSession = Depends(get_async_session),
) -> MessageResponse:
    """
    Validate the token and update the user's password.
    """
    service = AuthService(db)
    try:
        await service.reset_password(payload.token, payload.password)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except PermissionError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except TimeoutError as exc:
        raise HTTPException(status_code=status.HTTP_410_GONE, detail=str(exc))
    except LookupError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except Exception as exc:  # pragma: no cover
        logger.exception("Failed to reset password")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to reset password") from exc
    return MessageResponse(message="Password updated successfully")
>>>>>>> f2e4bcee1c43520ce2e01f35c0bf908a9d3b1e16
