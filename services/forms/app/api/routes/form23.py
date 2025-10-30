from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.form23 import Form23, Form23Create, Form23Update, Form23View
from ...services.form23_service import Form23Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/form23", tags=["form23"])

@router.post("/", response_model=Form23View, status_code=status.HTTP_201_CREATED)
async def create_form23(
    form23_data: Form23Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new form23 record"""
    try:
        form23_service = Form23Service(db)
        form23 = await form23_service.create_form23(form23_data, current_user.id)
        return form23
    except Exception as e:
        logger.error(f"Error creating form23: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create form23"
        )

@router.get("/", response_model=List[Form23View])
async def get_form23s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all form23s with pagination"""
    try:
        form23_service = Form23Service(db)
        form23s = await form23_service.get_form23s(skip=skip, limit=limit)
        return form23s
    except Exception as e:
        logger.error(f"Error getting form23s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form23s"
        )

@router.get("/{form23_id}", response_model=Form23View)
async def get_form23(
    form23_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific form23 by ID"""
    try:
        form23_service = Form23Service(db)
        form23 = await form23_service.get_form23(form23_id)
        if not form23:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form23 not found"
            )
        return form23
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting form23 {form23_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form23"
        )

@router.put("/{form23_id}", response_model=Form23View)
async def update_form23(
    form23_id: int,
    form23_data: Form23Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a form23 record"""
    try:
        form23_service = Form23Service(db)
        form23 = await form23_service.update_form23(form23_id, form23_data, current_user.id)
        if not form23:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form23 not found"
            )
        return form23
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating form23 {form23_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update form23"
        )

@router.delete("/{form23_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_form23(
    form23_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a form23 record (soft delete)"""
    try:
        form23_service = Form23Service(db)
        success = await form23_service.delete_form23(form23_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form23 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting form23 {form23_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete form23"
        )

@router.get("/company/{company_id}", response_model=List[Form23View])
async def get_form23s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all form23s for a specific company"""
    try:
        form23_service = Form23Service(db)
        form23s = await form23_service.get_form23s_by_company(company_id)
        return form23s
    except Exception as e:
        logger.error(f"Error getting form23s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form23s for company"
        )

@router.patch("/{form23_id}/status/{status}", response_model=Form23View)
async def change_form23_status(
    form23_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a form23"""
    try:
        form23_service = Form23Service(db)
        success = await form23_service.change_status(form23_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form23 not found"
            )
        
        # Return the updated form23
        form23 = await form23_service.get_form23(form23_id)
        return form23
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of form23 {form23_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change form23 status"
        )