from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.sh9 import SH9, SH9Create, SH9Update, SH9View
from ...services.sh9_service import SH9Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/sh9", tags=["sh9"])

@router.post("/", response_model=SH9View, status_code=status.HTTP_201_CREATED)
async def create_sh9(
    sh9_data: SH9Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new sh9 record"""
    try:
        sh9_service = SH9Service(db)
        sh9 = await sh9_service.create_sh9(sh9_data, current_user.id)
        return sh9
    except Exception as e:
        logger.error(f"Error creating sh9: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create sh9"
        )

@router.get("/", response_model=List[SH9View])
async def get_sh9s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all sh9s with pagination"""
    try:
        sh9_service = SH9Service(db)
        sh9s = await sh9_service.get_sh9s(skip=skip, limit=limit)
        return sh9s
    except Exception as e:
        logger.error(f"Error getting sh9s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve sh9s"
        )

@router.get("/{sh9_id}", response_model=SH9View)
async def get_sh9(
    sh9_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific sh9 by ID"""
    try:
        sh9_service = SH9Service(db)
        sh9 = await sh9_service.get_sh9(sh9_id)
        if not sh9:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SH9 not found"
            )
        return sh9
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting sh9 {sh9_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve sh9"
        )

@router.put("/{sh9_id}", response_model=SH9View)
async def update_sh9(
    sh9_id: int,
    sh9_data: SH9Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a sh9 record"""
    try:
        sh9_service = SH9Service(db)
        sh9 = await sh9_service.update_sh9(sh9_id, sh9_data, current_user.id)
        if not sh9:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SH9 not found"
            )
        return sh9
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating sh9 {sh9_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update sh9"
        )

@router.delete("/{sh9_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sh9(
    sh9_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a sh9 record (soft delete)"""
    try:
        sh9_service = SH9Service(db)
        success = await sh9_service.delete_sh9(sh9_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SH9 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting sh9 {sh9_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete sh9"
        )

@router.get("/company/{company_id}", response_model=List[SH9View])
async def get_sh9s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all sh9s for a specific company"""
    try:
        sh9_service = SH9Service(db)
        sh9s = await sh9_service.get_sh9s_by_company(company_id)
        return sh9s
    except Exception as e:
        logger.error(f"Error getting sh9s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve sh9s for company"
        )

@router.patch("/{sh9_id}/status/{status}", response_model=SH9View)
async def change_sh9_status(
    sh9_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a sh9"""
    try:
        sh9_service = SH9Service(db)
        success = await sh9_service.change_status(sh9_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SH9 not found"
            )
        
        # Return the updated sh9
        sh9 = await sh9_service.get_sh9(sh9_id)
        return sh9
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of sh9 {sh9_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change sh9 status"
        )