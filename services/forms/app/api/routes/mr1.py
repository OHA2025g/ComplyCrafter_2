from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.mr1 import MR1, MR1Create, MR1Update, MR1View
from ...services.mr1_service import MR1Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/mr1", tags=["mr1"])

@router.post("/", response_model=MR1View, status_code=status.HTTP_201_CREATED)
async def create_mr1(
    mr1_data: MR1Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new mr1 record"""
    try:
        mr1_service = MR1Service(db)
        mr1 = await mr1_service.create_mr1(mr1_data, current_user.id)
        return mr1
    except Exception as e:
        logger.error(f"Error creating mr1: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create mr1"
        )

@router.get("/", response_model=List[MR1View])
async def get_mr1s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all mr1s with pagination"""
    try:
        mr1_service = MR1Service(db)
        mr1s = await mr1_service.get_mr1s(skip=skip, limit=limit)
        return mr1s
    except Exception as e:
        logger.error(f"Error getting mr1s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mr1s"
        )

@router.get("/{mr1_id}", response_model=MR1View)
async def get_mr1(
    mr1_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific mr1 by ID"""
    try:
        mr1_service = MR1Service(db)
        mr1 = await mr1_service.get_mr1(mr1_id)
        if not mr1:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MR1 not found"
            )
        return mr1
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting mr1 {mr1_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mr1"
        )

@router.put("/{mr1_id}", response_model=MR1View)
async def update_mr1(
    mr1_id: int,
    mr1_data: MR1Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a mr1 record"""
    try:
        mr1_service = MR1Service(db)
        mr1 = await mr1_service.update_mr1(mr1_id, mr1_data, current_user.id)
        if not mr1:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MR1 not found"
            )
        return mr1
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating mr1 {mr1_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update mr1"
        )

@router.delete("/{mr1_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mr1(
    mr1_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a mr1 record (soft delete)"""
    try:
        mr1_service = MR1Service(db)
        success = await mr1_service.delete_mr1(mr1_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MR1 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting mr1 {mr1_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete mr1"
        )

@router.get("/company/{company_id}", response_model=List[MR1View])
async def get_mr1s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all mr1s for a specific company"""
    try:
        mr1_service = MR1Service(db)
        mr1s = await mr1_service.get_mr1s_by_company(company_id)
        return mr1s
    except Exception as e:
        logger.error(f"Error getting mr1s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mr1s for company"
        )

@router.patch("/{mr1_id}/status/{status}", response_model=MR1View)
async def change_mr1_status(
    mr1_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a mr1"""
    try:
        mr1_service = MR1Service(db)
        success = await mr1_service.change_status(mr1_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MR1 not found"
            )
        
        # Return the updated mr1
        mr1 = await mr1_service.get_mr1(mr1_id)
        return mr1
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of mr1 {mr1_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change mr1 status"
        )