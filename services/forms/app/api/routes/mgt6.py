from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.mgt6 import MGT6, MGT6Create, MGT6Update, MGT6View
from ...services.mgt6_service import MGT6Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/mgt6", tags=["mgt6"])

@router.post("/", response_model=MGT6View, status_code=status.HTTP_201_CREATED)
async def create_mgt6(
    mgt6_data: MGT6Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new mgt6 record"""
    try:
        mgt6_service = MGT6Service(db)
        mgt6 = await mgt6_service.create_mgt6(mgt6_data, current_user.id)
        return mgt6
    except Exception as e:
        logger.error(f"Error creating mgt6: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create mgt6"
        )

@router.get("/", response_model=List[MGT6View])
async def get_mgt6s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all mgt6s with pagination"""
    try:
        mgt6_service = MGT6Service(db)
        mgt6s = await mgt6_service.get_mgt6s(skip=skip, limit=limit)
        return mgt6s
    except Exception as e:
        logger.error(f"Error getting mgt6s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mgt6s"
        )

@router.get("/{mgt6_id}", response_model=MGT6View)
async def get_mgt6(
    mgt6_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific mgt6 by ID"""
    try:
        mgt6_service = MGT6Service(db)
        mgt6 = await mgt6_service.get_mgt6(mgt6_id)
        if not mgt6:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MGT6 not found"
            )
        return mgt6
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting mgt6 {mgt6_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mgt6"
        )

@router.put("/{mgt6_id}", response_model=MGT6View)
async def update_mgt6(
    mgt6_id: int,
    mgt6_data: MGT6Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a mgt6 record"""
    try:
        mgt6_service = MGT6Service(db)
        mgt6 = await mgt6_service.update_mgt6(mgt6_id, mgt6_data, current_user.id)
        if not mgt6:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MGT6 not found"
            )
        return mgt6
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating mgt6 {mgt6_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update mgt6"
        )

@router.delete("/{mgt6_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mgt6(
    mgt6_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a mgt6 record (soft delete)"""
    try:
        mgt6_service = MGT6Service(db)
        success = await mgt6_service.delete_mgt6(mgt6_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MGT6 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting mgt6 {mgt6_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete mgt6"
        )

@router.get("/company/{company_id}", response_model=List[MGT6View])
async def get_mgt6s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all mgt6s for a specific company"""
    try:
        mgt6_service = MGT6Service(db)
        mgt6s = await mgt6_service.get_mgt6s_by_company(company_id)
        return mgt6s
    except Exception as e:
        logger.error(f"Error getting mgt6s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mgt6s for company"
        )

@router.patch("/{mgt6_id}/status/{status}", response_model=MGT6View)
async def change_mgt6_status(
    mgt6_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a mgt6"""
    try:
        mgt6_service = MGT6Service(db)
        success = await mgt6_service.change_status(mgt6_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MGT6 not found"
            )
        
        # Return the updated mgt6
        mgt6 = await mgt6_service.get_mgt6(mgt6_id)
        return mgt6
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of mgt6 {mgt6_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change mgt6 status"
        )