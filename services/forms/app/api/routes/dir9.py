from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.dir9 import DIR9, DIR9Create, DIR9Update, DIR9View
from ...services.dir9_service import DIR9Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dir9", tags=["dir9"])

@router.post("/", response_model=DIR9View, status_code=status.HTTP_201_CREATED)
async def create_dir9(
    dir9_data: DIR9Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new dir9 record"""
    try:
        dir9_service = DIR9Service(db)
        dir9 = await dir9_service.create_dir9(dir9_data, current_user.id)
        return dir9
    except Exception as e:
        logger.error(f"Error creating dir9: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create dir9"
        )

@router.get("/", response_model=List[DIR9View])
async def get_dir9s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all dir9s with pagination"""
    try:
        dir9_service = DIR9Service(db)
        dir9s = await dir9_service.get_dir9s(skip=skip, limit=limit)
        return dir9s
    except Exception as e:
        logger.error(f"Error getting dir9s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir9s"
        )

@router.get("/{dir9_id}", response_model=DIR9View)
async def get_dir9(
    dir9_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific dir9 by ID"""
    try:
        dir9_service = DIR9Service(db)
        dir9 = await dir9_service.get_dir9(dir9_id)
        if not dir9:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR9 not found"
            )
        return dir9
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting dir9 {dir9_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir9"
        )

@router.put("/{dir9_id}", response_model=DIR9View)
async def update_dir9(
    dir9_id: int,
    dir9_data: DIR9Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a dir9 record"""
    try:
        dir9_service = DIR9Service(db)
        dir9 = await dir9_service.update_dir9(dir9_id, dir9_data, current_user.id)
        if not dir9:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR9 not found"
            )
        return dir9
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating dir9 {dir9_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update dir9"
        )

@router.delete("/{dir9_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dir9(
    dir9_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a dir9 record (soft delete)"""
    try:
        dir9_service = DIR9Service(db)
        success = await dir9_service.delete_dir9(dir9_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR9 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting dir9 {dir9_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete dir9"
        )

@router.get("/company/{company_id}", response_model=List[DIR9View])
async def get_dir9s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all dir9s for a specific company"""
    try:
        dir9_service = DIR9Service(db)
        dir9s = await dir9_service.get_dir9s_by_company(company_id)
        return dir9s
    except Exception as e:
        logger.error(f"Error getting dir9s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir9s for company"
        )

@router.patch("/{dir9_id}/status/{status}", response_model=DIR9View)
async def change_dir9_status(
    dir9_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a dir9"""
    try:
        dir9_service = DIR9Service(db)
        success = await dir9_service.change_status(dir9_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR9 not found"
            )
        
        # Return the updated dir9
        dir9 = await dir9_service.get_dir9(dir9_id)
        return dir9
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of dir9 {dir9_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change dir9 status"
        )