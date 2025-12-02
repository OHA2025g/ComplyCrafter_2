from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.schemas.auth import SubscriptionStatusResponse, SubscriptionPlanRequest
from app.services.subscription_service import SubscriptionService

router = APIRouter(prefix="/subscription", tags=["subscription"])


@router.get("/status", response_model=SubscriptionStatusResponse)
async def get_subscription_status(
    user_id: int,  # TODO: Extract from JWT token in production
    db: AsyncSession = Depends(get_async_session)
) -> SubscriptionStatusResponse:
    """
    Get subscription status for the current user
    Checks trial period, subscription status, and whether subscription is required
    """
    service = SubscriptionService(db)
    
    # Check and update trial status if expired
    await service.check_and_update_trial_status(user_id)
    
    status_data = await service.get_subscription_status(user_id)
    
    if not status_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return SubscriptionStatusResponse(**status_data)


@router.post("/select-plan", status_code=status.HTTP_200_OK)
async def select_subscription_plan(
    payload: SubscriptionPlanRequest,
    user_id: int,  # TODO: Extract from JWT token in production
    db: AsyncSession = Depends(get_async_session)
) -> dict:
    """
    Select a subscription plan for the user
    Plans: starter, professional, enterprise
    """
    service = SubscriptionService(db)
    
    try:
        user = await service.update_subscription_plan(
            user_id=user_id,
            plan=payload.plan,
            duration_days=30  # Default to 30 days, can be made configurable
        )
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {
            "message": f"Subscription plan '{payload.plan}' activated successfully",
            "subscription_status": user.subscription_status,
            "subscription_plan": user.subscription_plan,
            "subscription_expires_at": user.subscription_expires_at
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/cancel", status_code=status.HTTP_200_OK)
async def cancel_subscription(
    user_id: int,  # TODO: Extract from JWT token in production
    db: AsyncSession = Depends(get_async_session)
) -> dict:
    """
    Cancel user's subscription
    """
    service = SubscriptionService(db)
    
    user = await service.cancel_subscription(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "message": "Subscription cancelled successfully",
        "subscription_status": user.subscription_status
    }

