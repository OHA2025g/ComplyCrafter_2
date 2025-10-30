from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.iepf5 import IEPF5, IEPF5Create, IEPF5Update, IEPF5View
from ...services.iepf5_service import IEPF5Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/iepf5", tags=["iepf5"])

@router.post("/", response_model=IEPF5View, status_code=status.HTTP_201_CREATED)
async def create_iepf5(
    iepf5_data: IEPF5Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new iepf5 record"""
    try:
        iepf5_service = IEPF5Service(db)
        iepf5 = await iepf5_service.create_iepf5(iepf5_data, current_user.id)
        return iepf5
    except Exception as e:
        logger.error(f"Error creating iepf5: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create iepf5"
        )

@router.get("/", response_model=List[IEPF5View])
async def get_iepf5s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all iepf5s with pagination"""
    try:
        iepf5_service = IEPF5Service(db)
        iepf5s = await iepf5_service.get_iepf5s(skip=skip, limit=limit)
        return iepf5s
    except Exception as e:
        logger.error(f"Error getting iepf5s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve iepf5s"
        )

@router.get("/{iepf5_id}", response_model=IEPF5View)
async def get_iepf5(
    iepf5_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific iepf5 by ID"""
    try:
        iepf5_service = IEPF5Service(db)
        iepf5 = await iepf5_service.get_iepf5(iepf5_id)
        if not iepf5:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="IEPF5 not found"
            )
        return iepf5
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting iepf5 {iepf5_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve iepf5"
        )

@router.put("/{iepf5_id}", response_model=IEPF5View)
async def update_iepf5(
    iepf5_id: int,
    iepf5_data: IEPF5Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a iepf5 record"""
    try:
        iepf5_service = IEPF5Service(db)
        iepf5 = await iepf5_service.update_iepf5(iepf5_id, iepf5_data, current_user.id)
        if not iepf5:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="IEPF5 not found"
            )
        return iepf5
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating iepf5 {iepf5_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update iepf5"
        )

@router.delete("/{iepf5_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_iepf5(
    iepf5_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a iepf5 record (soft delete)"""
    try:
        iepf5_service = IEPF5Service(db)
        success = await iepf5_service.delete_iepf5(iepf5_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="IEPF5 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting iepf5 {iepf5_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete iepf5"
        )

@router.get("/company/{company_id}", response_model=List[IEPF5View])
async def get_iepf5s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all iepf5s for a specific company"""
    try:
        iepf5_service = IEPF5Service(db)
        iepf5s = await iepf5_service.get_iepf5s_by_company(company_id)
        return iepf5s
    except Exception as e:
        logger.error(f"Error getting iepf5s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve iepf5s for company"
        )

@router.patch("/{iepf5_id}/status/{status}", response_model=IEPF5View)
async def change_iepf5_status(
    iepf5_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a iepf5"""
    try:
        iepf5_service = IEPF5Service(db)
        success = await iepf5_service.change_status(iepf5_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="IEPF5 not found"
            )
        
        # Return the updated iepf5
        iepf5 = await iepf5_service.get_iepf5(iepf5_id)
        return iepf5
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of iepf5 {iepf5_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change iepf5 status"
        )