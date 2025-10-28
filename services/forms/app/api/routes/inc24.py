from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.inc24 import INC24, INC24Create, INC24Update, INC24View
from ...services.inc24_service import INC24Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/inc24", tags=["inc24"])

@router.post("/", response_model=INC24View, status_code=status.HTTP_201_CREATED)
async def create_inc24(
    inc24_data: INC24Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new inc24 record"""
    try:
        inc24_service = INC24Service(db)
        inc24 = inc24_service.create_inc24(inc24_data, current_user.id)
        return inc24
    except Exception as e:
        logger.error(f"Error creating inc24: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create inc24"
        )

@router.get("/", response_model=List[INC24View])
async def get_inc24s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all inc24s with pagination"""
    try:
        inc24_service = INC24Service(db)
        inc24s = inc24_service.get_inc24s(skip=skip, limit=limit)
        return inc24s
    except Exception as e:
        logger.error(f"Error getting inc24s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc24s"
        )

@router.get("/{inc24_id}", response_model=INC24View)
async def get_inc24(
    inc24_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific inc24 by ID"""
    try:
        inc24_service = INC24Service(db)
        inc24 = inc24_service.get_inc24(inc24_id)
        if not inc24:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC24 not found"
            )
        return inc24
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting inc24 {inc24_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc24"
        )

@router.put("/{inc24_id}", response_model=INC24View)
async def update_inc24(
    inc24_id: int,
    inc24_data: INC24Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a inc24 record"""
    try:
        inc24_service = INC24Service(db)
        inc24 = inc24_service.update_inc24(inc24_id, inc24_data, current_user.id)
        if not inc24:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC24 not found"
            )
        return inc24
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating inc24 {inc24_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update inc24"
        )

@router.delete("/{inc24_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_inc24(
    inc24_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a inc24 record (soft delete)"""
    try:
        inc24_service = INC24Service(db)
        success = inc24_service.delete_inc24(inc24_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC24 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting inc24 {inc24_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete inc24"
        )

@router.get("/company/{company_id}", response_model=List[INC24View])
async def get_inc24s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all inc24s for a specific company"""
    try:
        inc24_service = INC24Service(db)
        inc24s = inc24_service.get_inc24s_by_company(company_id)
        return inc24s
    except Exception as e:
        logger.error(f"Error getting inc24s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc24s for company"
        )

@router.patch("/{inc24_id}/status/{status}", response_model=INC24View)
async def change_inc24_status(
    inc24_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a inc24"""
    try:
        inc24_service = INC24Service(db)
        success = inc24_service.change_status(inc24_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC24 not found"
            )
        
        # Return the updated inc24
        inc24 = inc24_service.get_inc24(inc24_id)
        return inc24
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of inc24 {inc24_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change inc24 status"
        )