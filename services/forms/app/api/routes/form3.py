from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.form3 import Form3, Form3Create, Form3Update, Form3View
from ...services.form3_service import Form3Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/form3", tags=["form3"])

@router.post("/", response_model=Form3View, status_code=status.HTTP_201_CREATED)
async def create_form3(
    form3_data: Form3Create,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new form3 record"""
    try:
        form3_service = Form3Service(db)
        form3 = await form3_service.create_form3(form3_data, current_user.id)
        return form3
    except Exception as e:
        logger.error(f"Error creating form3: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create form3"
        )

@router.get("/", response_model=List[Form3View])
async def get_form3s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all form3s with pagination"""
    try:
        form3_service = Form3Service(db)
        form3s = await form3_service.get_form3s(skip=skip, limit=limit)
        return form3s
    except Exception as e:
        logger.error(f"Error getting form3s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form3s"
        )

@router.get("/{form3_id}", response_model=Form3View)
async def get_form3(
    form3_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific form3 by ID"""
    try:
        form3_service = Form3Service(db)
        form3 = await form3_service.get_form3(form3_id)
        if not form3:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form3 not found"
            )
        return form3
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting form3 {form3_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form3"
        )

@router.put("/{form3_id}", response_model=Form3View)
async def update_form3(
    form3_id: int,
    form3_data: Form3Update,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a form3 record"""
    try:
        form3_service = Form3Service(db)
        form3 = await form3_service.update_form3(form3_id, form3_data, current_user.id)
        if not form3:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form3 not found"
            )
        return form3
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating form3 {form3_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update form3"
        )

@router.delete("/{form3_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_form3(
    form3_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a form3 record (soft delete)"""
    try:
        form3_service = Form3Service(db)
        success = await form3_service.delete_form3(form3_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form3 not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting form3 {form3_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete form3"
        )

@router.get("/company/{company_id}", response_model=List[Form3View])
async def get_form3s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all form3s for a specific company"""
    try:
        form3_service = Form3Service(db)
        form3s = await form3_service.get_form3s_by_company(company_id)
        return form3s
    except Exception as e:
        logger.error(f"Error getting form3s for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve form3s for company"
        )

@router.patch("/{form3_id}/status/{status}", response_model=Form3View)
async def change_form3_status(
    form3_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a form3"""
    try:
        form3_service = Form3Service(db)
        success = await form3_service.change_status(form3_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form3 not found"
            )
        
        # Return the updated form3
        form3 = await form3_service.get_form3(form3_id)
        return form3
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of form3 {form3_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change form3 status"
        )