"""
Meetings API Routes (Board, AGM, EGM, Committee)
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, update, delete, Table, MetaData, Column, Integer, String, Text, Date, DateTime
from typing import List, Dict, Any
from datetime import datetime
import logging

from app.api.dependencies import get_db

logger = logging.getLogger(__name__)

# Create separate routers for each meeting type
# Note: Prefixes without trailing slashes to avoid 307 redirects
board_router = APIRouter(prefix="/meetings/board", tags=["Board Meetings"])
agm_router = APIRouter(prefix="/meetings/agm", tags=["AGM"])
egm_router = APIRouter(prefix="/meetings/egm", tags=["EGM"])
committee_router = APIRouter(prefix="/meetings/committee", tags=["Committee Meetings"])

# Define table structures
metadata = MetaData()

board_meetings_table = Table(
    'board_meetings',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('company_id', Integer),
    Column('meeting_no', String(100)),
    Column('meeting_date', Date),
    Column('venue', String(500)),
    Column('attendees', Integer),
    Column('status', String(50)),
    Column('agenda_items', Text),
    Column('minutes', Text),
)

agm_meetings_table = Table(
    'agm_meetings',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('company_id', Integer),
    Column('financial_year', String(20)),
    Column('meeting_date', Date),
    Column('venue', String(500)),
    Column('shareholders', Integer),
    Column('status', String(50)),
    Column('notice_sent_date', Date),
)

egm_meetings_table = Table(
    'egm_meetings',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('company_id', Integer),
    Column('meeting_no', String(100)),
    Column('meeting_date', Date),
    Column('purpose', Text),
    Column('venue', String(500)),
    Column('status', String(50)),
)

committee_meetings_table = Table(
    'committee_meetings',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('company_id', Integer),
    Column('meeting_no', String(100)),
    Column('committee_type', String(200)),
    Column('meeting_date', Date),
    Column('venue', String(500)),
    Column('members', Integer),
    Column('status', String(50)),
    Column('agenda_items', Text),
    Column('minutes', Text),
)


# ==================== BOARD MEETINGS ====================

@board_router.get("")
async def get_board_meetings(company_id: int = None, db: AsyncSession = Depends(get_db)):
    """Get all board meetings"""
    try:
        stmt = select(board_meetings_table)
        if company_id:
            stmt = stmt.where(board_meetings_table.c.company_id == company_id)
        
        result = await db.execute(stmt)
        rows = result.fetchall()
        
        meetings = []
        for row in rows:
            meetings.append({
                'srNo': row.id,
                'meetingNo': row.meeting_no,
                'meetingDate': str(row.meeting_date) if row.meeting_date else None,
                'venue': row.venue,
                'attendees': row.attendees,
                'status': row.status
            })
        
        return meetings
        
    except Exception as e:
        logger.error(f"Error fetching board meetings: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@board_router.post("")
async def create_board_meeting(meeting_data: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Create board meeting"""
    try:
        stmt = insert(board_meetings_table).values(
            company_id=meeting_data.get('company_id'),
            meeting_no=meeting_data.get('meeting_no'),
            meeting_date=meeting_data.get('meeting_date'),
            venue=meeting_data.get('venue'),
            attendees=meeting_data.get('attendees', 0),
            status=meeting_data.get('status', 'Scheduled')
        )
        
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "Board meeting created successfully"}
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@board_router.delete("/{meeting_id}")
async def delete_board_meeting(meeting_id: int, db: AsyncSession = Depends(get_db)):
    """Delete board meeting"""
    try:
        stmt = delete(board_meetings_table).where(board_meetings_table.c.id == meeting_id)
        await db.execute(stmt)
        await db.commit()
        return {"message": "Meeting deleted successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ==================== AGM ====================

@agm_router.get("")
async def get_agm_meetings(company_id: int = None, db: AsyncSession = Depends(get_db)):
    """Get all AGM meetings"""
    try:
        stmt = select(agm_meetings_table)
        if company_id:
            stmt = stmt.where(agm_meetings_table.c.company_id == company_id)
        
        result = await db.execute(stmt)
        rows = result.fetchall()
        
        meetings = []
        for row in rows:
            meetings.append({
                'srNo': row.id,
                'financialYear': row.financial_year,
                'meetingDate': str(row.meeting_date) if row.meeting_date else None,
                'venue': row.venue,
                'shareholders': row.shareholders,
                'status': row.status
            })
        
        return meetings
        
    except Exception as e:
        logger.error(f"Error fetching AGM meetings: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@agm_router.post("")
async def create_agm_meeting(meeting_data: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Create AGM meeting"""
    try:
        stmt = insert(agm_meetings_table).values(
            company_id=meeting_data.get('company_id'),
            financial_year=meeting_data.get('financial_year'),
            meeting_date=meeting_data.get('meeting_date'),
            venue=meeting_data.get('venue'),
            shareholders=meeting_data.get('shareholders', 0),
            status=meeting_data.get('status', 'Scheduled')
        )
        
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "AGM created successfully"}
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ==================== EGM ====================

@egm_router.get("")
async def get_egm_meetings(company_id: int = None, db: AsyncSession = Depends(get_db)):
    """Get all EGM meetings"""
    try:
        stmt = select(egm_meetings_table)
        if company_id:
            stmt = stmt.where(egm_meetings_table.c.company_id == company_id)
        
        result = await db.execute(stmt)
        rows = result.fetchall()
        
        meetings = []
        for row in rows:
            meetings.append({
                'srNo': row.id,
                'meetingNo': row.meeting_no,
                'meetingDate': str(row.meeting_date) if row.meeting_date else None,
                'purpose': row.purpose,
                'venue': row.venue,
                'status': row.status
            })
        
        return meetings
        
    except Exception as e:
        logger.error(f"Error fetching EGM meetings: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@egm_router.post("")
async def create_egm_meeting(meeting_data: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Create EGM meeting"""
    try:
        stmt = insert(egm_meetings_table).values(
            company_id=meeting_data.get('company_id'),
            meeting_no=meeting_data.get('meeting_no'),
            meeting_date=meeting_data.get('meeting_date'),
            purpose=meeting_data.get('purpose'),
            venue=meeting_data.get('venue'),
            status=meeting_data.get('status', 'Scheduled')
        )
        
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "EGM created successfully"}
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ==================== COMMITTEE MEETINGS ====================

@committee_router.get("")
async def get_committee_meetings(company_id: int = None, db: AsyncSession = Depends(get_db)):
    """Get all committee meetings"""
    try:
        stmt = select(committee_meetings_table)
        if company_id:
            stmt = stmt.where(committee_meetings_table.c.company_id == company_id)
        
        result = await db.execute(stmt)
        rows = result.fetchall()
        
        meetings = []
        for row in rows:
            meetings.append({
                'srNo': row.id,
                'meetingNo': row.meeting_no,
                'committeeType': row.committee_type,
                'meetingDate': str(row.meeting_date) if row.meeting_date else None,
                'venue': row.venue,
                'members': row.members,
                'status': row.status
            })
        
        return meetings
        
    except Exception as e:
        logger.error(f"Error fetching committee meetings: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@committee_router.post("")
async def create_committee_meeting(meeting_data: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Create committee meeting"""
    try:
        stmt = insert(committee_meetings_table).values(
            company_id=meeting_data.get('company_id'),
            meeting_no=meeting_data.get('meeting_no'),
            committee_type=meeting_data.get('committee_type'),
            meeting_date=meeting_data.get('meeting_date'),
            venue=meeting_data.get('venue'),
            members=meeting_data.get('members', 0),
            status=meeting_data.get('status', 'Scheduled')
        )
        
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "Committee meeting created successfully"}
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

