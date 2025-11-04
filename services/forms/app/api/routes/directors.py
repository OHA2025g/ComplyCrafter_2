"""
Directors API Routes - Directors and Key Managerial Personnel
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, update, delete, Table, MetaData, Column, Integer, String, Date, DateTime
from typing import List, Dict, Any
from datetime import datetime
import logging

from app.api.dependencies import get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/directors", tags=["Directors"])

metadata = MetaData()
directors_table = Table(
    'directors',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('company_id', Integer),
    Column('company_cin', String(21)),
    Column('din', String(20)),
    Column('director_name', String(500)),
    Column('designation', String(200)),
    Column('appointment_date', Date),
    Column('cessation_date', Date),
    Column('status', String(50)),
    Column('nationality', String(100)),
    Column('pan', String(20)),
    Column('email', String(255)),
    Column('phone', String(20)),
)


@router.get("/", response_model=List[Dict[str, Any]])
async def get_all_directors(
    company_id: int = None,
    company_cin: str = None,
    status: str = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all directors"""
    try:
        stmt = select(directors_table)
        
        if company_id:
            stmt = stmt.where(directors_table.c.company_id == company_id)
        if company_cin:
            stmt = stmt.where(directors_table.c.company_cin == company_cin)
        if status:
            stmt = stmt.where(directors_table.c.status == status)
        
        stmt = stmt.order_by(directors_table.c.appointment_date.desc())
        
        result = await db.execute(stmt)
        rows = result.fetchall()
        
        directors = []
        for row in rows:
            directors.append({
                'srNo': row.id,
                'din': row.din,
                'directorName': row.director_name,
                'designation': row.designation,
                'appointmentDate': str(row.appointment_date) if row.appointment_date else None,
                'status': row.status,
                'nationality': row.nationality,
                'pan': row.pan,
                'email': row.email,
                'phone': row.phone,
                'companyCin': row.company_cin
            })
        
        return directors
        
    except Exception as e:
        logger.error(f"Error fetching directors: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
async def create_director(director_data: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Create new director"""
    try:
        stmt = insert(directors_table).values(
            company_id=director_data.get('company_id'),
            company_cin=director_data.get('company_cin'),
            din=director_data.get('din'),
            director_name=director_data.get('director_name'),
            designation=director_data.get('designation'),
            appointment_date=director_data.get('appointment_date'),
            status=director_data.get('status', 'Active'),
            nationality=director_data.get('nationality'),
            pan=director_data.get('pan'),
            email=director_data.get('email'),
            phone=director_data.get('phone')
        )
        
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "Director created successfully"}
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating director: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{director_id}")
async def delete_director(director_id: int, db: AsyncSession = Depends(get_db)):
    """Delete director"""
    try:
        stmt = delete(directors_table).where(directors_table.c.id == director_id)
        await db.execute(stmt)
        await db.commit()
        return {"message": "Director deleted successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

