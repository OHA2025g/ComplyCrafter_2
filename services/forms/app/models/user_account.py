from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from libs.python.data_access import Base


class UserAccount(Base):
    __tablename__ = "user_accounts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[Optional[str]] = mapped_column(String(150), unique=True, nullable=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    last_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    profession: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    firm_name: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    phone_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True, index=True)
    phone_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    ccpin_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
	# Subscription fields
    subscription_status: Mapped[str] = mapped_column(String(50), default="trial", index=True)
    subscription_plan: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    trial_ends_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True, index=True)
    subscription_expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    subscription_started_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    def is_trial_active(self) -> bool:
        """Check if user is still in trial period"""
        if self.subscription_status != "trial":
            return False
        if not self.trial_ends_at:
            return True  # If trial_ends_at is not set, assume trial is active
        return datetime.utcnow() < self.trial_ends_at
    
    def is_subscription_active(self) -> bool:
        """Check if user has active subscription"""
        if self.subscription_status == "active":
            if self.subscription_expires_at:
                return datetime.utcnow() < self.subscription_expires_at
            return True  # If no expiry date, assume active
        return False
    
    def requires_subscription(self) -> bool:
        """Check if user needs to subscribe (trial expired and no active subscription)"""
        return not self.is_trial_active() and not self.is_subscription_active()


