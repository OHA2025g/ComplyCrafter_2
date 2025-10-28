from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.form4 import Form4, Form4Create, Form4Update, Form4View
from ...services.form4_service import Form4Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/form4", tags=["form4"])

@router.post("/", response_model=Form4View, status_code=status.HTTP_201_CREATED)
async def create_form4(
    form4_data: Form4Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new form4 record"""
    try:
        form4_service = Form4Service(db)
        form4 = form4_service.create_form4(form4_data, current_user.id)
        return form4
    except Exception as e:
        logger.error(f"Error creating form4: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create form4"
        )

@router.get("/", response_model=List[Form4View])
async def get_form4s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all form4s with pagination"""
    try:
        form4_service = Form4Service(db)
        form4s = form4_service.get_form4s(skip=skip, limit=limit)
        return form4s
    except Exception as e:
        logger.error(f"Error getting form4s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form4s"
        )

@router.get("/{form4_id}", response_model=Form4View)
async def get_form4(
    form4_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific form4 by ID"""
    try:
        form4_service = Form4Service(db)
        form4 = form4_service.get_form4(form4_id)
        if not form4:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form4 not found"
            )
        return form4
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting form4 {form4_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form4"
        )

@router.put("/{form4_id}", response_model=Form4View)
async def update_form4(
    form4_id: int,
    form4_data: Form4Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a form4 record"""
    try:
        form4_service = Form4Service(db)
        form4 = form4_service.update_form4(form4_id, form4_data, current_user.id)
        if not form4:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form4 not found"
            )
        return form4
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating form4 {form4_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update form4"
        )

@router.delete("/{form4_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_form4(
    form4_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a form4 record (soft delete)"""
    try:
        form4_service = Form4Service(db)
        success = form4_service.delete_form4(form4_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form4 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting form4 {form4_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete form4"
        )

@router.get("/company/{company_id}", response_model=List[Form4View])
async def get_form4s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all form4s for a specific company"""
    try:
        form4_service = Form4Service(db)
        form4s = form4_service.get_form4s_by_company(company_id)
        return form4s
    except Exception as e:
        logger.error(f"Error getting form4s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form4s for company"
        )

@router.patch("/{form4_id}/status/{status}", response_model=Form4View)
async def change_form4_status(
    form4_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a form4"""
    try:
        form4_service = Form4Service(db)
        success = form4_service.change_status(form4_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form4 not found"
            )
        
        # Return the updated form4
        form4 = form4_service.get_form4(form4_id)
        return form4
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of form4 {form4_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change form4 status"
        )