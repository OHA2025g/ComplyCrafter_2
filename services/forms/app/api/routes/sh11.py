from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.sh11 import SH11, SH11Create, SH11Update, SH11View
from ...services.sh11_service import SH11Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/sh11", tags=["sh11"])

@router.post("/", response_model=SH11View, status_code=status.HTTP_201_CREATED)
async def create_sh11(
    sh11_data: SH11Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new sh11 record"""
    try:
        sh11_service = SH11Service(db)
        sh11 = sh11_service.create_sh11(sh11_data, current_user.id)
        return sh11
    except Exception as e:
        logger.error(f"Error creating sh11: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create sh11"
        )

@router.get("/", response_model=List[SH11View])
async def get_sh11s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all sh11s with pagination"""
    try:
        sh11_service = SH11Service(db)
        sh11s = sh11_service.get_sh11s(skip=skip, limit=limit)
        return sh11s
    except Exception as e:
        logger.error(f"Error getting sh11s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve sh11s"
        )

@router.get("/{sh11_id}", response_model=SH11View)
async def get_sh11(
    sh11_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific sh11 by ID"""
    try:
        sh11_service = SH11Service(db)
        sh11 = sh11_service.get_sh11(sh11_id)
        if not sh11:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SH11 not found"
            )
        return sh11
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting sh11 {sh11_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve sh11"
        )

@router.put("/{sh11_id}", response_model=SH11View)
async def update_sh11(
    sh11_id: int,
    sh11_data: SH11Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a sh11 record"""
    try:
        sh11_service = SH11Service(db)
        sh11 = sh11_service.update_sh11(sh11_id, sh11_data, current_user.id)
        if not sh11:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SH11 not found"
            )
        return sh11
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating sh11 {sh11_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update sh11"
        )

@router.delete("/{sh11_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sh11(
    sh11_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a sh11 record (soft delete)"""
    try:
        sh11_service = SH11Service(db)
        success = sh11_service.delete_sh11(sh11_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SH11 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting sh11 {sh11_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete sh11"
        )

@router.get("/company/{company_id}", response_model=List[SH11View])
async def get_sh11s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all sh11s for a specific company"""
    try:
        sh11_service = SH11Service(db)
        sh11s = sh11_service.get_sh11s_by_company(company_id)
        return sh11s
    except Exception as e:
        logger.error(f"Error getting sh11s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve sh11s for company"
        )

@router.patch("/{sh11_id}/status/{status}", response_model=SH11View)
async def change_sh11_status(
    sh11_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a sh11"""
    try:
        sh11_service = SH11Service(db)
        success = sh11_service.change_status(sh11_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SH11 not found"
            )
        
        # Return the updated sh11
        sh11 = sh11_service.get_sh11(sh11_id)
        return sh11
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of sh11 {sh11_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change sh11 status"
        )