from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.dir3 import DIR3, DIR3Create, DIR3Update, DIR3View
from ...services.dir3_service import DIR3Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dir3", tags=["dir3"])

@router.post("/", response_model=DIR3View, status_code=status.HTTP_201_CREATED)
async def create_dir3(
    dir3_data: DIR3Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new dir3 record"""
    try:
        dir3_service = DIR3Service(db)
        dir3 = await dir3_service.create_dir3(dir3_data, current_user.id)
        return dir3
    except Exception as e:
        logger.error(f"Error creating dir3: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create dir3"
        )

@router.get("/", response_model=List[DIR3View])
async def get_dir3s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all dir3s with pagination"""
    try:
        dir3_service = DIR3Service(db)
        dir3s = await dir3_service.get_dir3s(skip=skip, limit=limit)
        return dir3s
    except Exception as e:
        logger.error(f"Error getting dir3s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir3s"
        )

@router.get("/{dir3_id}", response_model=DIR3View)
async def get_dir3(
    dir3_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific dir3 by ID"""
    try:
        dir3_service = DIR3Service(db)
        dir3 = await dir3_service.get_dir3(dir3_id)
        if not dir3:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR3 not found"
            )
        return dir3
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting dir3 {dir3_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir3"
        )

@router.put("/{dir3_id}", response_model=DIR3View)
async def update_dir3(
    dir3_id: int,
    dir3_data: DIR3Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a dir3 record"""
    try:
        dir3_service = DIR3Service(db)
        dir3 = await dir3_service.update_dir3(dir3_id, dir3_data, current_user.id)
        if not dir3:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR3 not found"
            )
        return dir3
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating dir3 {dir3_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update dir3"
        )

@router.delete("/{dir3_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dir3(
    dir3_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a dir3 record (soft delete)"""
    try:
        dir3_service = DIR3Service(db)
        success = await dir3_service.delete_dir3(dir3_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR3 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting dir3 {dir3_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete dir3"
        )

@router.get("/company/{company_id}", response_model=List[DIR3View])
async def get_dir3s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all dir3s for a specific company"""
    try:
        dir3_service = DIR3Service(db)
        dir3s = await dir3_service.get_dir3s_by_company(company_id)
        return dir3s
    except Exception as e:
        logger.error(f"Error getting dir3s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dir3s for company"
        )

@router.patch("/{dir3_id}/status/{status}", response_model=DIR3View)
async def change_dir3_status(
    dir3_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a dir3"""
    try:
        dir3_service = DIR3Service(db)
        success = await dir3_service.change_status(dir3_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DIR3 not found"
            )
        
        # Return the updated dir3
        dir3 = await dir3_service.get_dir3(dir3_id)
        return dir3
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of dir3 {dir3_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change dir3 status"
        )