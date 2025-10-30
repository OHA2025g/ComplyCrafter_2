from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.chg4 import CHG4, CHG4Create, CHG4Update, CHG4View
from ...services.chg4_service import CHG4Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chg4", tags=["chg4"])

@router.post("/", response_model=CHG4View, status_code=status.HTTP_201_CREATED)
async def create_chg4(
    chg4_data: CHG4Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new chg4 record"""
    try:
        chg4_service = CHG4Service(db)
        chg4 = await chg4_service.create_chg4(chg4_data, current_user.id)
        return chg4
    except Exception as e:
        logger.error(f"Error creating chg4: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create chg4"
        )

@router.get("/", response_model=List[CHG4View])
async def get_chg4s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all chg4s with pagination"""
    try:
        chg4_service = CHG4Service(db)
        chg4s = await chg4_service.get_chg4s(skip=skip, limit=limit)
        return chg4s
    except Exception as e:
        logger.error(f"Error getting chg4s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chg4s"
        )

@router.get("/{chg4_id}", response_model=CHG4View)
async def get_chg4(
    chg4_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific chg4 by ID"""
    try:
        chg4_service = CHG4Service(db)
        chg4 = await chg4_service.get_chg4(chg4_id)
        if not chg4:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG4 not found"
            )
        return chg4
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting chg4 {chg4_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chg4"
        )

@router.put("/{chg4_id}", response_model=CHG4View)
async def update_chg4(
    chg4_id: int,
    chg4_data: CHG4Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a chg4 record"""
    try:
        chg4_service = CHG4Service(db)
        chg4 = await chg4_service.update_chg4(chg4_id, chg4_data, current_user.id)
        if not chg4:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG4 not found"
            )
        return chg4
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating chg4 {chg4_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update chg4"
        )

@router.delete("/{chg4_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chg4(
    chg4_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a chg4 record (soft delete)"""
    try:
        chg4_service = CHG4Service(db)
        success = await chg4_service.delete_chg4(chg4_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG4 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting chg4 {chg4_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete chg4"
        )

@router.get("/company/{company_id}", response_model=List[CHG4View])
async def get_chg4s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all chg4s for a specific company"""
    try:
        chg4_service = CHG4Service(db)
        chg4s = await chg4_service.get_chg4s_by_company(company_id)
        return chg4s
    except Exception as e:
        logger.error(f"Error getting chg4s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chg4s for company"
        )

@router.patch("/{chg4_id}/status/{status}", response_model=CHG4View)
async def change_chg4_status(
    chg4_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a chg4"""
    try:
        chg4_service = CHG4Service(db)
        success = await chg4_service.change_status(chg4_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG4 not found"
            )
        
        # Return the updated chg4
        chg4 = await chg4_service.get_chg4(chg4_id)
        return chg4
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of chg4 {chg4_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change chg4 status"
        )