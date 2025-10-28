from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.dpt4 import DPT4, DPT4Create, DPT4Update, DPT4View
from ...services.dpt4_service import DPT4Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dpt4", tags=["dpt4"])

@router.post("/", response_model=DPT4View, status_code=status.HTTP_201_CREATED)
async def create_dpt4(
    dpt4_data: DPT4Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new dpt4 record"""
    try:
        dpt4_service = DPT4Service(db)
        dpt4 = dpt4_service.create_dpt4(dpt4_data, current_user.id)
        return dpt4
    except Exception as e:
        logger.error(f"Error creating dpt4: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create dpt4"
        )

@router.get("/", response_model=List[DPT4View])
async def get_dpt4s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all dpt4s with pagination"""
    try:
        dpt4_service = DPT4Service(db)
        dpt4s = dpt4_service.get_dpt4s(skip=skip, limit=limit)
        return dpt4s
    except Exception as e:
        logger.error(f"Error getting dpt4s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dpt4s"
        )

@router.get("/{dpt4_id}", response_model=DPT4View)
async def get_dpt4(
    dpt4_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific dpt4 by ID"""
    try:
        dpt4_service = DPT4Service(db)
        dpt4 = dpt4_service.get_dpt4(dpt4_id)
        if not dpt4:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DPT4 not found"
            )
        return dpt4
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting dpt4 {dpt4_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dpt4"
        )

@router.put("/{dpt4_id}", response_model=DPT4View)
async def update_dpt4(
    dpt4_id: int,
    dpt4_data: DPT4Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a dpt4 record"""
    try:
        dpt4_service = DPT4Service(db)
        dpt4 = dpt4_service.update_dpt4(dpt4_id, dpt4_data, current_user.id)
        if not dpt4:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DPT4 not found"
            )
        return dpt4
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating dpt4 {dpt4_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update dpt4"
        )

@router.delete("/{dpt4_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dpt4(
    dpt4_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a dpt4 record (soft delete)"""
    try:
        dpt4_service = DPT4Service(db)
        success = dpt4_service.delete_dpt4(dpt4_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DPT4 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting dpt4 {dpt4_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete dpt4"
        )

@router.get("/company/{company_id}", response_model=List[DPT4View])
async def get_dpt4s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all dpt4s for a specific company"""
    try:
        dpt4_service = DPT4Service(db)
        dpt4s = dpt4_service.get_dpt4s_by_company(company_id)
        return dpt4s
    except Exception as e:
        logger.error(f"Error getting dpt4s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dpt4s for company"
        )

@router.patch("/{dpt4_id}/status/{status}", response_model=DPT4View)
async def change_dpt4_status(
    dpt4_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a dpt4"""
    try:
        dpt4_service = DPT4Service(db)
        success = dpt4_service.change_status(dpt4_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DPT4 not found"
            )
        
        # Return the updated dpt4
        dpt4 = dpt4_service.get_dpt4(dpt4_id)
        return dpt4
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of dpt4 {dpt4_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change dpt4 status"
        )