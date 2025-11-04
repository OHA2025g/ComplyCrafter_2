"""
Capital Structure API Routes (Authorized, Paid-up, Share Capital)
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, update, delete, Table, MetaData, Column, Integer, String, Date, DateTime, Numeric
from typing import List, Dict, Any
from datetime import datetime
import logging

from app.api.dependencies import get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/capital", tags=["Capital Structure"])

# Define table structures
metadata = MetaData()

authorized_capital_table = Table(
    'authorized_capital',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('company_id', Integer),
    Column('share_class', String(200)),
    Column('authorized_shares', Integer),
    Column('face_value', Numeric(15, 2)),
    Column('total_amount', Numeric(20, 2)),
    Column('amendment_date', Date),
)

paid_up_capital_table = Table(
    'paid_up_capital',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('company_id', Integer),
    Column('share_class', String(200)),
    Column('paid_up_shares', Integer),
    Column('face_value', Numeric(15, 2)),
    Column('total_amount', Numeric(20, 2)),
    Column('subscription_date', Date),
)

share_capital_table = Table(
    'share_capital',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('company_id', Integer),
    Column('share_class', String(200)),
    Column('authorized_shares', Integer),
    Column('paid_up_shares', Integer),
    Column('face_value', Numeric(15, 2)),
    Column('status', String(50)),
)


# ==================== AUTHORIZED CAPITAL ====================

@router.get("/authorized", response_model=List[Dict[str, Any]])
async def get_authorized_capital(
    company_id: int = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all authorized capital records"""
    try:
        stmt = select(authorized_capital_table)
        if company_id:
            stmt = stmt.where(authorized_capital_table.c.company_id == company_id)
        
        result = await db.execute(stmt)
        rows = result.fetchall()
        
        capitals = []
        for row in rows:
            capitals.append({
                'srNo': row.id,
                'shareClass': row.share_class,
                'authorizedShares': row.authorized_shares,
                'faceValue': float(row.face_value) if row.face_value else 0,
                'totalAmount': float(row.total_amount) if row.total_amount else 0,
                'amendmentDate': str(row.amendment_date) if row.amendment_date else None
            })
        
        return capitals
        
    except Exception as e:
        logger.error(f"Error fetching authorized capital: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/authorized")
async def create_authorized_capital(
    capital_data: Dict[str, Any],
    db: AsyncSession = Depends(get_db)
):
    """Create authorized capital record"""
    try:
        stmt = insert(authorized_capital_table).values(
            company_id=capital_data.get('company_id'),
            share_class=capital_data.get('share_class'),
            authorized_shares=capital_data.get('authorized_shares'),
            face_value=capital_data.get('face_value'),
            total_amount=capital_data.get('total_amount'),
            amendment_date=capital_data.get('amendment_date')
        )
        
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "Authorized capital created successfully"}
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating authorized capital: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== PAID-UP CAPITAL ====================

@router.get("/paid-up", response_model=List[Dict[str, Any]])
async def get_paid_up_capital(
    company_id: int = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all paid-up capital records"""
    try:
        stmt = select(paid_up_capital_table)
        if company_id:
            stmt = stmt.where(paid_up_capital_table.c.company_id == company_id)
        
        result = await db.execute(stmt)
        rows = result.fetchall()
        
        capitals = []
        for row in rows:
            capitals.append({
                'srNo': row.id,
                'shareClass': row.share_class,
                'paidUpShares': row.paid_up_shares,
                'faceValue': float(row.face_value) if row.face_value else 0,
                'totalAmount': float(row.total_amount) if row.total_amount else 0,
                'subscriptionDate': str(row.subscription_date) if row.subscription_date else None
            })
        
        return capitals
        
    except Exception as e:
        logger.error(f"Error fetching paid-up capital: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/paid-up")
async def create_paid_up_capital(
    capital_data: Dict[str, Any],
    db: AsyncSession = Depends(get_db)
):
    """Create paid-up capital record"""
    try:
        stmt = insert(paid_up_capital_table).values(
            company_id=capital_data.get('company_id'),
            share_class=capital_data.get('share_class'),
            paid_up_shares=capital_data.get('paid_up_shares'),
            face_value=capital_data.get('face_value'),
            total_amount=capital_data.get('total_amount'),
            subscription_date=capital_data.get('subscription_date')
        )
        
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "Paid-up capital created successfully"}
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating paid-up capital: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== SHARE CAPITAL ====================

@router.get("/share", response_model=List[Dict[str, Any]])
async def get_share_capital(
    company_id: int = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all share capital records"""
    try:
        stmt = select(share_capital_table)
        if company_id:
            stmt = stmt.where(share_capital_table.c.company_id == company_id)
        
        result = await db.execute(stmt)
        rows = result.fetchall()
        
        capitals = []
        for row in rows:
            capitals.append({
                'srNo': row.id,
                'shareClass': row.share_class,
                'authorizedShares': row.authorized_shares,
                'paidUpShares': row.paid_up_shares,
                'faceValue': float(row.face_value) if row.face_value else 0,
                'status': row.status
            })
        
        return capitals
        
    except Exception as e:
        logger.error(f"Error fetching share capital: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/share")
async def create_share_capital(
    capital_data: Dict[str, Any],
    db: AsyncSession = Depends(get_db)
):
    """Create share capital record"""
    try:
        stmt = insert(share_capital_table).values(
            company_id=capital_data.get('company_id'),
            share_class=capital_data.get('share_class'),
            authorized_shares=capital_data.get('authorized_shares'),
            paid_up_shares=capital_data.get('paid_up_shares'),
            face_value=capital_data.get('face_value'),
            status=capital_data.get('status', 'Active')
        )
        
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "Share capital created successfully"}
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating share capital: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

