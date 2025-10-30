from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.charge import CHARGE, CHARGECreate, CHARGEUpdate, CHARGEView
from ...services.charge_service import CHARGEService
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/charge", tags=["charge"])

@router.post("/", response_model=CHARGEView, status_code=status.HTTP_201_CREATED)
async def create_charge(
    charge_data: CHARGECreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new charge record"""
    try:
        charge_service = CHARGEService(db)
        charge = await charge_service.create_charge(charge_data, current_user.id)
        return charge
    except Exception as e:
        logger.error(f"Error creating charge: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create charge"
        )

@router.get("/", response_model=List[CHARGEView])
async def get_charges(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all charges with pagination"""
    try:
        charge_service = CHARGEService(db)
        charges = await charge_service.get_charges(skip=skip, limit=limit)
        return charges
    except Exception as e:
        logger.error(f"Error getting charges: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve charges"
        )

@router.get("/{charge_id}", response_model=CHARGEView)
async def get_charge(
    charge_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific charge by ID"""
    try:
        charge_service = CHARGEService(db)
        charge = await charge_service.get_charge(charge_id)
        if not charge:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHARGE not found"
            )
        return charge
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting charge {charge_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve charge"
        )

@router.put("/{charge_id}", response_model=CHARGEView)
async def update_charge(
    charge_id: int,
    charge_data: CHARGEUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a charge record"""
    try:
        charge_service = CHARGEService(db)
        charge = await charge_service.update_charge(charge_id, charge_data, current_user.id)
        if not charge:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHARGE not found"
            )
        return charge
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating charge {charge_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update charge"
        )

@router.delete("/{charge_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_charge(
    charge_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a charge record (soft delete)"""
    try:
        charge_service = CHARGEService(db)
        success = await charge_service.delete_charge(charge_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHARGE not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting charge {charge_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete charge"
        )

@router.get("/company/{company_id}", response_model=List[CHARGEView])
async def get_charges_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all charges for a specific company"""
    try:
        charge_service = CHARGEService(db)
        charges = await charge_service.get_charges_by_company(company_id)
        return charges
    except Exception as e:
        logger.error(f"Error getting charges for company {company_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve charges for company"
        )

@router.patch("/{charge_id}/status/{status}", response_model=CHARGEView)
async def change_charge_status(
    charge_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change the active status of a charge"""
    try:
        charge_service = CHARGEService(db)
        success = await charge_service.change_status(charge_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHARGE not found"
            )
        
        # Return the updated charge
        charge = await charge_service.get_charge(charge_id)
        return charge
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of charge {charge_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change charge status"
        )