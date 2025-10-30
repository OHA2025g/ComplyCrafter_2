from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.chg1 import CHG1, CHG1Create, CHG1Update, CHG1View
from ...services.chg1_service import CHG1Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chg1", tags=["chg1"])

@router.post("/", response_model=CHG1View, status_code=status.HTTP_201_CREATED)
async def create_chg1(
    chg1_data: CHG1Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new chg1 record"""
    try:
        chg1_service = CHG1Service(db)
        chg1 = await chg1_service.create_chg1(chg1_data, current_user.id)
        return chg1
    except Exception as e:
        logger.error(f"Error creating chg1: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create chg1"
        )

@router.get("/", response_model=List[CHG1View])
async def get_chg1s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all chg1s with pagination"""
    try:
        chg1_service = CHG1Service(db)
        chg1s = await chg1_service.get_chg1s(skip=skip, limit=limit)
        return chg1s
    except Exception as e:
        logger.error(f"Error getting chg1s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chg1s"
        )

@router.get("/{chg1_id}", response_model=CHG1View)
async def get_chg1(
    chg1_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific chg1 by ID"""
    try:
        chg1_service = CHG1Service(db)
        chg1 = await chg1_service.get_chg1(chg1_id)
        if not chg1:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG1 not found"
            )
        return chg1
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting chg1 {chg1_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chg1"
        )

@router.put("/{chg1_id}", response_model=CHG1View)
async def update_chg1(
    chg1_id: int,
    chg1_data: CHG1Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a chg1 record"""
    try:
        chg1_service = CHG1Service(db)
        chg1 = await chg1_service.update_chg1(chg1_id, chg1_data, current_user.id)
        if not chg1:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG1 not found"
            )
        return chg1
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating chg1 {chg1_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update chg1"
        )

@router.delete("/{chg1_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chg1(
    chg1_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a chg1 record (soft delete)"""
    try:
        chg1_service = CHG1Service(db)
        success = await chg1_service.delete_chg1(chg1_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG1 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting chg1 {chg1_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete chg1"
        )

@router.get("/company/{company_id}", response_model=List[CHG1View])
async def get_chg1s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all chg1s for a specific company"""
    try:
        chg1_service = CHG1Service(db)
        chg1s = await chg1_service.get_chg1s_by_company(company_id)
        return chg1s
    except Exception as e:
        logger.error(f"Error getting chg1s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chg1s for company"
        )

@router.patch("/{chg1_id}/status/{status}", response_model=CHG1View)
async def change_chg1_status(
    chg1_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a chg1"""
    try:
        chg1_service = CHG1Service(db)
        success = await chg1_service.change_status(chg1_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG1 not found"
            )
        
        # Return the updated chg1
        chg1 = await chg1_service.get_chg1(chg1_id)
        return chg1
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of chg1 {chg1_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change chg1 status"
        )