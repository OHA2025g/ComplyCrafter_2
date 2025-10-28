from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.gnl3 import GNL3, GNL3Create, GNL3Update, GNL3View
from ...services.gnl3_service import GNL3Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/gnl3", tags=["gnl3"])

@router.post("/", response_model=GNL3View, status_code=status.HTTP_201_CREATED)
async def create_gnl3(
    gnl3_data: GNL3Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new gnl3 record"""
    try:
        gnl3_service = GNL3Service(db)
        gnl3 = gnl3_service.create_gnl3(gnl3_data, current_user.id)
        return gnl3
    except Exception as e:
        logger.error(f"Error creating gnl3: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create gnl3"
        )

@router.get("/", response_model=List[GNL3View])
async def get_gnl3s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all gnl3s with pagination"""
    try:
        gnl3_service = GNL3Service(db)
        gnl3s = gnl3_service.get_gnl3s(skip=skip, limit=limit)
        return gnl3s
    except Exception as e:
        logger.error(f"Error getting gnl3s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve gnl3s"
        )

@router.get("/{gnl3_id}", response_model=GNL3View)
async def get_gnl3(
    gnl3_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific gnl3 by ID"""
    try:
        gnl3_service = GNL3Service(db)
        gnl3 = gnl3_service.get_gnl3(gnl3_id)
        if not gnl3:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="GNL3 not found"
            )
        return gnl3
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting gnl3 {gnl3_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve gnl3"
        )

@router.put("/{gnl3_id}", response_model=GNL3View)
async def update_gnl3(
    gnl3_id: int,
    gnl3_data: GNL3Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a gnl3 record"""
    try:
        gnl3_service = GNL3Service(db)
        gnl3 = gnl3_service.update_gnl3(gnl3_id, gnl3_data, current_user.id)
        if not gnl3:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="GNL3 not found"
            )
        return gnl3
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating gnl3 {gnl3_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update gnl3"
        )

@router.delete("/{gnl3_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_gnl3(
    gnl3_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a gnl3 record (soft delete)"""
    try:
        gnl3_service = GNL3Service(db)
        success = gnl3_service.delete_gnl3(gnl3_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="GNL3 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting gnl3 {gnl3_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete gnl3"
        )

@router.get("/company/{company_id}", response_model=List[GNL3View])
async def get_gnl3s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all gnl3s for a specific company"""
    try:
        gnl3_service = GNL3Service(db)
        gnl3s = gnl3_service.get_gnl3s_by_company(company_id)
        return gnl3s
    except Exception as e:
        logger.error(f"Error getting gnl3s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve gnl3s for company"
        )

@router.patch("/{gnl3_id}/status/{status}", response_model=GNL3View)
async def change_gnl3_status(
    gnl3_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a gnl3"""
    try:
        gnl3_service = GNL3Service(db)
        success = gnl3_service.change_status(gnl3_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="GNL3 not found"
            )
        
        # Return the updated gnl3
        gnl3 = gnl3_service.get_gnl3(gnl3_id)
        return gnl3
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of gnl3 {gnl3_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change gnl3 status"
        )