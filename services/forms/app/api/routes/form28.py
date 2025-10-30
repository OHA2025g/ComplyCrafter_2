from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.form28 import Form28, Form28Create, Form28Update, Form28View
from ...services.form28_service import Form28Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/form28", tags=["form28"])

@router.post("/", response_model=Form28View, status_code=status.HTTP_201_CREATED)
async def create_form28(
    form28_data: Form28Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new form28 record"""
    try:
        form28_service = Form28Service(db)
        form28 = await form28_service.create_form28(form28_data, current_user.id)
        return form28
    except Exception as e:
        logger.error(f"Error creating form28: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create form28"
        )

@router.get("/", response_model=List[Form28View])
async def get_form28s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all form28s with pagination"""
    try:
        form28_service = Form28Service(db)
        form28s = await form28_service.get_form28s(skip=skip, limit=limit)
        return form28s
    except Exception as e:
        logger.error(f"Error getting form28s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form28s"
        )

@router.get("/{form28_id}", response_model=Form28View)
async def get_form28(
    form28_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific form28 by ID"""
    try:
        form28_service = Form28Service(db)
        form28 = await form28_service.get_form28(form28_id)
        if not form28:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form28 not found"
            )
        return form28
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting form28 {form28_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form28"
        )

@router.put("/{form28_id}", response_model=Form28View)
async def update_form28(
    form28_id: int,
    form28_data: Form28Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a form28 record"""
    try:
        form28_service = Form28Service(db)
        form28 = await form28_service.update_form28(form28_id, form28_data, current_user.id)
        if not form28:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form28 not found"
            )
        return form28
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating form28 {form28_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update form28"
        )

@router.delete("/{form28_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_form28(
    form28_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a form28 record (soft delete)"""
    try:
        form28_service = Form28Service(db)
        success = await form28_service.delete_form28(form28_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form28 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting form28 {form28_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete form28"
        )

@router.get("/company/{company_id}", response_model=List[Form28View])
async def get_form28s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all form28s for a specific company"""
    try:
        form28_service = Form28Service(db)
        form28s = await form28_service.get_form28s_by_company(company_id)
        return form28s
    except Exception as e:
        logger.error(f"Error getting form28s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form28s for company"
        )

@router.patch("/{form28_id}/status/{status}", response_model=Form28View)
async def change_form28_status(
    form28_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a form28"""
    try:
        form28_service = Form28Service(db)
        success = await form28_service.change_status(form28_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form28 not found"
            )
        
        # Return the updated form28
        form28 = await form28_service.get_form28(form28_id)
        return form28
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of form28 {form28_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change form28 status"
        )