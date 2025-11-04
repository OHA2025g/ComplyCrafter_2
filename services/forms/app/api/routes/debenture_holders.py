"""
Debenture Holders API Routes
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, delete, Table, MetaData, Column, Integer, String, BigInteger, Date, Numeric
from typing import List, Dict, Any
import logging

from app.api.dependencies import get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/debenture-holders", tags=["Debenture Holders"])

metadata = MetaData()
debenture_holders_table = Table(
    'debenture_holders',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('company_id', Integer),
    Column('company_cin', String(21)),
    Column('holder_name', String(500)),
    Column('debenture_no', String(100)),
    Column('debenture_type', String(200)),
    Column('units', BigInteger),
    Column('face_value', Numeric(15, 2)),
    Column('issue_date', Date),
    Column('maturity_date', Date),
    Column('interest_rate', Numeric(5, 2)),
    Column('status', String(50)),
    Column('pan', String(20)),
)


@router.get("/", response_model=List[Dict[str, Any]])
async def get_all_debenture_holders(
    company_id: int = None,
    company_cin: str = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all debenture holders"""
    try:
        stmt = select(debenture_holders_table)
        
        if company_id:
            stmt = stmt.where(debenture_holders_table.c.company_id == company_id)
        if company_cin:
            stmt = stmt.where(debenture_holders_table.c.company_cin == company_cin)
        
        result = await db.execute(stmt)
        rows = result.fetchall()
        
        holders = []
        for row in rows:
            holders.append({
                'srNo': row.id,
                'holderName': row.holder_name,
                'debentureNo': row.debenture_no,
                'debentureType': row.debenture_type,
                'units': row.units,
                'faceValue': float(row.face_value) if row.face_value else 0,
                'issueDate': str(row.issue_date) if row.issue_date else None,
                'maturityDate': str(row.maturity_date) if row.maturity_date else None,
                'interestRate': float(row.interest_rate) if row.interest_rate else 0,
                'status': row.status,
                'pan': row.pan,
                'companyCin': row.company_cin
            })
        
        return holders
        
    except Exception as e:
        logger.error(f"Error fetching debenture holders: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
async def create_debenture_holder(data: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Create new debenture holder"""
    try:
        stmt = insert(debenture_holders_table).values(
            company_id=data.get('company_id'),
            company_cin=data.get('company_cin'),
            holder_name=data.get('holder_name'),
            debenture_no=data.get('debenture_no'),
            debenture_type=data.get('debenture_type'),
            units=data.get('units'),
            face_value=data.get('face_value'),
            issue_date=data.get('issue_date'),
            maturity_date=data.get('maturity_date'),
            interest_rate=data.get('interest_rate'),
            status=data.get('status', 'Active'),
            pan=data.get('pan')
        )
        
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "Debenture holder created successfully"}
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{holder_id}")
async def delete_debenture_holder(holder_id: int, db: AsyncSession = Depends(get_db)):
    """Delete debenture holder"""
    try:
        stmt = delete(debenture_holders_table).where(debenture_holders_table.c.id == holder_id)
        await db.execute(stmt)
        await db.commit()
        return {"message": "Debenture holder deleted successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

