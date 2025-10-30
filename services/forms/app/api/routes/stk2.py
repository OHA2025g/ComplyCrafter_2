from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.stk2 import STK2, STK2Create, STK2Update, STK2View
from ...services.stk2_service import STK2Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/stk2", tags=["stk2"])

@router.post("/", response_model=STK2View, status_code=status.HTTP_201_CREATED)
async def create_stk2(
    stk2_data: STK2Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new stk2 record"""
    try:
        stk2_service = STK2Service(db)
        stk2 = await stk2_service.create_stk2(stk2_data, current_user.id)
        return stk2
    except Exception as e:
        logger.error(f"Error creating stk2: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create stk2"
        )

@router.get("/", response_model=List[STK2View])
async def get_stk2s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all stk2s with pagination"""
    try:
        stk2_service = STK2Service(db)
        stk2s = await stk2_service.get_stk2s(skip=skip, limit=limit)
        return stk2s
    except Exception as e:
        logger.error(f"Error getting stk2s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve stk2s"
        )

@router.get("/{stk2_id}", response_model=STK2View)
async def get_stk2(
    stk2_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific stk2 by ID"""
    try:
        stk2_service = STK2Service(db)
        stk2 = await stk2_service.get_stk2(stk2_id)
        if not stk2:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="STK2 not found"
            )
        return stk2
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting stk2 {stk2_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve stk2"
        )

@router.put("/{stk2_id}", response_model=STK2View)
async def update_stk2(
    stk2_id: int,
    stk2_data: STK2Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a stk2 record"""
    try:
        stk2_service = STK2Service(db)
        stk2 = await stk2_service.update_stk2(stk2_id, stk2_data, current_user.id)
        if not stk2:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="STK2 not found"
            )
        return stk2
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating stk2 {stk2_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update stk2"
        )

@router.delete("/{stk2_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_stk2(
    stk2_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a stk2 record (soft delete)"""
    try:
        stk2_service = STK2Service(db)
        success = await stk2_service.delete_stk2(stk2_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="STK2 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting stk2 {stk2_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete stk2"
        )

@router.get("/company/{company_id}", response_model=List[STK2View])
async def get_stk2s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all stk2s for a specific company"""
    try:
        stk2_service = STK2Service(db)
        stk2s = await stk2_service.get_stk2s_by_company(company_id)
        return stk2s
    except Exception as e:
        logger.error(f"Error getting stk2s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve stk2s for company"
        )

@router.patch("/{stk2_id}/status/{status}", response_model=STK2View)
async def change_stk2_status(
    stk2_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a stk2"""
    try:
        stk2_service = STK2Service(db)
        success = await stk2_service.change_status(stk2_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="STK2 not found"
            )
        
        # Return the updated stk2
        stk2 = await stk2_service.get_stk2(stk2_id)
        return stk2
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of stk2 {stk2_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change stk2 status"
        )