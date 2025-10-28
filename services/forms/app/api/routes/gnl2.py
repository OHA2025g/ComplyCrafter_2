from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.gnl2 import GNL2, GNL2Create, GNL2Update, GNL2View
from ...services.gnl2_service import GNL2Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/gnl2", tags=["gnl2"])

@router.post("/", response_model=GNL2View, status_code=status.HTTP_201_CREATED)
async def create_gnl2(
    gnl2_data: GNL2Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new gnl2 record"""
    try:
        gnl2_service = GNL2Service(db)
        gnl2 = gnl2_service.create_gnl2(gnl2_data, current_user.id)
        return gnl2
    except Exception as e:
        logger.error(f"Error creating gnl2: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create gnl2"
        )

@router.get("/", response_model=List[GNL2View])
async def get_gnl2s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all gnl2s with pagination"""
    try:
        gnl2_service = GNL2Service(db)
        gnl2s = gnl2_service.get_gnl2s(skip=skip, limit=limit)
        return gnl2s
    except Exception as e:
        logger.error(f"Error getting gnl2s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve gnl2s"
        )

@router.get("/{gnl2_id}", response_model=GNL2View)
async def get_gnl2(
    gnl2_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific gnl2 by ID"""
    try:
        gnl2_service = GNL2Service(db)
        gnl2 = gnl2_service.get_gnl2(gnl2_id)
        if not gnl2:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="GNL2 not found"
            )
        return gnl2
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting gnl2 {gnl2_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve gnl2"
        )

@router.put("/{gnl2_id}", response_model=GNL2View)
async def update_gnl2(
    gnl2_id: int,
    gnl2_data: GNL2Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a gnl2 record"""
    try:
        gnl2_service = GNL2Service(db)
        gnl2 = gnl2_service.update_gnl2(gnl2_id, gnl2_data, current_user.id)
        if not gnl2:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="GNL2 not found"
            )
        return gnl2
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating gnl2 {gnl2_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update gnl2"
        )

@router.delete("/{gnl2_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_gnl2(
    gnl2_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a gnl2 record (soft delete)"""
    try:
        gnl2_service = GNL2Service(db)
        success = gnl2_service.delete_gnl2(gnl2_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="GNL2 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting gnl2 {gnl2_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete gnl2"
        )

@router.get("/company/{company_id}", response_model=List[GNL2View])
async def get_gnl2s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all gnl2s for a specific company"""
    try:
        gnl2_service = GNL2Service(db)
        gnl2s = gnl2_service.get_gnl2s_by_company(company_id)
        return gnl2s
    except Exception as e:
        logger.error(f"Error getting gnl2s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve gnl2s for company"
        )

@router.patch("/{gnl2_id}/status/{status}", response_model=GNL2View)
async def change_gnl2_status(
    gnl2_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a gnl2"""
    try:
        gnl2_service = GNL2Service(db)
        success = gnl2_service.change_status(gnl2_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="GNL2 not found"
            )
        
        # Return the updated gnl2
        gnl2 = gnl2_service.get_gnl2(gnl2_id)
        return gnl2
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of gnl2 {gnl2_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change gnl2 status"
        )