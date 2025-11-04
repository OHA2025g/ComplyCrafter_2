"""
Agendas API Routes
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, update, delete, Table, MetaData, Column, Integer, String, Text, Date, DateTime
from typing import List, Dict, Any
from datetime import date, datetime
import logging

from app.api.dependencies import get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/agendas", tags=["Agendas"])

# Define table structure
metadata = MetaData()
agendas_table = Table(
    'agendas',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('company_id', Integer),
    Column('agenda_title', String(500)),
    Column('description', Text),
    Column('meeting_type', String(100)),
    Column('status', String(50)),
    Column('created_date', Date),
    Column('created_by', Integer),
    Column('updated_at', DateTime),
    Column('created_at', DateTime),
)


@router.get("/", response_model=List[Dict[str, Any]])
async def get_all_agendas(
    company_id: int = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all agendas"""
    try:
        stmt = select(agendas_table)
        if company_id:
            stmt = stmt.where(agendas_table.c.company_id == company_id)
        
        result = await db.execute(stmt)
        rows = result.fetchall()
        
        agendas = []
        for row in rows:
            agendas.append({
                'id': row.id,
                'srNo': row.id,
                'agendaTitle': row.agenda_title,
                'description': row.description,
                'meetingType': row.meeting_type,
                'status': row.status,
                'createdDate': str(row.created_date) if row.created_date else None
            })
        
        return agendas
        
    except Exception as e:
        logger.error(f"Error fetching agendas: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
async def create_agenda(
    agenda_data: Dict[str, Any],
    db: AsyncSession = Depends(get_db)
):
    """Create new agenda"""
    try:
        stmt = insert(agendas_table).values(
            company_id=agenda_data.get('company_id'),
            agenda_title=agenda_data.get('agenda_title'),
            description=agenda_data.get('description'),
            meeting_type=agenda_data.get('meeting_type'),
            status=agenda_data.get('status', 'Active'),
            created_date=date.today(),
            created_by=agenda_data.get('created_by'),
            created_at=datetime.now()
        )
        
        result = await db.execute(stmt)
        await db.commit()
        
        return {"message": "Agenda created successfully", "id": result.lastrowid}
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating agenda: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{agenda_id}")
async def get_agenda(
    agenda_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get agenda by ID"""
    try:
        stmt = select(agendas_table).where(agendas_table.c.id == agenda_id)
        result = await db.execute(stmt)
        row = result.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Agenda not found")
        
        return {
            'id': row.id,
            'agendaTitle': row.agenda_title,
            'description': row.description,
            'meetingType': row.meeting_type,
            'status': row.status,
            'createdDate': str(row.created_date) if row.created_date else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching agenda: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{agenda_id}")
async def update_agenda(
    agenda_id: int,
    agenda_data: Dict[str, Any],
    db: AsyncSession = Depends(get_db)
):
    """Update agenda"""
    try:
        stmt = update(agendas_table).where(agendas_table.c.id == agenda_id).values(
            agenda_title=agenda_data.get('agenda_title'),
            description=agenda_data.get('description'),
            meeting_type=agenda_data.get('meeting_type'),
            status=agenda_data.get('status'),
            updated_at=datetime.now()
        )
        
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "Agenda updated successfully"}
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Error updating agenda: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{agenda_id}")
async def delete_agenda(
    agenda_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete agenda"""
    try:
        stmt = delete(agendas_table).where(agendas_table.c.id == agenda_id)
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "Agenda deleted successfully"}
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Error deleting agenda: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

