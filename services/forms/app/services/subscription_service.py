from __future__ import annotations

from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_account import UserAccount


class SubscriptionService:
    """Service for managing user subscriptions"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_subscription_status(self, user_id: int) -> Optional[dict]:
        """Get subscription status for a user"""
        result = await self.db.execute(
            select(UserAccount).where(UserAccount.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return None
        
        # Calculate days remaining in trial
        days_remaining = None
        if user.trial_ends_at:
            delta = user.trial_ends_at - datetime.utcnow()
            days_remaining = max(0, delta.days) if delta.total_seconds() > 0 else 0
        
        return {
            "subscription_status": user.subscription_status,
            "subscription_plan": user.subscription_plan,
            "trial_ends_at": user.trial_ends_at,
            "subscription_expires_at": user.subscription_expires_at,
            "requires_subscription": user.requires_subscription(),
            "days_remaining_in_trial": days_remaining,
            "is_trial_active": user.is_trial_active(),
            "is_subscription_active": user.is_subscription_active(),
        }
    
    async def update_subscription_plan(
        self, 
        user_id: int, 
        plan: str,
        duration_days: int = 30
    ) -> Optional[UserAccount]:
        """Update user's subscription plan"""
        result = await self.db.execute(
            select(UserAccount).where(UserAccount.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return None
        
        # Validate plan name
        valid_plans = ["starter", "professional", "enterprise"]
        if plan.lower() not in valid_plans:
            raise ValueError(f"Invalid plan. Must be one of: {', '.join(valid_plans)}")
        
        now = datetime.utcnow()
        
        # Update subscription
        await self.db.execute(
            update(UserAccount)
            .where(UserAccount.id == user_id)
            .values(
                subscription_status="active",
                subscription_plan=plan.lower(),
                subscription_started_at=now,
                subscription_expires_at=now + timedelta(days=duration_days),
                updated_at=now
            )
        )
        await self.db.commit()
        
        # Refresh and return updated user
        await self.db.refresh(user)
        return user
    
    async def cancel_subscription(self, user_id: int) -> Optional[UserAccount]:
        """Cancel user's subscription"""
        result = await self.db.execute(
            select(UserAccount).where(UserAccount.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return None
        
        now = datetime.utcnow()
        
        await self.db.execute(
            update(UserAccount)
            .where(UserAccount.id == user_id)
            .values(
                subscription_status="cancelled",
                updated_at=now
            )
        )
        await self.db.commit()
        
        await self.db.refresh(user)
        return user
    
    async def check_and_update_trial_status(self, user_id: int) -> Optional[UserAccount]:
        """Check if trial has expired and update status if needed"""
        result = await self.db.execute(
            select(UserAccount).where(UserAccount.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return None
        
        # If trial expired and no active subscription, update status
        if user.subscription_status == "trial" and user.requires_subscription():
            now = datetime.utcnow()
            await self.db.execute(
                update(UserAccount)
                .where(UserAccount.id == user_id)
                .values(
                    subscription_status="expired",
                    updated_at=now
                )
            )
            await self.db.commit()
            await self.db.refresh(user)
        
        return user

