"""
Shareholders API Routes
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, delete, Table, MetaData, Column, Integer, String, BigInteger, Text, DateTime
from typing import List, Dict, Any
import logging

from app.api.dependencies import get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/shareholders", tags=["Shareholders"])

metadata = MetaData()
shareholders_table = Table(
    'shareholders',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('company_id', Integer),
    Column('company_cin', String(21)),
    Column('shareholder_name', String(500)),
    Column('folio_no', String(100)),
    Column('category', String(200)),
    Column('sub_category', String(200)),
    Column('under_sub_category', String(200)),
    Column('shares_held', BigInteger),
    Column('pan', String(20)),
    Column('status', String(50)),
)


@router.get("/", response_model=List[Dict[str, Any]])
async def get_all_shareholders(
    company_id: int = None,
    company_cin: str = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all shareholders"""
    try:
        stmt = select(shareholders_table)
        
        if company_id:
            stmt = stmt.where(shareholders_table.c.company_id == company_id)
        if company_cin:
            stmt = stmt.where(shareholders_table.c.company_cin == company_cin)
        
        result = await db.execute(stmt)
        rows = result.fetchall()
        
        shareholders = []
        for row in rows:
            shareholders.append({
                'srNo': row.id,
                'shareholderName': row.shareholder_name,
                'folioNo': row.folio_no,
                'category': row.category,
                'subCategory': row.sub_category,
                'underSubCategory': row.under_sub_category,
                'sharesHeld': row.shares_held,
                'pan': row.pan,
                'status': row.status,
                'companyCin': row.company_cin
            })
        
        return shareholders
        
    except Exception as e:
        logger.error(f"Error fetching shareholders: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
async def create_shareholder(data: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Create new shareholder"""
    try:
        stmt = insert(shareholders_table).values(
            company_id=data.get('company_id'),
            company_cin=data.get('company_cin'),
            shareholder_name=data.get('shareholder_name'),
            folio_no=data.get('folio_no'),
            category=data.get('category'),
            sub_category=data.get('sub_category'),
            under_sub_category=data.get('under_sub_category'),
            shares_held=data.get('shares_held', 0),
            pan=data.get('pan'),
            status=data.get('status', 'Active')
        )
        
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "Shareholder created successfully"}
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{shareholder_id}")
async def delete_shareholder(shareholder_id: int, db: AsyncSession = Depends(get_db)):
    """Delete shareholder"""
    try:
        stmt = delete(shareholders_table).where(shareholders_table.c.id == shareholder_id)
        await db.execute(stmt)
        await db.commit()
        return {"message": "Shareholder deleted successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

