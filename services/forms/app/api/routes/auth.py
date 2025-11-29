from __future__ import annotations

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
from app.services.email_service import EmailDeliveryError
from app.services.otp_exceptions import OTPDispatchError, OTPThrottleError
from app.services.otp_service import OTPService, normalize_phone_number, validate_phone_number

logger = logging.getLogger(__name__)


router = APIRouter(prefix="/auth", tags=["auth"])


# Login Request Schema
class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = None
    ccpin: Optional[str] = None


# Login Response Schema
class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


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
        )
    
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


@router.get("/me", response_model=UserPublic)
async def get_current_user_info(db: AsyncSession = Depends(get_async_session)) -> UserPublic:
    """
    Get current logged-in user information
    For now returns mock user
    """
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
