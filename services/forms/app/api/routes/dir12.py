from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.dir12 import DIR12, DIR12Create, DIR12Update, DIR12View
from ...services.dir12_service import DIR12Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dir12", tags=["dir12"])

@router.post("/", response_model=DIR12View, status_code=status.HTTP_201_CREATED)
async def create_dir12(
    dir12_data: DIR12Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new dir12 record"""
    try:
        dir12_service = DIR12Service(db)
        dir12 = dir12_service.create_dir12(dir12_data, current_user.id)
        return dir12
    except Exception as e:
        logger.error(f"Error creating dir12: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create dir12"
        )

@router.get("/", response_model=List[DIR12View])
async def get_dir12s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all dir12s with pagination"""
    try:
        dir12_service = DIR12Service(db)
        dir12s = dir12_service.get_dir12s(skip=skip, limit=limit)
        return dir12s
    except Exception as e:
        logger.error(f"Error getting dir12s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir12s"
        )

@router.get("/{dir12_id}", response_model=DIR12View)
async def get_dir12(
    dir12_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific dir12 by ID"""
    try:
        dir12_service = DIR12Service(db)
        dir12 = dir12_service.get_dir12(dir12_id)
        if not dir12:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR12 not found"
            )
        return dir12
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting dir12 {dir12_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir12"
        )

@router.put("/{dir12_id}", response_model=DIR12View)
async def update_dir12(
    dir12_id: int,
    dir12_data: DIR12Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a dir12 record"""
    try:
        dir12_service = DIR12Service(db)
        dir12 = dir12_service.update_dir12(dir12_id, dir12_data, current_user.id)
        if not dir12:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR12 not found"
            )
        return dir12
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating dir12 {dir12_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update dir12"
        )

@router.delete("/{dir12_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dir12(
    dir12_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a dir12 record (soft delete)"""
    try:
        dir12_service = DIR12Service(db)
        success = dir12_service.delete_dir12(dir12_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR12 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting dir12 {dir12_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete dir12"
        )

@router.get("/company/{company_id}", response_model=List[DIR12View])
async def get_dir12s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all dir12s for a specific company"""
    try:
        dir12_service = DIR12Service(db)
        dir12s = dir12_service.get_dir12s_by_company(company_id)
        return dir12s
    except Exception as e:
        logger.error(f"Error getting dir12s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir12s for company"
        )

@router.patch("/{dir12_id}/status/{status}", response_model=DIR12View)
async def change_dir12_status(
    dir12_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a dir12"""
    try:
        dir12_service = DIR12Service(db)
        success = dir12_service.change_status(dir12_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR12 not found"
            )
        
        # Return the updated dir12
        dir12 = dir12_service.get_dir12(dir12_id)
        return dir12
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of dir12 {dir12_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change dir12 status"
        )