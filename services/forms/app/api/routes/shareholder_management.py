"""
Shareholder Management API Routes
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, update, delete, Table, MetaData, Column, Integer, String, Text, Date, DateTime
from typing import List, Dict, Any
from datetime import datetime
import logging

from app.api.dependencies import get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/shareholder-management", tags=["Shareholder Management"])

metadata = MetaData()
shareholder_transactions_table = Table(
    'shareholder_transactions',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('company_id', Integer),
    Column('shareholder_id', Integer),
    Column('shareholder_name', String(500)),
    Column('folio_no', String(100)),
    Column('transaction_type', String(100)),
    Column('shares', Integer),
    Column('transaction_date', Date),
    Column('status', String(50)),
    Column('remarks', Text),
)


@router.get("/", response_model=List[Dict[str, Any]])
async def get_all_transactions(
    company_id: int = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all shareholder transactions"""
    try:
        stmt = select(shareholder_transactions_table)
        if company_id:
            stmt = stmt.where(shareholder_transactions_table.c.company_id == company_id)
        
        result = await db.execute(stmt)
        rows = result.fetchall()
        
        transactions = []
        for row in rows:
            transactions.append({
                'srNo': row.id,
                'shareholderName': row.shareholder_name,
                'folioNo': row.folio_no,
                'transactionType': row.transaction_type,
                'shares': row.shares,
                'transactionDate': str(row.transaction_date) if row.transaction_date else None,
                'status': row.status
            })
        
        return transactions
        
    except Exception as e:
        logger.error(f"Error fetching transactions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
async def create_transaction(
    transaction_data: Dict[str, Any],
    db: AsyncSession = Depends(get_db)
):
    """Create new transaction"""
    try:
        stmt = insert(shareholder_transactions_table).values(
            company_id=transaction_data.get('company_id'),
            shareholder_name=transaction_data.get('shareholder_name'),
            folio_no=transaction_data.get('folio_no'),
            transaction_type=transaction_data.get('transaction_type'),
            shares=transaction_data.get('shares'),
            transaction_date=transaction_data.get('transaction_date'),
            status=transaction_data.get('status', 'Pending'),
            created_at=datetime.now()
        )
        
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "Transaction created successfully"}
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating transaction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete transaction"""
    try:
        stmt = delete(shareholder_transactions_table).where(shareholder_transactions_table.c.id == transaction_id)
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "Transaction deleted successfully"}
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

