from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.chg9 import CHG9, CHG9Create, CHG9Update, CHG9View
from ...services.chg9_service import CHG9Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chg9", tags=["chg9"])

@router.post("/", response_model=CHG9View, status_code=status.HTTP_201_CREATED)
async def create_chg9(
    chg9_data: CHG9Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new chg9 record"""
    try:
        chg9_service = CHG9Service(db)
        chg9 = chg9_service.create_chg9(chg9_data, current_user.id)
        return chg9
    except Exception as e:
        logger.error(f"Error creating chg9: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create chg9"
        )

@router.get("/", response_model=List[CHG9View])
async def get_chg9s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all chg9s with pagination"""
    try:
        chg9_service = CHG9Service(db)
        chg9s = chg9_service.get_chg9s(skip=skip, limit=limit)
        return chg9s
    except Exception as e:
        logger.error(f"Error getting chg9s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chg9s"
        )

@router.get("/{chg9_id}", response_model=CHG9View)
async def get_chg9(
    chg9_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific chg9 by ID"""
    try:
        chg9_service = CHG9Service(db)
        chg9 = chg9_service.get_chg9(chg9_id)
        if not chg9:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG9 not found"
            )
        return chg9
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting chg9 {chg9_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chg9"
        )

@router.put("/{chg9_id}", response_model=CHG9View)
async def update_chg9(
    chg9_id: int,
    chg9_data: CHG9Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a chg9 record"""
    try:
        chg9_service = CHG9Service(db)
        chg9 = chg9_service.update_chg9(chg9_id, chg9_data, current_user.id)
        if not chg9:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG9 not found"
            )
        return chg9
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating chg9 {chg9_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update chg9"
        )

@router.delete("/{chg9_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chg9(
    chg9_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a chg9 record (soft delete)"""
    try:
        chg9_service = CHG9Service(db)
        success = chg9_service.delete_chg9(chg9_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG9 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting chg9 {chg9_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete chg9"
        )

@router.get("/company/{company_id}", response_model=List[CHG9View])
async def get_chg9s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all chg9s for a specific company"""
    try:
        chg9_service = CHG9Service(db)
        chg9s = chg9_service.get_chg9s_by_company(company_id)
        return chg9s
    except Exception as e:
        logger.error(f"Error getting chg9s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chg9s for company"
        )

@router.patch("/{chg9_id}/status/{status}", response_model=CHG9View)
async def change_chg9_status(
    chg9_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a chg9"""
    try:
        chg9_service = CHG9Service(db)
        success = chg9_service.change_status(chg9_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG9 not found"
            )
        
        # Return the updated chg9
        chg9 = chg9_service.get_chg9(chg9_id)
        return chg9
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of chg9 {chg9_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change chg9 status"
        )