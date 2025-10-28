from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.iepf2 import IEPF2, IEPF2Create, IEPF2Update, IEPF2View
from ...services.iepf2_service import IEPF2Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/iepf2", tags=["iepf2"])

@router.post("/", response_model=IEPF2View, status_code=status.HTTP_201_CREATED)
async def create_iepf2(
    iepf2_data: IEPF2Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new iepf2 record"""
    try:
        iepf2_service = IEPF2Service(db)
        iepf2 = iepf2_service.create_iepf2(iepf2_data, current_user.id)
        return iepf2
    except Exception as e:
        logger.error(f"Error creating iepf2: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create iepf2"
        )

@router.get("/", response_model=List[IEPF2View])
async def get_iepf2s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all iepf2s with pagination"""
    try:
        iepf2_service = IEPF2Service(db)
        iepf2s = iepf2_service.get_iepf2s(skip=skip, limit=limit)
        return iepf2s
    except Exception as e:
        logger.error(f"Error getting iepf2s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve iepf2s"
        )

@router.get("/{iepf2_id}", response_model=IEPF2View)
async def get_iepf2(
    iepf2_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific iepf2 by ID"""
    try:
        iepf2_service = IEPF2Service(db)
        iepf2 = iepf2_service.get_iepf2(iepf2_id)
        if not iepf2:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="IEPF2 not found"
            )
        return iepf2
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting iepf2 {iepf2_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve iepf2"
        )

@router.put("/{iepf2_id}", response_model=IEPF2View)
async def update_iepf2(
    iepf2_id: int,
    iepf2_data: IEPF2Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a iepf2 record"""
    try:
        iepf2_service = IEPF2Service(db)
        iepf2 = iepf2_service.update_iepf2(iepf2_id, iepf2_data, current_user.id)
        if not iepf2:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="IEPF2 not found"
            )
        return iepf2
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating iepf2 {iepf2_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update iepf2"
        )

@router.delete("/{iepf2_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_iepf2(
    iepf2_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a iepf2 record (soft delete)"""
    try:
        iepf2_service = IEPF2Service(db)
        success = iepf2_service.delete_iepf2(iepf2_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="IEPF2 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting iepf2 {iepf2_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete iepf2"
        )

@router.get("/company/{company_id}", response_model=List[IEPF2View])
async def get_iepf2s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all iepf2s for a specific company"""
    try:
        iepf2_service = IEPF2Service(db)
        iepf2s = iepf2_service.get_iepf2s_by_company(company_id)
        return iepf2s
    except Exception as e:
        logger.error(f"Error getting iepf2s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve iepf2s for company"
        )

@router.patch("/{iepf2_id}/status/{status}", response_model=IEPF2View)
async def change_iepf2_status(
    iepf2_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a iepf2"""
    try:
        iepf2_service = IEPF2Service(db)
        success = iepf2_service.change_status(iepf2_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="IEPF2 not found"
            )
        
        # Return the updated iepf2
        iepf2 = iepf2_service.get_iepf2(iepf2_id)
        return iepf2
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of iepf2 {iepf2_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change iepf2 status"
        )