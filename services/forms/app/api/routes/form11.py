from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.form11 import Form11, Form11Create, Form11Update, Form11View
from ...services.form11_service import Form11Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/form11", tags=["form11"])

@router.post("/", response_model=Form11View, status_code=status.HTTP_201_CREATED)
async def create_form11(
    form11_data: Form11Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new form11 record"""
    try:
        form11_service = Form11Service(db)
        form11 = form11_service.create_form11(form11_data, current_user.id)
        return form11
    except Exception as e:
        logger.error(f"Error creating form11: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create form11"
        )

@router.get("/", response_model=List[Form11View])
async def get_form11s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all form11s with pagination"""
    try:
        form11_service = Form11Service(db)
        form11s = form11_service.get_form11s(skip=skip, limit=limit)
        return form11s
    except Exception as e:
        logger.error(f"Error getting form11s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form11s"
        )

@router.get("/{form11_id}", response_model=Form11View)
async def get_form11(
    form11_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific form11 by ID"""
    try:
        form11_service = Form11Service(db)
        form11 = form11_service.get_form11(form11_id)
        if not form11:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form11 not found"
            )
        return form11
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting form11 {form11_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form11"
        )

@router.put("/{form11_id}", response_model=Form11View)
async def update_form11(
    form11_id: int,
    form11_data: Form11Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a form11 record"""
    try:
        form11_service = Form11Service(db)
        form11 = form11_service.update_form11(form11_id, form11_data, current_user.id)
        if not form11:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form11 not found"
            )
        return form11
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating form11 {form11_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update form11"
        )

@router.delete("/{form11_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_form11(
    form11_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a form11 record (soft delete)"""
    try:
        form11_service = Form11Service(db)
        success = form11_service.delete_form11(form11_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form11 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting form11 {form11_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete form11"
        )

@router.get("/company/{company_id}", response_model=List[Form11View])
async def get_form11s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all form11s for a specific company"""
    try:
        form11_service = Form11Service(db)
        form11s = form11_service.get_form11s_by_company(company_id)
        return form11s
    except Exception as e:
        logger.error(f"Error getting form11s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form11s for company"
        )

@router.patch("/{form11_id}/status/{status}", response_model=Form11View)
async def change_form11_status(
    form11_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a form11"""
    try:
        form11_service = Form11Service(db)
        success = form11_service.change_status(form11_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form11 not found"
            )
        
        # Return the updated form11
        form11 = form11_service.get_form11(form11_id)
        return form11
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of form11 {form11_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change form11 status"
        )