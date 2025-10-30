from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.sh7 import SH7, SH7Create, SH7Update, SH7View
from ...services.sh7_service import SH7Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/sh7", tags=["sh7"])

@router.post("/", response_model=SH7View, status_code=status.HTTP_201_CREATED)
async def create_sh7(
    sh7_data: SH7Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new sh7 record"""
    try:
        sh7_service = SH7Service(db)
        sh7 = await sh7_service.create_sh7(sh7_data, current_user.id)
        return sh7
    except Exception as e:
        logger.error(f"Error creating sh7: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create sh7"
        )

@router.get("/", response_model=List[SH7View])
async def get_sh7s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all sh7s with pagination"""
    try:
        sh7_service = SH7Service(db)
        sh7s = await sh7_service.get_sh7s(skip=skip, limit=limit)
        return sh7s
    except Exception as e:
        logger.error(f"Error getting sh7s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve sh7s"
        )

@router.get("/{sh7_id}", response_model=SH7View)
async def get_sh7(
    sh7_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific sh7 by ID"""
    try:
        sh7_service = SH7Service(db)
        sh7 = await sh7_service.get_sh7(sh7_id)
        if not sh7:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SH7 not found"
            )
        return sh7
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting sh7 {sh7_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve sh7"
        )

@router.put("/{sh7_id}", response_model=SH7View)
async def update_sh7(
    sh7_id: int,
    sh7_data: SH7Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a sh7 record"""
    try:
        sh7_service = SH7Service(db)
        sh7 = await sh7_service.update_sh7(sh7_id, sh7_data, current_user.id)
        if not sh7:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SH7 not found"
            )
        return sh7
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating sh7 {sh7_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update sh7"
        )

@router.delete("/{sh7_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sh7(
    sh7_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a sh7 record (soft delete)"""
    try:
        sh7_service = SH7Service(db)
        success = await sh7_service.delete_sh7(sh7_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SH7 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting sh7 {sh7_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete sh7"
        )

@router.get("/company/{company_id}", response_model=List[SH7View])
async def get_sh7s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all sh7s for a specific company"""
    try:
        sh7_service = SH7Service(db)
        sh7s = await sh7_service.get_sh7s_by_company(company_id)
        return sh7s
    except Exception as e:
        logger.error(f"Error getting sh7s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve sh7s for company"
        )

@router.patch("/{sh7_id}/status/{status}", response_model=SH7View)
async def change_sh7_status(
    sh7_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a sh7"""
    try:
        sh7_service = SH7Service(db)
        success = await sh7_service.change_status(sh7_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SH7 not found"
            )
        
        # Return the updated sh7
        sh7 = await sh7_service.get_sh7(sh7_id)
        return sh7
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of sh7 {sh7_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change sh7 status"
        )