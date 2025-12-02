from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    profession: str = Field(min_length=1, max_length=100)
    firm_name: str = Field(min_length=1, max_length=200)
    phone_number: str = Field(min_length=10, max_length=20)
    ccpin: str = Field(min_length=4, max_length=4, pattern=r"^\d{4}$")
    confirm_ccpin: str = Field(min_length=4, max_length=4, pattern=r"^\d{4}$")


class UserPublic(BaseModel):
    id: int
    email: EmailStr
    first_name: str | None = None
    last_name: str | None = None
    is_active: bool = True
    created_at: Optional[datetime] = None
    subscription_status: str = "trial"
    subscription_plan: Optional[str] = None
    trial_ends_at: Optional[datetime] = None
    subscription_expires_at: Optional[datetime] = None
    requires_subscription: bool = False
    
    class Config:
        from_attributes = True


class SubscriptionStatusResponse(BaseModel):
    """Response model for subscription status check"""
    subscription_status: str
    subscription_plan: Optional[str] = None
    trial_ends_at: Optional[datetime] = None
    subscription_expires_at: Optional[datetime] = None
    requires_subscription: bool
    days_remaining_in_trial: Optional[int] = None
    is_trial_active: bool
    is_subscription_active: bool


class SubscriptionPlanRequest(BaseModel):
    """Request model for selecting a subscription plan"""
    plan: str = Field(..., description="Plan name: starter, professional, or enterprise")


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class MessageResponse(BaseModel):
    message: str


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=16)
    password: str = Field(min_length=8, max_length=128)


class SendOTPRequest(BaseModel):
    phone_number: str = Field(min_length=10, max_length=20)
    template_id: str | None = Field(default=None, min_length=1, max_length=64)
    name: str | None = Field(default=None, min_length=1, max_length=120)


class VerifyOTPRequest(BaseModel):
    phone_number: str = Field(min_length=10, max_length=20)
    otp: str = Field(min_length=6, max_length=6, pattern=r"^\d{6}$")


