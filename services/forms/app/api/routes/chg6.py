from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.chg6 import CHG6, CHG6Create, CHG6Update, CHG6View
from ...services.chg6_service import CHG6Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chg6", tags=["chg6"])

@router.post("/", response_model=CHG6View, status_code=status.HTTP_201_CREATED)
async def create_chg6(
    chg6_data: CHG6Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new chg6 record"""
    try:
        chg6_service = CHG6Service(db)
        chg6 = chg6_service.create_chg6(chg6_data, current_user.id)
        return chg6
    except Exception as e:
        logger.error(f"Error creating chg6: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create chg6"
        )

@router.get("/", response_model=List[CHG6View])
async def get_chg6s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all chg6s with pagination"""
    try:
        chg6_service = CHG6Service(db)
        chg6s = chg6_service.get_chg6s(skip=skip, limit=limit)
        return chg6s
    except Exception as e:
        logger.error(f"Error getting chg6s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chg6s"
        )

@router.get("/{chg6_id}", response_model=CHG6View)
async def get_chg6(
    chg6_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific chg6 by ID"""
    try:
        chg6_service = CHG6Service(db)
        chg6 = chg6_service.get_chg6(chg6_id)
        if not chg6:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG6 not found"
            )
        return chg6
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting chg6 {chg6_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chg6"
        )

@router.put("/{chg6_id}", response_model=CHG6View)
async def update_chg6(
    chg6_id: int,
    chg6_data: CHG6Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a chg6 record"""
    try:
        chg6_service = CHG6Service(db)
        chg6 = chg6_service.update_chg6(chg6_id, chg6_data, current_user.id)
        if not chg6:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG6 not found"
            )
        return chg6
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating chg6 {chg6_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update chg6"
        )

@router.delete("/{chg6_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chg6(
    chg6_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a chg6 record (soft delete)"""
    try:
        chg6_service = CHG6Service(db)
        success = chg6_service.delete_chg6(chg6_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG6 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting chg6 {chg6_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete chg6"
        )

@router.get("/company/{company_id}", response_model=List[CHG6View])
async def get_chg6s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all chg6s for a specific company"""
    try:
        chg6_service = CHG6Service(db)
        chg6s = chg6_service.get_chg6s_by_company(company_id)
        return chg6s
    except Exception as e:
        logger.error(f"Error getting chg6s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chg6s for company"
        )

@router.patch("/{chg6_id}/status/{status}", response_model=CHG6View)
async def change_chg6_status(
    chg6_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a chg6"""
    try:
        chg6_service = CHG6Service(db)
        success = chg6_service.change_status(chg6_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHG6 not found"
            )
        
        # Return the updated chg6
        chg6 = chg6_service.get_chg6(chg6_id)
        return chg6
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of chg6 {chg6_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change chg6 status"
        )