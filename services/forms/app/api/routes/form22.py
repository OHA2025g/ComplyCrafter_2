from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.form22 import Form22, Form22Create, Form22Update, Form22View
from ...services.form22_service import Form22Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/form22", tags=["form22"])

@router.post("/", response_model=Form22View, status_code=status.HTTP_201_CREATED)
async def create_form22(
    form22_data: Form22Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new form22 record"""
    try:
        form22_service = Form22Service(db)
        form22 = await form22_service.create_form22(form22_data, current_user.id)
        return form22
    except Exception as e:
        logger.error(f"Error creating form22: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create form22"
        )

@router.get("/", response_model=List[Form22View])
async def get_form22s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all form22s with pagination"""
    try:
        form22_service = Form22Service(db)
        form22s = await form22_service.get_form22s(skip=skip, limit=limit)
        return form22s
    except Exception as e:
        logger.error(f"Error getting form22s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form22s"
        )

@router.get("/{form22_id}", response_model=Form22View)
async def get_form22(
    form22_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific form22 by ID"""
    try:
        form22_service = Form22Service(db)
        form22 = await form22_service.get_form22(form22_id)
        if not form22:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form22 not found"
            )
        return form22
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting form22 {form22_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form22"
        )

@router.put("/{form22_id}", response_model=Form22View)
async def update_form22(
    form22_id: int,
    form22_data: Form22Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a form22 record"""
    try:
        form22_service = Form22Service(db)
        form22 = await form22_service.update_form22(form22_id, form22_data, current_user.id)
        if not form22:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form22 not found"
            )
        return form22
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating form22 {form22_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update form22"
        )

@router.delete("/{form22_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_form22(
    form22_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a form22 record (soft delete)"""
    try:
        form22_service = Form22Service(db)
        success = await form22_service.delete_form22(form22_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form22 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting form22 {form22_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete form22"
        )

@router.get("/company/{company_id}", response_model=List[Form22View])
async def get_form22s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all form22s for a specific company"""
    try:
        form22_service = Form22Service(db)
        form22s = await form22_service.get_form22s_by_company(company_id)
        return form22s
    except Exception as e:
        logger.error(f"Error getting form22s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form22s for company"
        )

@router.patch("/{form22_id}/status/{status}", response_model=Form22View)
async def change_form22_status(
    form22_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a form22"""
    try:
        form22_service = Form22Service(db)
        success = await form22_service.change_status(form22_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form22 not found"
            )
        
        # Return the updated form22
        form22 = await form22_service.get_form22(form22_id)
        return form22
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of form22 {form22_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change form22 status"
        )