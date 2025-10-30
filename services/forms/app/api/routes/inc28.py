from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.inc28 import INC28, INC28Create, INC28Update, INC28View
from ...services.inc28_service import INC28Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/inc28", tags=["inc28"])

@router.post("/", response_model=INC28View, status_code=status.HTTP_201_CREATED)
async def create_inc28(
    inc28_data: INC28Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new inc28 record"""
    try:
        inc28_service = INC28Service(db)
        inc28 = await inc28_service.create_inc28(inc28_data, current_user.id)
        return inc28
    except Exception as e:
        logger.error(f"Error creating inc28: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create inc28"
        )

@router.get("/", response_model=List[INC28View])
async def get_inc28s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all inc28s with pagination"""
    try:
        inc28_service = INC28Service(db)
        inc28s = await inc28_service.get_inc28s(skip=skip, limit=limit)
        return inc28s
    except Exception as e:
        logger.error(f"Error getting inc28s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc28s"
        )

@router.get("/{inc28_id}", response_model=INC28View)
async def get_inc28(
    inc28_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific inc28 by ID"""
    try:
        inc28_service = INC28Service(db)
        inc28 = await inc28_service.get_inc28(inc28_id)
        if not inc28:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC28 not found"
            )
        return inc28
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting inc28 {inc28_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc28"
        )

@router.put("/{inc28_id}", response_model=INC28View)
async def update_inc28(
    inc28_id: int,
    inc28_data: INC28Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a inc28 record"""
    try:
        inc28_service = INC28Service(db)
        inc28 = await inc28_service.update_inc28(inc28_id, inc28_data, current_user.id)
        if not inc28:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC28 not found"
            )
        return inc28
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating inc28 {inc28_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update inc28"
        )

@router.delete("/{inc28_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_inc28(
    inc28_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a inc28 record (soft delete)"""
    try:
        inc28_service = INC28Service(db)
        success = await inc28_service.delete_inc28(inc28_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC28 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting inc28 {inc28_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete inc28"
        )

@router.get("/company/{company_id}", response_model=List[INC28View])
async def get_inc28s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all inc28s for a specific company"""
    try:
        inc28_service = INC28Service(db)
        inc28s = await inc28_service.get_inc28s_by_company(company_id)
        return inc28s
    except Exception as e:
        logger.error(f"Error getting inc28s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc28s for company"
        )

@router.patch("/{inc28_id}/status/{status}", response_model=INC28View)
async def change_inc28_status(
    inc28_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a inc28"""
    try:
        inc28_service = INC28Service(db)
        success = await inc28_service.change_status(inc28_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC28 not found"
            )
        
        # Return the updated inc28
        inc28 = await inc28_service.get_inc28(inc28_id)
        return inc28
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of inc28 {inc28_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change inc28 status"
        )