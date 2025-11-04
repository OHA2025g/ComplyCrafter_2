"""
Companies API Routes - User Companies Management
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, update, delete, Table, MetaData, Column, Integer, String, Boolean, DateTime, Date, Text
from typing import List, Dict, Any
from datetime import datetime, date
import logging

from app.api.dependencies import get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/companies", tags=["Companies"])

# Define table structure
metadata = MetaData()
user_companies_table = Table(
    'user_companies',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('user_id', Integer),
    Column('cin', String(21)),
    Column('company_name', String(500)),
    Column('company_status', String(50)),
    Column('entity_type', String(100)),
    Column('incorporation_date', Date),
    Column('added_at', DateTime),
    Column('is_active', Boolean),
)


@router.get("/", response_model=List[Dict[str, Any]])
async def get_all_companies(
    user_id: int = None,
    is_active: bool = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all user companies"""
    try:
        stmt = select(user_companies_table)
        
        if user_id:
            stmt = stmt.where(user_companies_table.c.user_id == user_id)
        
        if is_active is not None:
            stmt = stmt.where(user_companies_table.c.is_active == is_active)
        else:
            # Default to active companies only
            stmt = stmt.where(user_companies_table.c.is_active == True)
        
        stmt = stmt.order_by(user_companies_table.c.added_at.desc())
        
        result = await db.execute(stmt)
        rows = result.fetchall()
        
        companies = []
        for row in rows:
            companies.append({
                'id': row.id,
                'srNo': row.id,
                'cin': row.cin,
                'name': row.company_name,
                'incorporationDate': str(row.incorporation_date) if row.incorporation_date else None,
                'entityType': row.entity_type,
                'status': row.company_status,
                'isActive': row.is_active
            })
        
        return companies
        
    except Exception as e:
        logger.error(f"Error fetching companies: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
async def add_company(
    company_data: Dict[str, Any],
    db: AsyncSession = Depends(get_db)
):
    """Add a new company to user's list (or reactivate if previously deleted)"""
    try:
        # Get the user_id (default to 1 if not provided)
        user_id = company_data.get('user_id', 1)
        cin = company_data.get('cin')
        company_name = company_data.get('company_name', '')
        
        # Check if company already exists for this user (active or inactive)
        check_stmt = select(user_companies_table).where(
            user_companies_table.c.user_id == user_id,
            user_companies_table.c.cin == cin
        )
        existing = await db.execute(check_stmt)
        existing_company = existing.fetchone()
        
        if existing_company:
            # Company exists - check if it's inactive (soft deleted)
            if not existing_company.is_active:
                # Reactivate the soft-deleted company
                reactivate_stmt = update(user_companies_table).where(
                    user_companies_table.c.id == existing_company.id
                ).values(
                    is_active=True,
                    company_name=company_data.get('company_name', existing_company.company_name),
                    company_status=company_data.get('company_status', existing_company.company_status),
                    entity_type=company_data.get('entity_type', existing_company.entity_type),
                    incorporation_date=company_data.get('incorporation_date', existing_company.incorporation_date),
                    added_at=datetime.now()  # Update the added_at timestamp
                )
                await db.execute(reactivate_stmt)
                await db.commit()
                
                return {
                    "message": "Company reactivated successfully",
                    "id": existing_company.id,
                    "cin": cin,
                    "company_name": company_data.get('company_name', existing_company.company_name),
                    "reactivated": True
                }
            else:
                # Company is already active - this is a true duplicate
                existing_name = existing_company.company_name if existing_company else company_name
                raise HTTPException(
                    status_code=400, 
                    detail=f'The company "{existing_name}" already exists in your Company Master'
                )
        
        # Company doesn't exist - create new entry
        stmt = insert(user_companies_table).values(
            user_id=user_id,
            cin=cin,
            company_name=company_data.get('company_name'),
            company_status=company_data.get('company_status', 'Active'),
            entity_type=company_data.get('entity_type'),
            incorporation_date=company_data.get('incorporation_date'),
            added_at=datetime.now(),
            is_active=True
        ).returning(user_companies_table.c.id)
        
        result = await db.execute(stmt)
        await db.commit()
        new_id = result.scalar_one()
        
        return {
            "message": "Company added successfully",
            "id": new_id,
            "cin": cin,
            "company_name": company_data.get('company_name')
        }
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        logger.error(f"Error adding company: {str(e)}")
        
        # Handle unique constraint violations specifically
        if "unique constraint" in str(e).lower() or "duplicate key" in str(e).lower():
            company_name = company_data.get('company_name', 'This company')
            raise HTTPException(
                status_code=400, 
                detail=f'The company "{company_name}" already exists in your Company Master'
            )
        
        raise HTTPException(status_code=500, detail=f"Failed to add company: {str(e)}")


@router.get("/{company_id}")
async def get_company(
    company_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get detailed company information by ID (for View popup)"""
    try:
        # Get company from user_companies
        stmt = select(user_companies_table).where(user_companies_table.c.id == company_id)
        result = await db.execute(stmt)
        row = result.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Company not found")
        
        # Get additional details from MCA cache if available
        mca_metadata = MetaData()
        mca_cache_table = Table(
            'mca_companies_cache',
            mca_metadata,
            Column('id', Integer, primary_key=True),
            Column('company_name', String(500)),
            Column('cin', String(21)),
            Column('company_status', String(50)),
            Column('company_class', String(100)),
            Column('registration_date', String(50)),
            Column('authorized_capital', String(100)),
            Column('paid_up_capital', String(100)),
            Column('email', String(200)),
            Column('registered_address', Text),
            Column('listing_status', String(50)),
            Column('date_of_last_agm', String(50)),
            Column('date_of_balance_sheet', String(50)),
            Column('cached_at', DateTime),
        )
        
        mca_stmt = select(mca_cache_table).where(mca_cache_table.c.cin == row.cin)
        mca_result = await db.execute(mca_stmt)
        mca_row = mca_result.fetchone()
        
        # Build comprehensive response
        company_details = {
            # Basic info from user_companies
            'id': row.id,
            'cin': row.cin,
            'companyName': row.company_name,
            'entityType': row.entity_type,
            'companyStatus': row.company_status,
            'incorporationDate': str(row.incorporation_date) if row.incorporation_date else None,
            'addedAt': str(row.added_at) if row.added_at else None,
            'isActive': row.is_active,
        }
        
        # Add detailed info from MCA cache if available
        if mca_row:
            company_details.update({
                'registrationDate': mca_row.registration_date,
                'authorizedCapital': mca_row.authorized_capital,
                'paidUpCapital': mca_row.paid_up_capital,
                'email': mca_row.email,
                'registeredAddress': mca_row.registered_address,
                'listingStatus': mca_row.listing_status,
                'dateOfLastAGM': mca_row.date_of_last_agm,
                'dateOfBalanceSheet': mca_row.date_of_balance_sheet,
                'companyClass': mca_row.company_class,
                'lastUpdated': str(mca_row.cached_at) if mca_row.cached_at else None,
            })
        
        return company_details
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching company: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{company_id}")
async def update_company(
    company_id: int,
    company_data: Dict[str, Any],
    db: AsyncSession = Depends(get_db)
):
    """Update company information"""
    try:
        update_values = {}
        
        if 'company_name' in company_data:
            update_values['company_name'] = company_data['company_name']
        if 'company_status' in company_data:
            update_values['company_status'] = company_data['company_status']
        if 'entity_type' in company_data:
            update_values['entity_type'] = company_data['entity_type']
        if 'incorporation_date' in company_data:
            update_values['incorporation_date'] = company_data['incorporation_date']
        if 'is_active' in company_data:
            update_values['is_active'] = company_data['is_active']
        
        if not update_values:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        stmt = update(user_companies_table).where(
            user_companies_table.c.id == company_id
        ).values(**update_values)
        
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "Company updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        logger.error(f"Error updating company: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{company_id}")
async def delete_company(
    company_id: int,
    soft_delete: bool = True,
    db: AsyncSession = Depends(get_db)
):
    """Delete company (soft delete by default)"""
    try:
        if soft_delete:
            # Soft delete - mark as inactive
            stmt = update(user_companies_table).where(
                user_companies_table.c.id == company_id
            ).values(is_active=False)
        else:
            # Hard delete - remove from database
            stmt = delete(user_companies_table).where(
                user_companies_table.c.id == company_id
            )
        
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "Company deleted successfully"}
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Error deleting company: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{company_id}/activate")
async def activate_company(
    company_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Reactivate a soft-deleted company"""
    try:
        stmt = update(user_companies_table).where(
            user_companies_table.c.id == company_id
        ).values(is_active=True)
        
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "Company activated successfully"}
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Error activating company: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

