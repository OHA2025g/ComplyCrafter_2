from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.mgt14 import MGT14, MGT14Create, MGT14Update, MGT14View
from ...services.mgt14_service import MGT14Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/mgt14", tags=["mgt14"])

@router.post("/", response_model=MGT14View, status_code=status.HTTP_201_CREATED)
async def create_mgt14(
    mgt14_data: MGT14Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new mgt14 record"""
    try:
        mgt14_service = MGT14Service(db)
        mgt14 = mgt14_service.create_mgt14(mgt14_data, current_user.id)
        return mgt14
    except Exception as e:
        logger.error(f"Error creating mgt14: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create mgt14"
        )

@router.get("/", response_model=List[MGT14View])
async def get_mgt14s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all mgt14s with pagination"""
    try:
        mgt14_service = MGT14Service(db)
        mgt14s = mgt14_service.get_mgt14s(skip=skip, limit=limit)
        return mgt14s
    except Exception as e:
        logger.error(f"Error getting mgt14s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mgt14s"
        )

@router.get("/{mgt14_id}", response_model=MGT14View)
async def get_mgt14(
    mgt14_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific mgt14 by ID"""
    try:
        mgt14_service = MGT14Service(db)
        mgt14 = mgt14_service.get_mgt14(mgt14_id)
        if not mgt14:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MGT14 not found"
            )
        return mgt14
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting mgt14 {mgt14_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mgt14"
        )

@router.put("/{mgt14_id}", response_model=MGT14View)
async def update_mgt14(
    mgt14_id: int,
    mgt14_data: MGT14Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a mgt14 record"""
    try:
        mgt14_service = MGT14Service(db)
        mgt14 = mgt14_service.update_mgt14(mgt14_id, mgt14_data, current_user.id)
        if not mgt14:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MGT14 not found"
            )
        return mgt14
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating mgt14 {mgt14_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update mgt14"
        )

@router.delete("/{mgt14_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mgt14(
    mgt14_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a mgt14 record (soft delete)"""
    try:
        mgt14_service = MGT14Service(db)
        success = mgt14_service.delete_mgt14(mgt14_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MGT14 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting mgt14 {mgt14_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete mgt14"
        )

@router.get("/company/{company_id}", response_model=List[MGT14View])
async def get_mgt14s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all mgt14s for a specific company"""
    try:
        mgt14_service = MGT14Service(db)
        mgt14s = mgt14_service.get_mgt14s_by_company(company_id)
        return mgt14s
    except Exception as e:
        logger.error(f"Error getting mgt14s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mgt14s for company"
        )

@router.patch("/{mgt14_id}/status/{status}", response_model=MGT14View)
async def change_mgt14_status(
    mgt14_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a mgt14"""
    try:
        mgt14_service = MGT14Service(db)
        success = mgt14_service.change_status(mgt14_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MGT14 not found"
            )
        
        # Return the updated mgt14
        mgt14 = mgt14_service.get_mgt14(mgt14_id)
        return mgt14
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of mgt14 {mgt14_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change mgt14 status"
        )