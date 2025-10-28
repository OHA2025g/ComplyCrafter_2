from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.form12 import Form12, Form12Create, Form12Update, Form12View
from ...services.form12_service import Form12Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/form12", tags=["form12"])

@router.post("/", response_model=Form12View, status_code=status.HTTP_201_CREATED)
async def create_form12(
    form12_data: Form12Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new form12 record"""
    try:
        form12_service = Form12Service(db)
        form12 = form12_service.create_form12(form12_data, current_user.id)
        return form12
    except Exception as e:
        logger.error(f"Error creating form12: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create form12"
        )

@router.get("/", response_model=List[Form12View])
async def get_form12s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all form12s with pagination"""
    try:
        form12_service = Form12Service(db)
        form12s = form12_service.get_form12s(skip=skip, limit=limit)
        return form12s
    except Exception as e:
        logger.error(f"Error getting form12s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form12s"
        )

@router.get("/{form12_id}", response_model=Form12View)
async def get_form12(
    form12_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific form12 by ID"""
    try:
        form12_service = Form12Service(db)
        form12 = form12_service.get_form12(form12_id)
        if not form12:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form12 not found"
            )
        return form12
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting form12 {form12_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form12"
        )

@router.put("/{form12_id}", response_model=Form12View)
async def update_form12(
    form12_id: int,
    form12_data: Form12Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a form12 record"""
    try:
        form12_service = Form12Service(db)
        form12 = form12_service.update_form12(form12_id, form12_data, current_user.id)
        if not form12:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form12 not found"
            )
        return form12
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating form12 {form12_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update form12"
        )

@router.delete("/{form12_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_form12(
    form12_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a form12 record (soft delete)"""
    try:
        form12_service = Form12Service(db)
        success = form12_service.delete_form12(form12_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form12 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting form12 {form12_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete form12"
        )

@router.get("/company/{company_id}", response_model=List[Form12View])
async def get_form12s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all form12s for a specific company"""
    try:
        form12_service = Form12Service(db)
        form12s = form12_service.get_form12s_by_company(company_id)
        return form12s
    except Exception as e:
        logger.error(f"Error getting form12s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form12s for company"
        )

@router.patch("/{form12_id}/status/{status}", response_model=Form12View)
async def change_form12_status(
    form12_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a form12"""
    try:
        form12_service = Form12Service(db)
        success = form12_service.change_status(form12_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form12 not found"
            )
        
        # Return the updated form12
        form12 = form12_service.get_form12(form12_id)
        return form12
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of form12 {form12_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change form12 status"
        )