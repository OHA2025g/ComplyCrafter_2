from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.dir6 import DIR6, DIR6Create, DIR6Update, DIR6View
from ...services.dir6_service import DIR6Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dir6", tags=["dir6"])

@router.post("/", response_model=DIR6View, status_code=status.HTTP_201_CREATED)
async def create_dir6(
    dir6_data: DIR6Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new dir6 record"""
    try:
        dir6_service = DIR6Service(db)
        dir6 = dir6_service.create_dir6(dir6_data, current_user.id)
        return dir6
    except Exception as e:
        logger.error(f"Error creating dir6: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create dir6"
        )

@router.get("/", response_model=List[DIR6View])
async def get_dir6s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all dir6s with pagination"""
    try:
        dir6_service = DIR6Service(db)
        dir6s = dir6_service.get_dir6s(skip=skip, limit=limit)
        return dir6s
    except Exception as e:
        logger.error(f"Error getting dir6s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir6s"
        )

@router.get("/{dir6_id}", response_model=DIR6View)
async def get_dir6(
    dir6_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific dir6 by ID"""
    try:
        dir6_service = DIR6Service(db)
        dir6 = dir6_service.get_dir6(dir6_id)
        if not dir6:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR6 not found"
            )
        return dir6
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting dir6 {dir6_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir6"
        )

@router.put("/{dir6_id}", response_model=DIR6View)
async def update_dir6(
    dir6_id: int,
    dir6_data: DIR6Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a dir6 record"""
    try:
        dir6_service = DIR6Service(db)
        dir6 = dir6_service.update_dir6(dir6_id, dir6_data, current_user.id)
        if not dir6:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR6 not found"
            )
        return dir6
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating dir6 {dir6_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update dir6"
        )

@router.delete("/{dir6_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dir6(
    dir6_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a dir6 record (soft delete)"""
    try:
        dir6_service = DIR6Service(db)
        success = dir6_service.delete_dir6(dir6_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR6 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting dir6 {dir6_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete dir6"
        )

@router.get("/company/{company_id}", response_model=List[DIR6View])
async def get_dir6s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all dir6s for a specific company"""
    try:
        dir6_service = DIR6Service(db)
        dir6s = dir6_service.get_dir6s_by_company(company_id)
        return dir6s
    except Exception as e:
        logger.error(f"Error getting dir6s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir6s for company"
        )

@router.patch("/{dir6_id}/status/{status}", response_model=DIR6View)
async def change_dir6_status(
    dir6_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a dir6"""
    try:
        dir6_service = DIR6Service(db)
        success = dir6_service.change_status(dir6_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR6 not found"
            )
        
        # Return the updated dir6
        dir6 = dir6_service.get_dir6(dir6_id)
        return dir6
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of dir6 {dir6_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change dir6 status"
        )