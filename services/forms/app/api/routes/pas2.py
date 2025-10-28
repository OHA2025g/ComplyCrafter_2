from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.pas2 import PAS2, PAS2Create, PAS2Update, PAS2View
from ...services.pas2_service import PAS2Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/pas2", tags=["pas2"])

@router.post("/", response_model=PAS2View, status_code=status.HTTP_201_CREATED)
async def create_pas2(
    pas2_data: PAS2Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new pas2 record"""
    try:
        pas2_service = PAS2Service(db)
        pas2 = pas2_service.create_pas2(pas2_data, current_user.id)
        return pas2
    except Exception as e:
        logger.error(f"Error creating pas2: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create pas2"
        )

@router.get("/", response_model=List[PAS2View])
async def get_pas2s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all pas2s with pagination"""
    try:
        pas2_service = PAS2Service(db)
        pas2s = pas2_service.get_pas2s(skip=skip, limit=limit)
        return pas2s
    except Exception as e:
        logger.error(f"Error getting pas2s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve pas2s"
        )

@router.get("/{pas2_id}", response_model=PAS2View)
async def get_pas2(
    pas2_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific pas2 by ID"""
    try:
        pas2_service = PAS2Service(db)
        pas2 = pas2_service.get_pas2(pas2_id)
        if not pas2:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="PAS2 not found"
            )
        return pas2
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting pas2 {pas2_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve pas2"
        )

@router.put("/{pas2_id}", response_model=PAS2View)
async def update_pas2(
    pas2_id: int,
    pas2_data: PAS2Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a pas2 record"""
    try:
        pas2_service = PAS2Service(db)
        pas2 = pas2_service.update_pas2(pas2_id, pas2_data, current_user.id)
        if not pas2:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="PAS2 not found"
            )
        return pas2
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating pas2 {pas2_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update pas2"
        )

@router.delete("/{pas2_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pas2(
    pas2_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a pas2 record (soft delete)"""
    try:
        pas2_service = PAS2Service(db)
        success = pas2_service.delete_pas2(pas2_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="PAS2 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting pas2 {pas2_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete pas2"
        )

@router.get("/company/{company_id}", response_model=List[PAS2View])
async def get_pas2s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all pas2s for a specific company"""
    try:
        pas2_service = PAS2Service(db)
        pas2s = pas2_service.get_pas2s_by_company(company_id)
        return pas2s
    except Exception as e:
        logger.error(f"Error getting pas2s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve pas2s for company"
        )

@router.patch("/{pas2_id}/status/{status}", response_model=PAS2View)
async def change_pas2_status(
    pas2_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a pas2"""
    try:
        pas2_service = PAS2Service(db)
        success = pas2_service.change_status(pas2_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="PAS2 not found"
            )
        
        # Return the updated pas2
        pas2 = pas2_service.get_pas2(pas2_id)
        return pas2
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of pas2 {pas2_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change pas2 status"
        )