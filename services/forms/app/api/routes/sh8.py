from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.sh8 import SH8, SH8Create, SH8Update, SH8View
from ...services.sh8_service import SH8Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/sh8", tags=["sh8"])

@router.post("/", response_model=SH8View, status_code=status.HTTP_201_CREATED)
async def create_sh8(
    sh8_data: SH8Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new sh8 record"""
    try:
        sh8_service = SH8Service(db)
        sh8 = sh8_service.create_sh8(sh8_data, current_user.id)
        return sh8
    except Exception as e:
        logger.error(f"Error creating sh8: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create sh8"
        )

@router.get("/", response_model=List[SH8View])
async def get_sh8s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all sh8s with pagination"""
    try:
        sh8_service = SH8Service(db)
        sh8s = sh8_service.get_sh8s(skip=skip, limit=limit)
        return sh8s
    except Exception as e:
        logger.error(f"Error getting sh8s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve sh8s"
        )

@router.get("/{sh8_id}", response_model=SH8View)
async def get_sh8(
    sh8_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific sh8 by ID"""
    try:
        sh8_service = SH8Service(db)
        sh8 = sh8_service.get_sh8(sh8_id)
        if not sh8:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SH8 not found"
            )
        return sh8
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting sh8 {sh8_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve sh8"
        )

@router.put("/{sh8_id}", response_model=SH8View)
async def update_sh8(
    sh8_id: int,
    sh8_data: SH8Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a sh8 record"""
    try:
        sh8_service = SH8Service(db)
        sh8 = sh8_service.update_sh8(sh8_id, sh8_data, current_user.id)
        if not sh8:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SH8 not found"
            )
        return sh8
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating sh8 {sh8_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update sh8"
        )

@router.delete("/{sh8_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sh8(
    sh8_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a sh8 record (soft delete)"""
    try:
        sh8_service = SH8Service(db)
        success = sh8_service.delete_sh8(sh8_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SH8 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting sh8 {sh8_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete sh8"
        )

@router.get("/company/{company_id}", response_model=List[SH8View])
async def get_sh8s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all sh8s for a specific company"""
    try:
        sh8_service = SH8Service(db)
        sh8s = sh8_service.get_sh8s_by_company(company_id)
        return sh8s
    except Exception as e:
        logger.error(f"Error getting sh8s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve sh8s for company"
        )

@router.patch("/{sh8_id}/status/{status}", response_model=SH8View)
async def change_sh8_status(
    sh8_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a sh8"""
    try:
        sh8_service = SH8Service(db)
        success = sh8_service.change_status(sh8_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SH8 not found"
            )
        
        # Return the updated sh8
        sh8 = sh8_service.get_sh8(sh8_id)
        return sh8
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of sh8 {sh8_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change sh8 status"
        )