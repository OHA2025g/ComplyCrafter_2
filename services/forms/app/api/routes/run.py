from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.run import RUN, RUNCreate, RUNUpdate, RUNView
from ...services.run_service import RUNService
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/run", tags=["run"])

@router.post("/", response_model=RUNView, status_code=status.HTTP_201_CREATED)
async def create_run(
    run_data: RUNCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new run record"""
    try:
        run_service = RUNService(db)
        run = run_service.create_run(run_data, current_user.id)
        return run
    except Exception as e:
        logger.error(f"Error creating run: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create run"
        )

@router.get("/", response_model=List[RUNView])
async def get_runs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all runs with pagination"""
    try:
        run_service = RUNService(db)
        runs = run_service.get_runs(skip=skip, limit=limit)
        return runs
    except Exception as e:
        logger.error(f"Error getting runs: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve runs"
        )

@router.get("/{run_id}", response_model=RUNView)
async def get_run(
    run_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific run by ID"""
    try:
        run_service = RUNService(db)
        run = run_service.get_run(run_id)
        if not run:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="RUN not found"
            )
        return run
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting run {run_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve run"
        )

@router.put("/{run_id}", response_model=RUNView)
async def update_run(
    run_id: int,
    run_data: RUNUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a run record"""
    try:
        run_service = RUNService(db)
        run = run_service.update_run(run_id, run_data, current_user.id)
        if not run:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="RUN not found"
            )
        return run
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating run {run_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update run"
        )

@router.delete("/{run_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_run(
    run_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a run record (soft delete)"""
    try:
        run_service = RUNService(db)
        success = run_service.delete_run(run_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="RUN not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting run {run_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete run"
        )

@router.get("/company/{company_id}", response_model=List[RUNView])
async def get_runs_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all runs for a specific company"""
    try:
        run_service = RUNService(db)
        runs = run_service.get_runs_by_company(company_id)
        return runs
    except Exception as e:
        logger.error(f"Error getting runs for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve runs for company"
        )

@router.patch("/{run_id}/status/{status}", response_model=RUNView)
async def change_run_status(
    run_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a run"""
    try:
        run_service = RUNService(db)
        success = run_service.change_status(run_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="RUN not found"
            )
        
        # Return the updated run
        run = run_service.get_run(run_id)
        return run
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of run {run_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change run status"
        )