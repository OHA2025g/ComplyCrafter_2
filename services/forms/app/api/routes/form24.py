from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.form24 import Form24, Form24Create, Form24Update, Form24View
from ...services.form24_service import Form24Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/form24", tags=["form24"])

@router.post("/", response_model=Form24View, status_code=status.HTTP_201_CREATED)
async def create_form24(
    form24_data: Form24Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new form24 record"""
    try:
        form24_service = Form24Service(db)
        form24 = form24_service.create_form24(form24_data, current_user.id)
        return form24
    except Exception as e:
        logger.error(f"Error creating form24: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create form24"
        )

@router.get("/", response_model=List[Form24View])
async def get_form24s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all form24s with pagination"""
    try:
        form24_service = Form24Service(db)
        form24s = form24_service.get_form24s(skip=skip, limit=limit)
        return form24s
    except Exception as e:
        logger.error(f"Error getting form24s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form24s"
        )

@router.get("/{form24_id}", response_model=Form24View)
async def get_form24(
    form24_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific form24 by ID"""
    try:
        form24_service = Form24Service(db)
        form24 = form24_service.get_form24(form24_id)
        if not form24:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form24 not found"
            )
        return form24
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting form24 {form24_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form24"
        )

@router.put("/{form24_id}", response_model=Form24View)
async def update_form24(
    form24_id: int,
    form24_data: Form24Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a form24 record"""
    try:
        form24_service = Form24Service(db)
        form24 = form24_service.update_form24(form24_id, form24_data, current_user.id)
        if not form24:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form24 not found"
            )
        return form24
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating form24 {form24_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update form24"
        )

@router.delete("/{form24_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_form24(
    form24_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a form24 record (soft delete)"""
    try:
        form24_service = Form24Service(db)
        success = form24_service.delete_form24(form24_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form24 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting form24 {form24_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete form24"
        )

@router.get("/company/{company_id}", response_model=List[Form24View])
async def get_form24s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all form24s for a specific company"""
    try:
        form24_service = Form24Service(db)
        form24s = form24_service.get_form24s_by_company(company_id)
        return form24s
    except Exception as e:
        logger.error(f"Error getting form24s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form24s for company"
        )

@router.patch("/{form24_id}/status/{status}", response_model=Form24View)
async def change_form24_status(
    form24_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a form24"""
    try:
        form24_service = Form24Service(db)
        success = form24_service.change_status(form24_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form24 not found"
            )
        
        # Return the updated form24
        form24 = form24_service.get_form24(form24_id)
        return form24
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of form24 {form24_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change form24 status"
        )