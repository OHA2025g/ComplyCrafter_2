from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.form15 import Form15, Form15Create, Form15Update, Form15View
from ...services.form15_service import Form15Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/form15", tags=["form15"])

@router.post("/", response_model=Form15View, status_code=status.HTTP_201_CREATED)
async def create_form15(
    form15_data: Form15Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new form15 record"""
    try:
        form15_service = Form15Service(db)
        form15 = form15_service.create_form15(form15_data, current_user.id)
        return form15
    except Exception as e:
        logger.error(f"Error creating form15: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create form15"
        )

@router.get("/", response_model=List[Form15View])
async def get_form15s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all form15s with pagination"""
    try:
        form15_service = Form15Service(db)
        form15s = form15_service.get_form15s(skip=skip, limit=limit)
        return form15s
    except Exception as e:
        logger.error(f"Error getting form15s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form15s"
        )

@router.get("/{form15_id}", response_model=Form15View)
async def get_form15(
    form15_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific form15 by ID"""
    try:
        form15_service = Form15Service(db)
        form15 = form15_service.get_form15(form15_id)
        if not form15:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form15 not found"
            )
        return form15
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting form15 {form15_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form15"
        )

@router.put("/{form15_id}", response_model=Form15View)
async def update_form15(
    form15_id: int,
    form15_data: Form15Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a form15 record"""
    try:
        form15_service = Form15Service(db)
        form15 = form15_service.update_form15(form15_id, form15_data, current_user.id)
        if not form15:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form15 not found"
            )
        return form15
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating form15 {form15_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update form15"
        )

@router.delete("/{form15_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_form15(
    form15_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a form15 record (soft delete)"""
    try:
        form15_service = Form15Service(db)
        success = form15_service.delete_form15(form15_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form15 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting form15 {form15_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete form15"
        )

@router.get("/company/{company_id}", response_model=List[Form15View])
async def get_form15s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all form15s for a specific company"""
    try:
        form15_service = Form15Service(db)
        form15s = form15_service.get_form15s_by_company(company_id)
        return form15s
    except Exception as e:
        logger.error(f"Error getting form15s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form15s for company"
        )

@router.patch("/{form15_id}/status/{status}", response_model=Form15View)
async def change_form15_status(
    form15_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a form15"""
    try:
        form15_service = Form15Service(db)
        success = form15_service.change_status(form15_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form15 not found"
            )
        
        # Return the updated form15
        form15 = form15_service.get_form15(form15_id)
        return form15
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of form15 {form15_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change form15 status"
        )