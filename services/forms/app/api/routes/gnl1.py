from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.gnl1 import GNL1, GNL1Create, GNL1Update, GNL1View
from ...services.gnl1_service import GNL1Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/gnl1", tags=["gnl1"])

@router.post("/", response_model=GNL1View, status_code=status.HTTP_201_CREATED)
async def create_gnl1(
    gnl1_data: GNL1Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new gnl1 record"""
    try:
        gnl1_service = GNL1Service(db)
        gnl1 = await gnl1_service.create_gnl1(gnl1_data, current_user.id)
        return gnl1
    except Exception as e:
        logger.error(f"Error creating gnl1: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create gnl1"
        )

@router.get("/", response_model=List[GNL1View])
async def get_gnl1s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all gnl1s with pagination"""
    try:
        gnl1_service = GNL1Service(db)
        gnl1s = await gnl1_service.get_gnl1s(skip=skip, limit=limit)
        return gnl1s
    except Exception as e:
        logger.error(f"Error getting gnl1s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve gnl1s"
        )

@router.get("/{gnl1_id}", response_model=GNL1View)
async def get_gnl1(
    gnl1_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific gnl1 by ID"""
    try:
        gnl1_service = GNL1Service(db)
        gnl1 = await gnl1_service.get_gnl1(gnl1_id)
        if not gnl1:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="GNL1 not found"
            )
        return gnl1
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting gnl1 {gnl1_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve gnl1"
        )

@router.put("/{gnl1_id}", response_model=GNL1View)
async def update_gnl1(
    gnl1_id: int,
    gnl1_data: GNL1Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a gnl1 record"""
    try:
        gnl1_service = GNL1Service(db)
        gnl1 = await gnl1_service.update_gnl1(gnl1_id, gnl1_data, current_user.id)
        if not gnl1:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="GNL1 not found"
            )
        return gnl1
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating gnl1 {gnl1_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update gnl1"
        )

@router.delete("/{gnl1_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_gnl1(
    gnl1_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a gnl1 record (soft delete)"""
    try:
        gnl1_service = GNL1Service(db)
        success = await gnl1_service.delete_gnl1(gnl1_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="GNL1 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting gnl1 {gnl1_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete gnl1"
        )

@router.get("/company/{company_id}", response_model=List[GNL1View])
async def get_gnl1s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all gnl1s for a specific company"""
    try:
        gnl1_service = GNL1Service(db)
        gnl1s = await gnl1_service.get_gnl1s_by_company(company_id)
        return gnl1s
    except Exception as e:
        logger.error(f"Error getting gnl1s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve gnl1s for company"
        )

@router.patch("/{gnl1_id}/status/{status}", response_model=GNL1View)
async def change_gnl1_status(
    gnl1_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a gnl1"""
    try:
        gnl1_service = GNL1Service(db)
        success = await gnl1_service.change_status(gnl1_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="GNL1 not found"
            )
        
        # Return the updated gnl1
        gnl1 = await gnl1_service.get_gnl1(gnl1_id)
        return gnl1
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of gnl1 {gnl1_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change gnl1 status"
        )