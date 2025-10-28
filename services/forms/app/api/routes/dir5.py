from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.dir5 import DIR5, DIR5Create, DIR5Update, DIR5View
from ...services.dir5_service import DIR5Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dir5", tags=["dir5"])

@router.post("/", response_model=DIR5View, status_code=status.HTTP_201_CREATED)
async def create_dir5(
    dir5_data: DIR5Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new dir5 record"""
    try:
        dir5_service = DIR5Service(db)
        dir5 = dir5_service.create_dir5(dir5_data, current_user.id)
        return dir5
    except Exception as e:
        logger.error(f"Error creating dir5: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create dir5"
        )

@router.get("/", response_model=List[DIR5View])
async def get_dir5s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all dir5s with pagination"""
    try:
        dir5_service = DIR5Service(db)
        dir5s = dir5_service.get_dir5s(skip=skip, limit=limit)
        return dir5s
    except Exception as e:
        logger.error(f"Error getting dir5s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir5s"
        )

@router.get("/{dir5_id}", response_model=DIR5View)
async def get_dir5(
    dir5_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific dir5 by ID"""
    try:
        dir5_service = DIR5Service(db)
        dir5 = dir5_service.get_dir5(dir5_id)
        if not dir5:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR5 not found"
            )
        return dir5
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting dir5 {dir5_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir5"
        )

@router.put("/{dir5_id}", response_model=DIR5View)
async def update_dir5(
    dir5_id: int,
    dir5_data: DIR5Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a dir5 record"""
    try:
        dir5_service = DIR5Service(db)
        dir5 = dir5_service.update_dir5(dir5_id, dir5_data, current_user.id)
        if not dir5:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR5 not found"
            )
        return dir5
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating dir5 {dir5_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update dir5"
        )

@router.delete("/{dir5_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dir5(
    dir5_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a dir5 record (soft delete)"""
    try:
        dir5_service = DIR5Service(db)
        success = dir5_service.delete_dir5(dir5_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR5 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting dir5 {dir5_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete dir5"
        )

@router.get("/company/{company_id}", response_model=List[DIR5View])
async def get_dir5s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all dir5s for a specific company"""
    try:
        dir5_service = DIR5Service(db)
        dir5s = dir5_service.get_dir5s_by_company(company_id)
        return dir5s
    except Exception as e:
        logger.error(f"Error getting dir5s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir5s for company"
        )

@router.patch("/{dir5_id}/status/{status}", response_model=DIR5View)
async def change_dir5_status(
    dir5_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a dir5"""
    try:
        dir5_service = DIR5Service(db)
        success = dir5_service.change_status(dir5_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR5 not found"
            )
        
        # Return the updated dir5
        dir5 = dir5_service.get_dir5(dir5_id)
        return dir5
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of dir5 {dir5_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change dir5 status"
        )