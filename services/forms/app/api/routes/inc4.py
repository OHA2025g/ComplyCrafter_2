from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.inc4 import INC4, INC4Create, INC4Update, INC4View
from ...services.inc4_service import INC4Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/inc4", tags=["inc4"])

@router.post("/", response_model=INC4View, status_code=status.HTTP_201_CREATED)
async def create_inc4(
    inc4_data: INC4Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new inc4 record"""
    try:
        inc4_service = INC4Service(db)
        inc4 = inc4_service.create_inc4(inc4_data, current_user.id)
        return inc4
    except Exception as e:
        logger.error(f"Error creating inc4: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create inc4"
        )

@router.get("/", response_model=List[INC4View])
async def get_inc4s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all inc4s with pagination"""
    try:
        inc4_service = INC4Service(db)
        inc4s = inc4_service.get_inc4s(skip=skip, limit=limit)
        return inc4s
    except Exception as e:
        logger.error(f"Error getting inc4s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc4s"
        )

@router.get("/{inc4_id}", response_model=INC4View)
async def get_inc4(
    inc4_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific inc4 by ID"""
    try:
        inc4_service = INC4Service(db)
        inc4 = inc4_service.get_inc4(inc4_id)
        if not inc4:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC4 not found"
            )
        return inc4
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting inc4 {inc4_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc4"
        )

@router.put("/{inc4_id}", response_model=INC4View)
async def update_inc4(
    inc4_id: int,
    inc4_data: INC4Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a inc4 record"""
    try:
        inc4_service = INC4Service(db)
        inc4 = inc4_service.update_inc4(inc4_id, inc4_data, current_user.id)
        if not inc4:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC4 not found"
            )
        return inc4
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating inc4 {inc4_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update inc4"
        )

@router.delete("/{inc4_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_inc4(
    inc4_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a inc4 record (soft delete)"""
    try:
        inc4_service = INC4Service(db)
        success = inc4_service.delete_inc4(inc4_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC4 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting inc4 {inc4_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete inc4"
        )

@router.get("/company/{company_id}", response_model=List[INC4View])
async def get_inc4s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all inc4s for a specific company"""
    try:
        inc4_service = INC4Service(db)
        inc4s = inc4_service.get_inc4s_by_company(company_id)
        return inc4s
    except Exception as e:
        logger.error(f"Error getting inc4s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc4s for company"
        )

@router.patch("/{inc4_id}/status/{status}", response_model=INC4View)
async def change_inc4_status(
    inc4_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a inc4"""
    try:
        inc4_service = INC4Service(db)
        success = inc4_service.change_status(inc4_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC4 not found"
            )
        
        # Return the updated inc4
        inc4 = inc4_service.get_inc4(inc4_id)
        return inc4
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of inc4 {inc4_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change inc4 status"
        )