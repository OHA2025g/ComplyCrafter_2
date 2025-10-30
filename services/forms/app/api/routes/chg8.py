from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.chg8 import CHG8, CHG8Create, CHG8Update, CHG8View
from ...services.chg8_service import CHG8Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chg8", tags=["chg8"])

@router.post("/", response_model=CHG8View, status_code=status.HTTP_201_CREATED)
async def create_chg8(
    chg8_data: CHG8Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new chg8 record"""
    try:
        chg8_service = CHG8Service(db)
        chg8 = await chg8_service.create_chg8(chg8_data, current_user.id)
        return chg8
    except Exception as e:
        logger.error(f"Error creating chg8: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create chg8"
        )

@router.get("/", response_model=List[CHG8View])
async def get_chg8s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all chg8s with pagination"""
    try:
        chg8_service = CHG8Service(db)
        chg8s = await chg8_service.get_chg8s(skip=skip, limit=limit)
        return chg8s
    except Exception as e:
        logger.error(f"Error getting chg8s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chg8s"
        )

@router.get("/{chg8_id}", response_model=CHG8View)
async def get_chg8(
    chg8_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific chg8 by ID"""
    try:
        chg8_service = CHG8Service(db)
        chg8 = await chg8_service.get_chg8(chg8_id)
        if not chg8:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG8 not found"
            )
        return chg8
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting chg8 {chg8_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chg8"
        )

@router.put("/{chg8_id}", response_model=CHG8View)
async def update_chg8(
    chg8_id: int,
    chg8_data: CHG8Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a chg8 record"""
    try:
        chg8_service = CHG8Service(db)
        chg8 = await chg8_service.update_chg8(chg8_id, chg8_data, current_user.id)
        if not chg8:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG8 not found"
            )
        return chg8
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating chg8 {chg8_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update chg8"
        )

@router.delete("/{chg8_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chg8(
    chg8_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a chg8 record (soft delete)"""
    try:
        chg8_service = CHG8Service(db)
        success = await chg8_service.delete_chg8(chg8_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG8 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting chg8 {chg8_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete chg8"
        )

@router.get("/company/{company_id}", response_model=List[CHG8View])
async def get_chg8s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all chg8s for a specific company"""
    try:
        chg8_service = CHG8Service(db)
        chg8s = await chg8_service.get_chg8s_by_company(company_id)
        return chg8s
    except Exception as e:
        logger.error(f"Error getting chg8s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chg8s for company"
        )

@router.patch("/{chg8_id}/status/{status}", response_model=CHG8View)
async def change_chg8_status(
    chg8_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a chg8"""
    try:
        chg8_service = CHG8Service(db)
        success = await chg8_service.change_status(chg8_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG8 not found"
            )
        
        # Return the updated chg8
        chg8 = await chg8_service.get_chg8(chg8_id)
        return chg8
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of chg8 {chg8_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change chg8 status"
        )