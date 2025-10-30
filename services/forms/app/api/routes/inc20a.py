from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.inc20a import INC20A, INC20ACreate, INC20AUpdate, INC20AView
from ...services.inc20a_service import INC20AService
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/inc20a", tags=["inc20a"])

@router.post("/", response_model=INC20AView, status_code=status.HTTP_201_CREATED)
async def create_inc20a(
    inc20a_data: INC20ACreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new inc20a record"""
    try:
        inc20a_service = INC20AService(db)
        inc20a = await inc20a_service.create_inc20a(inc20a_data, current_user.id)
        return inc20a
    except Exception as e:
        logger.error(f"Error creating inc20a: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create inc20a"
        )

@router.get("/", response_model=List[INC20AView])
async def get_inc20as(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all inc20as with pagination"""
    try:
        inc20a_service = INC20AService(db)
        inc20as = await inc20a_service.get_inc20as(skip=skip, limit=limit)
        return inc20as
    except Exception as e:
        logger.error(f"Error getting inc20as: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc20as"
        )

@router.get("/{inc20a_id}", response_model=INC20AView)
async def get_inc20a(
    inc20a_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific inc20a by ID"""
    try:
        inc20a_service = INC20AService(db)
        inc20a = await inc20a_service.get_inc20a(inc20a_id)
        if not inc20a:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC20A not found"
            )
        return inc20a
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting inc20a {inc20a_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc20a"
        )

@router.put("/{inc20a_id}", response_model=INC20AView)
async def update_inc20a(
    inc20a_id: int,
    inc20a_data: INC20AUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a inc20a record"""
    try:
        inc20a_service = INC20AService(db)
        inc20a = await inc20a_service.update_inc20a(inc20a_id, inc20a_data, current_user.id)
        if not inc20a:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC20A not found"
            )
        return inc20a
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating inc20a {inc20a_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update inc20a"
        )

@router.delete("/{inc20a_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_inc20a(
    inc20a_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a inc20a record (soft delete)"""
    try:
        inc20a_service = INC20AService(db)
        success = await inc20a_service.delete_inc20a(inc20a_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC20A not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting inc20a {inc20a_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete inc20a"
        )

@router.get("/company/{company_id}", response_model=List[INC20AView])
async def get_inc20as_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all inc20as for a specific company"""
    try:
        inc20a_service = INC20AService(db)
        inc20as = await inc20a_service.get_inc20as_by_company(company_id)
        return inc20as
    except Exception as e:
        logger.error(f"Error getting inc20as for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc20as for company"
        )

@router.patch("/{inc20a_id}/status/{status}", response_model=INC20AView)
async def change_inc20a_status(
    inc20a_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a inc20a"""
    try:
        inc20a_service = INC20AService(db)
        success = await inc20a_service.change_status(inc20a_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC20A not found"
            )
        
        # Return the updated inc20a
        inc20a = await inc20a_service.get_inc20a(inc20a_id)
        return inc20a
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of inc20a {inc20a_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change inc20a status"
        )