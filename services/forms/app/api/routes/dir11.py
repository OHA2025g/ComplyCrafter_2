from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.dir11 import DIR11, DIR11Create, DIR11Update, DIR11View
from ...services.dir11_service import DIR11Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dir11", tags=["dir11"])

@router.post("/", response_model=DIR11View, status_code=status.HTTP_201_CREATED)
async def create_dir11(
    dir11_data: DIR11Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new dir11 record"""
    try:
        dir11_service = DIR11Service(db)
        dir11 = await dir11_service.create_dir11(dir11_data, current_user.id)
        return dir11
    except Exception as e:
        logger.error(f"Error creating dir11: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create dir11"
        )

@router.get("/", response_model=List[DIR11View])
async def get_dir11s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all dir11s with pagination"""
    try:
        dir11_service = DIR11Service(db)
        dir11s = await dir11_service.get_dir11s(skip=skip, limit=limit)
        return dir11s
    except Exception as e:
        logger.error(f"Error getting dir11s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir11s"
        )

@router.get("/{dir11_id}", response_model=DIR11View)
async def get_dir11(
    dir11_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific dir11 by ID"""
    try:
        dir11_service = DIR11Service(db)
        dir11 = await dir11_service.get_dir11(dir11_id)
        if not dir11:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR11 not found"
            )
        return dir11
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting dir11 {dir11_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir11"
        )

@router.put("/{dir11_id}", response_model=DIR11View)
async def update_dir11(
    dir11_id: int,
    dir11_data: DIR11Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a dir11 record"""
    try:
        dir11_service = DIR11Service(db)
        dir11 = await dir11_service.update_dir11(dir11_id, dir11_data, current_user.id)
        if not dir11:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR11 not found"
            )
        return dir11
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating dir11 {dir11_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update dir11"
        )

@router.delete("/{dir11_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dir11(
    dir11_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a dir11 record (soft delete)"""
    try:
        dir11_service = DIR11Service(db)
        success = await dir11_service.delete_dir11(dir11_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR11 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting dir11 {dir11_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete dir11"
        )

@router.get("/company/{company_id}", response_model=List[DIR11View])
async def get_dir11s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all dir11s for a specific company"""
    try:
        dir11_service = DIR11Service(db)
        dir11s = await dir11_service.get_dir11s_by_company(company_id)
        return dir11s
    except Exception as e:
        logger.error(f"Error getting dir11s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir11s for company"
        )

@router.patch("/{dir11_id}/status/{status}", response_model=DIR11View)
async def change_dir11_status(
    dir11_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a dir11"""
    try:
        dir11_service = DIR11Service(db)
        success = await dir11_service.change_status(dir11_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR11 not found"
            )
        
        # Return the updated dir11
        dir11 = await dir11_service.get_dir11(dir11_id)
        return dir11
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of dir11 {dir11_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change dir11 status"
        )