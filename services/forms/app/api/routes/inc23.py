from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.inc23 import INC23, INC23Create, INC23Update, INC23View
from ...services.inc23_service import INC23Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/inc23", tags=["inc23"])

@router.post("/", response_model=INC23View, status_code=status.HTTP_201_CREATED)
async def create_inc23(
    inc23_data: INC23Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new inc23 record"""
    try:
        inc23_service = INC23Service(db)
        inc23 = inc23_service.create_inc23(inc23_data, current_user.id)
        return inc23
    except Exception as e:
        logger.error(f"Error creating inc23: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create inc23"
        )

@router.get("/", response_model=List[INC23View])
async def get_inc23s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all inc23s with pagination"""
    try:
        inc23_service = INC23Service(db)
        inc23s = inc23_service.get_inc23s(skip=skip, limit=limit)
        return inc23s
    except Exception as e:
        logger.error(f"Error getting inc23s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc23s"
        )

@router.get("/{inc23_id}", response_model=INC23View)
async def get_inc23(
    inc23_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific inc23 by ID"""
    try:
        inc23_service = INC23Service(db)
        inc23 = inc23_service.get_inc23(inc23_id)
        if not inc23:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC23 not found"
            )
        return inc23
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting inc23 {inc23_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc23"
        )

@router.put("/{inc23_id}", response_model=INC23View)
async def update_inc23(
    inc23_id: int,
    inc23_data: INC23Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a inc23 record"""
    try:
        inc23_service = INC23Service(db)
        inc23 = inc23_service.update_inc23(inc23_id, inc23_data, current_user.id)
        if not inc23:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC23 not found"
            )
        return inc23
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating inc23 {inc23_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update inc23"
        )

@router.delete("/{inc23_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_inc23(
    inc23_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a inc23 record (soft delete)"""
    try:
        inc23_service = INC23Service(db)
        success = inc23_service.delete_inc23(inc23_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC23 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting inc23 {inc23_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete inc23"
        )

@router.get("/company/{company_id}", response_model=List[INC23View])
async def get_inc23s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all inc23s for a specific company"""
    try:
        inc23_service = INC23Service(db)
        inc23s = inc23_service.get_inc23s_by_company(company_id)
        return inc23s
    except Exception as e:
        logger.error(f"Error getting inc23s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve inc23s for company"
        )

@router.patch("/{inc23_id}/status/{status}", response_model=INC23View)
async def change_inc23_status(
    inc23_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a inc23"""
    try:
        inc23_service = INC23Service(db)
        success = inc23_service.change_status(inc23_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="INC23 not found"
            )
        
        # Return the updated inc23
        inc23 = inc23_service.get_inc23(inc23_id)
        return inc23
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of inc23 {inc23_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change inc23 status"
        )