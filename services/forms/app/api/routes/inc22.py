from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.inc22 import INC22, INC22Create, INC22Update, INC22View
from ...services.inc22_service import INC22Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/inc22", tags=["inc22"])

@router.post("/", response_model=INC22View, status_code=status.HTTP_201_CREATED)
async def create_inc22(
    inc22_data: INC22Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new inc22 record"""
    try:
        inc22_service = INC22Service(db)
        inc22 = inc22_service.create_inc22(inc22_data, current_user.id)
        return inc22
    except Exception as e:
        logger.error(f"Error creating inc22: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create inc22"
        )

@router.get("/", response_model=List[INC22View])
async def get_inc22s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all inc22s with pagination"""
    try:
        inc22_service = INC22Service(db)
        inc22s = inc22_service.get_inc22s(skip=skip, limit=limit)
        return inc22s
    except Exception as e:
        logger.error(f"Error getting inc22s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc22s"
        )

@router.get("/{inc22_id}", response_model=INC22View)
async def get_inc22(
    inc22_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific inc22 by ID"""
    try:
        inc22_service = INC22Service(db)
        inc22 = inc22_service.get_inc22(inc22_id)
        if not inc22:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC22 not found"
            )
        return inc22
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting inc22 {inc22_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc22"
        )

@router.put("/{inc22_id}", response_model=INC22View)
async def update_inc22(
    inc22_id: int,
    inc22_data: INC22Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a inc22 record"""
    try:
        inc22_service = INC22Service(db)
        inc22 = inc22_service.update_inc22(inc22_id, inc22_data, current_user.id)
        if not inc22:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC22 not found"
            )
        return inc22
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating inc22 {inc22_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update inc22"
        )

@router.delete("/{inc22_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_inc22(
    inc22_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a inc22 record (soft delete)"""
    try:
        inc22_service = INC22Service(db)
        success = inc22_service.delete_inc22(inc22_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC22 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting inc22 {inc22_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete inc22"
        )

@router.get("/company/{company_id}", response_model=List[INC22View])
async def get_inc22s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all inc22s for a specific company"""
    try:
        inc22_service = INC22Service(db)
        inc22s = inc22_service.get_inc22s_by_company(company_id)
        return inc22s
    except Exception as e:
        logger.error(f"Error getting inc22s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc22s for company"
        )

@router.patch("/{inc22_id}/status/{status}", response_model=INC22View)
async def change_inc22_status(
    inc22_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a inc22"""
    try:
        inc22_service = INC22Service(db)
        success = inc22_service.change_status(inc22_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC22 not found"
            )
        
        # Return the updated inc22
        inc22 = inc22_service.get_inc22(inc22_id)
        return inc22
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of inc22 {inc22_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change inc22 status"
        )