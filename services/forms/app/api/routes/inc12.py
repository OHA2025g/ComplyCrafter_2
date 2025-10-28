from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.inc12 import INC12, INC12Create, INC12Update, INC12View
from ...services.inc12_service import INC12Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/inc12", tags=["inc12"])

@router.post("/", response_model=INC12View, status_code=status.HTTP_201_CREATED)
async def create_inc12(
    inc12_data: INC12Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new inc12 record"""
    try:
        inc12_service = INC12Service(db)
        inc12 = inc12_service.create_inc12(inc12_data, current_user.id)
        return inc12
    except Exception as e:
        logger.error(f"Error creating inc12: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create inc12"
        )

@router.get("/", response_model=List[INC12View])
async def get_inc12s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all inc12s with pagination"""
    try:
        inc12_service = INC12Service(db)
        inc12s = inc12_service.get_inc12s(skip=skip, limit=limit)
        return inc12s
    except Exception as e:
        logger.error(f"Error getting inc12s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc12s"
        )

@router.get("/{inc12_id}", response_model=INC12View)
async def get_inc12(
    inc12_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific inc12 by ID"""
    try:
        inc12_service = INC12Service(db)
        inc12 = inc12_service.get_inc12(inc12_id)
        if not inc12:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC12 not found"
            )
        return inc12
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting inc12 {inc12_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc12"
        )

@router.put("/{inc12_id}", response_model=INC12View)
async def update_inc12(
    inc12_id: int,
    inc12_data: INC12Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a inc12 record"""
    try:
        inc12_service = INC12Service(db)
        inc12 = inc12_service.update_inc12(inc12_id, inc12_data, current_user.id)
        if not inc12:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC12 not found"
            )
        return inc12
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating inc12 {inc12_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update inc12"
        )

@router.delete("/{inc12_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_inc12(
    inc12_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a inc12 record (soft delete)"""
    try:
        inc12_service = INC12Service(db)
        success = inc12_service.delete_inc12(inc12_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC12 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting inc12 {inc12_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete inc12"
        )

@router.get("/company/{company_id}", response_model=List[INC12View])
async def get_inc12s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all inc12s for a specific company"""
    try:
        inc12_service = INC12Service(db)
        inc12s = inc12_service.get_inc12s_by_company(company_id)
        return inc12s
    except Exception as e:
        logger.error(f"Error getting inc12s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc12s for company"
        )

@router.patch("/{inc12_id}/status/{status}", response_model=INC12View)
async def change_inc12_status(
    inc12_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a inc12"""
    try:
        inc12_service = INC12Service(db)
        success = inc12_service.change_status(inc12_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC12 not found"
            )
        
        # Return the updated inc12
        inc12 = inc12_service.get_inc12(inc12_id)
        return inc12
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of inc12 {inc12_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change inc12 status"
        )