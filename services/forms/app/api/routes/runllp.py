from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.runllp import RUNLLP, RUNLLPCreate, RUNLLPUpdate, RUNLLPView
from ...services.runllp_service import RUNLLPService
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/runllp", tags=["runllp"])

@router.post("/", response_model=RUNLLPView, status_code=status.HTTP_201_CREATED)
async def create_runllp(
    runllp_data: RUNLLPCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new runllp record"""
    try:
        runllp_service = RUNLLPService(db)
        runllp = await runllp_service.create_runllp(runllp_data, current_user.id)
        return runllp
    except Exception as e:
        logger.error(f"Error creating runllp: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create runllp"
        )

@router.get("/", response_model=List[RUNLLPView])
async def get_runllps(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all runllps with pagination"""
    try:
        runllp_service = RUNLLPService(db)
        runllps = await runllp_service.get_runllps(skip=skip, limit=limit)
        return runllps
    except Exception as e:
        logger.error(f"Error getting runllps: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve runllps"
        )

@router.get("/{runllp_id}", response_model=RUNLLPView)
async def get_runllp(
    runllp_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific runllp by ID"""
    try:
        runllp_service = RUNLLPService(db)
        runllp = await runllp_service.get_runllp(runllp_id)
        if not runllp:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="RUNLLP not found"
            )
        return runllp
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting runllp {runllp_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve runllp"
        )

@router.put("/{runllp_id}", response_model=RUNLLPView)
async def update_runllp(
    runllp_id: int,
    runllp_data: RUNLLPUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a runllp record"""
    try:
        runllp_service = RUNLLPService(db)
        runllp = await runllp_service.update_runllp(runllp_id, runllp_data, current_user.id)
        if not runllp:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="RUNLLP not found"
            )
        return runllp
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating runllp {runllp_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update runllp"
        )

@router.delete("/{runllp_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_runllp(
    runllp_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a runllp record (soft delete)"""
    try:
        runllp_service = RUNLLPService(db)
        success = await runllp_service.delete_runllp(runllp_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="RUNLLP not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting runllp {runllp_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete runllp"
        )

@router.get("/company/{company_id}", response_model=List[RUNLLPView])
async def get_runllps_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all runllps for a specific company"""
    try:
        runllp_service = RUNLLPService(db)
        runllps = await runllp_service.get_runllps_by_company(company_id)
        return runllps
    except Exception as e:
        logger.error(f"Error getting runllps for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve runllps for company"
        )

@router.patch("/{runllp_id}/status/{status}", response_model=RUNLLPView)
async def change_runllp_status(
    runllp_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a runllp"""
    try:
        runllp_service = RUNLLPService(db)
        success = await runllp_service.change_status(runllp_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="RUNLLP not found"
            )
        
        # Return the updated runllp
        runllp = await runllp_service.get_runllp(runllp_id)
        return runllp
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of runllp {runllp_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change runllp status"
        )