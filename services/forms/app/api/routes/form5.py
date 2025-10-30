from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.form5 import Form5, Form5Create, Form5Update, Form5View
from ...services.form5_service import Form5Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/form5", tags=["form5"])

@router.post("/", response_model=Form5View, status_code=status.HTTP_201_CREATED)
async def create_form5(
    form5_data: Form5Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new form5 record"""
    try:
        form5_service = Form5Service(db)
        form5 = await form5_service.create_form5(form5_data, current_user.id)
        return form5
    except Exception as e:
        logger.error(f"Error creating form5: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create form5"
        )

@router.get("/", response_model=List[Form5View])
async def get_form5s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all form5s with pagination"""
    try:
        form5_service = Form5Service(db)
        form5s = await form5_service.get_form5s(skip=skip, limit=limit)
        return form5s
    except Exception as e:
        logger.error(f"Error getting form5s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form5s"
        )

@router.get("/{form5_id}", response_model=Form5View)
async def get_form5(
    form5_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific form5 by ID"""
    try:
        form5_service = Form5Service(db)
        form5 = await form5_service.get_form5(form5_id)
        if not form5:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form5 not found"
            )
        return form5
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting form5 {form5_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form5"
        )

@router.put("/{form5_id}", response_model=Form5View)
async def update_form5(
    form5_id: int,
    form5_data: Form5Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a form5 record"""
    try:
        form5_service = Form5Service(db)
        form5 = await form5_service.update_form5(form5_id, form5_data, current_user.id)
        if not form5:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form5 not found"
            )
        return form5
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating form5 {form5_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update form5"
        )

@router.delete("/{form5_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_form5(
    form5_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a form5 record (soft delete)"""
    try:
        form5_service = Form5Service(db)
        success = await form5_service.delete_form5(form5_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form5 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting form5 {form5_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete form5"
        )

@router.get("/company/{company_id}", response_model=List[Form5View])
async def get_form5s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all form5s for a specific company"""
    try:
        form5_service = Form5Service(db)
        form5s = await form5_service.get_form5s_by_company(company_id)
        return form5s
    except Exception as e:
        logger.error(f"Error getting form5s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form5s for company"
        )

@router.patch("/{form5_id}/status/{status}", response_model=Form5View)
async def change_form5_status(
    form5_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a form5"""
    try:
        form5_service = Form5Service(db)
        success = await form5_service.change_status(form5_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form5 not found"
            )
        
        # Return the updated form5
        form5 = await form5_service.get_form5(form5_id)
        return form5
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of form5 {form5_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change form5 status"
        )