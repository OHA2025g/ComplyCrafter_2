from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.boardreport import BOARDREPORT, BOARDREPORTCreate, BOARDREPORTUpdate, BOARDREPORTView
from ...services.boardreport_service import BOARDREPORTService
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/boardreport", tags=["boardreport"])

@router.post("/", response_model=BOARDREPORTView, status_code=status.HTTP_201_CREATED)
async def create_boardreport(
    boardreport_data: BOARDREPORTCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new boardreport record"""
    try:
        boardreport_service = BOARDREPORTService(db)
        boardreport = boardreport_service.create_boardreport(boardreport_data, current_user.id)
        return boardreport
    except Exception as e:
        logger.error(f"Error creating boardreport: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create boardreport"
        )

@router.get("/", response_model=List[BOARDREPORTView])
async def get_boardreports(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all boardreports with pagination"""
    try:
        boardreport_service = BOARDREPORTService(db)
        boardreports = boardreport_service.get_boardreports(skip=skip, limit=limit)
        return boardreports
    except Exception as e:
        logger.error(f"Error getting boardreports: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve boardreports"
        )

@router.get("/{boardreport_id}", response_model=BOARDREPORTView)
async def get_boardreport(
    boardreport_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific boardreport by ID"""
    try:
        boardreport_service = BOARDREPORTService(db)
        boardreport = boardreport_service.get_boardreport(boardreport_id)
        if not boardreport:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="BOARDREPORT not found"
            )
        return boardreport
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting boardreport {boardreport_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve boardreport"
        )

@router.put("/{boardreport_id}", response_model=BOARDREPORTView)
async def update_boardreport(
    boardreport_id: int,
    boardreport_data: BOARDREPORTUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a boardreport record"""
    try:
        boardreport_service = BOARDREPORTService(db)
        boardreport = boardreport_service.update_boardreport(boardreport_id, boardreport_data, current_user.id)
        if not boardreport:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="BOARDREPORT not found"
            )
        return boardreport
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating boardreport {boardreport_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update boardreport"
        )

@router.delete("/{boardreport_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_boardreport(
    boardreport_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a boardreport record (soft delete)"""
    try:
        boardreport_service = BOARDREPORTService(db)
        success = boardreport_service.delete_boardreport(boardreport_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="BOARDREPORT not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting boardreport {boardreport_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete boardreport"
        )

@router.get("/company/{company_id}", response_model=List[BOARDREPORTView])
async def get_boardreports_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all boardreports for a specific company"""
    try:
        boardreport_service = BOARDREPORTService(db)
        boardreports = boardreport_service.get_boardreports_by_company(company_id)
        return boardreports
    except Exception as e:
        logger.error(f"Error getting boardreports for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve boardreports for company"
        )

@router.patch("/{boardreport_id}/status/{status}", response_model=BOARDREPORTView)
async def change_boardreport_status(
    boardreport_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a boardreport"""
    try:
        boardreport_service = BOARDREPORTService(db)
        success = boardreport_service.change_status(boardreport_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="BOARDREPORT not found"
            )
        
        # Return the updated boardreport
        boardreport = boardreport_service.get_boardreport(boardreport_id)
        return boardreport
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of boardreport {boardreport_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change boardreport status"
        )