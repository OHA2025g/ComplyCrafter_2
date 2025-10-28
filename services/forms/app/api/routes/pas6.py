from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.pas6 import PAS6, PAS6Create, PAS6Update, PAS6View
from ...services.pas6_service import PAS6Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/pas6", tags=["pas6"])

@router.post("/", response_model=PAS6View, status_code=status.HTTP_201_CREATED)
async def create_pas6(
    pas6_data: PAS6Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new pas6 record"""
    try:
        pas6_service = PAS6Service(db)
        pas6 = pas6_service.create_pas6(pas6_data, current_user.id)
        return pas6
    except Exception as e:
        logger.error(f"Error creating pas6: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create pas6"
        )

@router.get("/", response_model=List[PAS6View])
async def get_pas6s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all pas6s with pagination"""
    try:
        pas6_service = PAS6Service(db)
        pas6s = pas6_service.get_pas6s(skip=skip, limit=limit)
        return pas6s
    except Exception as e:
        logger.error(f"Error getting pas6s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve pas6s"
        )

@router.get("/{pas6_id}", response_model=PAS6View)
async def get_pas6(
    pas6_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific pas6 by ID"""
    try:
        pas6_service = PAS6Service(db)
        pas6 = pas6_service.get_pas6(pas6_id)
        if not pas6:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="PAS6 not found"
            )
        return pas6
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting pas6 {pas6_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve pas6"
        )

@router.put("/{pas6_id}", response_model=PAS6View)
async def update_pas6(
    pas6_id: int,
    pas6_data: PAS6Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a pas6 record"""
    try:
        pas6_service = PAS6Service(db)
        pas6 = pas6_service.update_pas6(pas6_id, pas6_data, current_user.id)
        if not pas6:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="PAS6 not found"
            )
        return pas6
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating pas6 {pas6_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update pas6"
        )

@router.delete("/{pas6_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pas6(
    pas6_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a pas6 record (soft delete)"""
    try:
        pas6_service = PAS6Service(db)
        success = pas6_service.delete_pas6(pas6_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="PAS6 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting pas6 {pas6_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete pas6"
        )

@router.get("/company/{company_id}", response_model=List[PAS6View])
async def get_pas6s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all pas6s for a specific company"""
    try:
        pas6_service = PAS6Service(db)
        pas6s = pas6_service.get_pas6s_by_company(company_id)
        return pas6s
    except Exception as e:
        logger.error(f"Error getting pas6s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve pas6s for company"
        )

@router.patch("/{pas6_id}/status/{status}", response_model=PAS6View)
async def change_pas6_status(
    pas6_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a pas6"""
    try:
        pas6_service = PAS6Service(db)
        success = pas6_service.change_status(pas6_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="PAS6 not found"
            )
        
        # Return the updated pas6
        pas6 = pas6_service.get_pas6(pas6_id)
        return pas6
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of pas6 {pas6_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change pas6 status"
        )