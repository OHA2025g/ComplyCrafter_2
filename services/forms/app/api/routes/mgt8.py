from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.mgt8 import MGT8, MGT8Create, MGT8Update, MGT8View
from ...services.mgt8_service import MGT8Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/mgt8", tags=["mgt8"])

@router.post("/", response_model=MGT8View, status_code=status.HTTP_201_CREATED)
async def create_mgt8(
    mgt8_data: MGT8Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new mgt8 record"""
    try:
        mgt8_service = MGT8Service(db)
        mgt8 = mgt8_service.create_mgt8(mgt8_data, current_user.id)
        return mgt8
    except Exception as e:
        logger.error(f"Error creating mgt8: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create mgt8"
        )

@router.get("/", response_model=List[MGT8View])
async def get_mgt8s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all mgt8s with pagination"""
    try:
        mgt8_service = MGT8Service(db)
        mgt8s = mgt8_service.get_mgt8s(skip=skip, limit=limit)
        return mgt8s
    except Exception as e:
        logger.error(f"Error getting mgt8s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mgt8s"
        )

@router.get("/{mgt8_id}", response_model=MGT8View)
async def get_mgt8(
    mgt8_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific mgt8 by ID"""
    try:
        mgt8_service = MGT8Service(db)
        mgt8 = mgt8_service.get_mgt8(mgt8_id)
        if not mgt8:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MGT8 not found"
            )
        return mgt8
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting mgt8 {mgt8_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mgt8"
        )

@router.put("/{mgt8_id}", response_model=MGT8View)
async def update_mgt8(
    mgt8_id: int,
    mgt8_data: MGT8Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a mgt8 record"""
    try:
        mgt8_service = MGT8Service(db)
        mgt8 = mgt8_service.update_mgt8(mgt8_id, mgt8_data, current_user.id)
        if not mgt8:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MGT8 not found"
            )
        return mgt8
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating mgt8 {mgt8_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update mgt8"
        )

@router.delete("/{mgt8_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mgt8(
    mgt8_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a mgt8 record (soft delete)"""
    try:
        mgt8_service = MGT8Service(db)
        success = mgt8_service.delete_mgt8(mgt8_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MGT8 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting mgt8 {mgt8_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete mgt8"
        )

@router.get("/company/{company_id}", response_model=List[MGT8View])
async def get_mgt8s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all mgt8s for a specific company"""
    try:
        mgt8_service = MGT8Service(db)
        mgt8s = mgt8_service.get_mgt8s_by_company(company_id)
        return mgt8s
    except Exception as e:
        logger.error(f"Error getting mgt8s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mgt8s for company"
        )

@router.patch("/{mgt8_id}/status/{status}", response_model=MGT8View)
async def change_mgt8_status(
    mgt8_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a mgt8"""
    try:
        mgt8_service = MGT8Service(db)
        success = mgt8_service.change_status(mgt8_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MGT8 not found"
            )
        
        # Return the updated mgt8
        mgt8 = mgt8_service.get_mgt8(mgt8_id)
        return mgt8
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of mgt8 {mgt8_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change mgt8 status"
        )