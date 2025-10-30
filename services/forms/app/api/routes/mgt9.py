from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.mgt9 import MGT9, MGT9Create, MGT9Update, MGT9View
from ...services.mgt9_service import MGT9Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/mgt9", tags=["mgt9"])

@router.post("/", response_model=MGT9View, status_code=status.HTTP_201_CREATED)
async def create_mgt9(
    mgt9_data: MGT9Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new mgt9 record"""
    try:
        mgt9_service = MGT9Service(db)
        mgt9 = await mgt9_service.create_mgt9(mgt9_data, current_user.id)
        return mgt9
    except Exception as e:
        logger.error(f"Error creating mgt9: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create mgt9"
        )

@router.get("/", response_model=List[MGT9View])
async def get_mgt9s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all mgt9s with pagination"""
    try:
        mgt9_service = MGT9Service(db)
        mgt9s = await mgt9_service.get_mgt9s(skip=skip, limit=limit)
        return mgt9s
    except Exception as e:
        logger.error(f"Error getting mgt9s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mgt9s"
        )

@router.get("/{mgt9_id}", response_model=MGT9View)
async def get_mgt9(
    mgt9_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific mgt9 by ID"""
    try:
        mgt9_service = MGT9Service(db)
        mgt9 = await mgt9_service.get_mgt9(mgt9_id)
        if not mgt9:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MGT9 not found"
            )
        return mgt9
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting mgt9 {mgt9_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mgt9"
        )

@router.put("/{mgt9_id}", response_model=MGT9View)
async def update_mgt9(
    mgt9_id: int,
    mgt9_data: MGT9Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a mgt9 record"""
    try:
        mgt9_service = MGT9Service(db)
        mgt9 = await mgt9_service.update_mgt9(mgt9_id, mgt9_data, current_user.id)
        if not mgt9:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MGT9 not found"
            )
        return mgt9
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating mgt9 {mgt9_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update mgt9"
        )

@router.delete("/{mgt9_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mgt9(
    mgt9_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a mgt9 record (soft delete)"""
    try:
        mgt9_service = MGT9Service(db)
        success = await mgt9_service.delete_mgt9(mgt9_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MGT9 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting mgt9 {mgt9_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete mgt9"
        )

@router.get("/company/{company_id}", response_model=List[MGT9View])
async def get_mgt9s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all mgt9s for a specific company"""
    try:
        mgt9_service = MGT9Service(db)
        mgt9s = await mgt9_service.get_mgt9s_by_company(company_id)
        return mgt9s
    except Exception as e:
        logger.error(f"Error getting mgt9s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mgt9s for company"
        )

@router.patch("/{mgt9_id}/status/{status}", response_model=MGT9View)
async def change_mgt9_status(
    mgt9_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a mgt9"""
    try:
        mgt9_service = MGT9Service(db)
        success = await mgt9_service.change_status(mgt9_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MGT9 not found"
            )
        
        # Return the updated mgt9
        mgt9 = await mgt9_service.get_mgt9(mgt9_id)
        return mgt9
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of mgt9 {mgt9_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change mgt9 status"
        )