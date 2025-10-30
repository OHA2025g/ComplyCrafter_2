from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.msc3 import MSC3, MSC3Create, MSC3Update, MSC3View
from ...services.msc3_service import MSC3Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/msc3", tags=["msc3"])

@router.post("/", response_model=MSC3View, status_code=status.HTTP_201_CREATED)
async def create_msc3(
    msc3_data: MSC3Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new msc3 record"""
    try:
        msc3_service = MSC3Service(db)
        msc3 = await msc3_service.create_msc3(msc3_data, current_user.id)
        return msc3
    except Exception as e:
        logger.error(f"Error creating msc3: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create msc3"
        )

@router.get("/", response_model=List[MSC3View])
async def get_msc3s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all msc3s with pagination"""
    try:
        msc3_service = MSC3Service(db)
        msc3s = await msc3_service.get_msc3s(skip=skip, limit=limit)
        return msc3s
    except Exception as e:
        logger.error(f"Error getting msc3s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve msc3s"
        )

@router.get("/{msc3_id}", response_model=MSC3View)
async def get_msc3(
    msc3_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific msc3 by ID"""
    try:
        msc3_service = MSC3Service(db)
        msc3 = await msc3_service.get_msc3(msc3_id)
        if not msc3:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MSC3 not found"
            )
        return msc3
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting msc3 {msc3_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve msc3"
        )

@router.put("/{msc3_id}", response_model=MSC3View)
async def update_msc3(
    msc3_id: int,
    msc3_data: MSC3Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a msc3 record"""
    try:
        msc3_service = MSC3Service(db)
        msc3 = await msc3_service.update_msc3(msc3_id, msc3_data, current_user.id)
        if not msc3:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MSC3 not found"
            )
        return msc3
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating msc3 {msc3_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update msc3"
        )

@router.delete("/{msc3_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_msc3(
    msc3_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a msc3 record (soft delete)"""
    try:
        msc3_service = MSC3Service(db)
        success = await msc3_service.delete_msc3(msc3_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MSC3 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting msc3 {msc3_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete msc3"
        )

@router.get("/company/{company_id}", response_model=List[MSC3View])
async def get_msc3s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all msc3s for a specific company"""
    try:
        msc3_service = MSC3Service(db)
        msc3s = await msc3_service.get_msc3s_by_company(company_id)
        return msc3s
    except Exception as e:
        logger.error(f"Error getting msc3s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve msc3s for company"
        )

@router.patch("/{msc3_id}/status/{status}", response_model=MSC3View)
async def change_msc3_status(
    msc3_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a msc3"""
    try:
        msc3_service = MSC3Service(db)
        success = await msc3_service.change_status(msc3_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MSC3 not found"
            )
        
        # Return the updated msc3
        msc3 = await msc3_service.get_msc3(msc3_id)
        return msc3
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of msc3 {msc3_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change msc3 status"
        )