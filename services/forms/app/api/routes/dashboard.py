"""
Dashboard API Endpoints
Provides dashboard statistics and calendar events
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, List, Any
import logging
from datetime import datetime, timedelta

from app.api.dependencies import get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db)
) -> Dict[str, int]:
    """
    Get dashboard statistics (clients count, meetings count)
    """
    try:
        from sqlalchemy import select, func, Table, MetaData, Column, Integer, String, Boolean
        
        # For now, return sample data
        # TODO: Replace with actual queries when company/meeting tables are ready
        
        # Try to count from user_companies table
        metadata = MetaData()
        user_companies = Table(
            'user_companies',
            metadata,
            Column('id', Integer, primary_key=True),
            Column('user_id', Integer),
            Column('is_active', Boolean),
        )
        
        # Count active companies (clients)
        stmt = select(func.count(user_companies.c.id)).where(
            user_companies.c.is_active == True
        )
        result = await db.execute(stmt)
        clients_count = result.scalar() or 0
        
        # Meetings count - placeholder for now
        meetings_count = 0  # TODO: Count from meetings table when available
        
        return {
            "clients_count": clients_count,
            "meetings_count": meetings_count
        }
        
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {str(e)}")
        # Return default values on error
        return {
            "clients_count": 0,
            "meetings_count": 0
        }


@router.get("/events")
async def get_calendar_events(
    start_date: str = None,
    end_date: str = None,
    db: AsyncSession = Depends(get_db)
) -> List[Dict[str, Any]]:
    """
    Get calendar events for dashboard
    """
    try:
        # Sample events for demonstration
        # TODO: Replace with actual meetings/events from database
        
        sample_events = [
            {
                "id": 1,
                "title": "All Day Event",
                "start_date": "2025-03-31",
                "end_date": "2025-04-01",
                "is_all_day": True,
                "is_repeating": False
            },
            {
                "id": 2,
                "title": "Long Event",
                "start_date": "2025-04-06",
                "end_date": "2025-04-09",
                "is_all_day": True,
                "is_repeating": False
            },
            {
                "id": 3,
                "title": "Repeating Event",
                "start_date": "2025-04-08",
                "start_time": "4:00 PM",
                "is_all_day": False,
                "is_repeating": True
            },
            {
                "id": 4,
                "title": "Conference",
                "start_date": "2025-04-10",
                "end_date": "2025-04-12",
                "is_all_day": True,
                "is_repeating": False
            },
            {
                "id": 5,
                "title": "Meeting",
                "start_date": "2025-04-12",
                "start_time": "10:30 AM",
                "is_all_day": False,
                "is_repeating": False
            },
            {
                "id": 6,
                "title": "Lunch",
                "start_date": "2025-04-12",
                "start_time": "12:00 PM",
                "is_all_day": False,
                "is_repeating": False
            }
        ]
        
        return sample_events
        
    except Exception as e:
        logger.error(f"Error fetching calendar events: {str(e)}")
        return []

