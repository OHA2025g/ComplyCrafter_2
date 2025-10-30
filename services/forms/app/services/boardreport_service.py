from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.boardreport import BOARDREPORT, BOARDREPORTCreate, BOARDREPORTUpdate, BOARDREPORTView
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class BOARDREPORTService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_boardreport(self, boardreport_data: BOARDREPORTCreate, user_id: int) -> BOARDREPORT:
        """Create a new boardreport record"""
        try:
            boardreport = BOARDREPORT(
                **boardreport_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(boardreport)
            await self.db.commit()
            await self.db.refresh(boardreport)
            logger.info(f"Created boardreport with ID: {boardreport.id}")
            return boardreport
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating boardreport: {str(e)}")
            raise

    async def get_boardreport(self, boardreport_id: int) -> Optional[BOARDREPORT]:
        """Get a boardreport by ID"""
        try:
            return self.db.query(BOARDREPORT).filter(
                and_(BOARDREPORT.id == boardreport_id, BOARDREPORT.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting boardreport {boardreport_id}: {str(e)}")
            raise

    async def get_boardreports(self, skip: int = 0, limit: int = 100) -> List[BOARDREPORT]:
        """Get all active boardreports with pagination"""
        try:
            return list((await self.db.execute(select(BOARDREPORT).where(
                BOARDREPORT.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting boardreports: {str(e)}")
            raise

    async def get_boardreports_by_company(self, company_id: int) -> List[BOARDREPORT]:
        """Get all boardreports for a specific company"""
        try:
            return self.db.query(BOARDREPORT).filter(
                and_(
                    BOARDREPORT.company_id == company_id,
                    BOARDREPORT.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting boardreports for company {company_id}: {str(e)}")
            raise

    async def update_boardreport(self, boardreport_id: int, boardreport_data: BOARDREPORTUpdate, user_id: int) -> Optional[BOARDREPORT]:
        """Update a boardreport record"""
        try:
            boardreport = self.get_boardreport(boardreport_id)
            if not boardreport:
                return None

            update_data = boardreport_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(boardreport, field, value)
            
            boardreport.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(boardreport)
            logger.info(f"Updated boardreport with ID: {boardreport_id}")
            return boardreport
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating boardreport {boardreport_id}: {str(e)}")
            raise

    async def delete_boardreport(self, boardreport_id: int, user_id: int) -> bool:
        """Soft delete a boardreport record"""
        try:
            boardreport = self.get_boardreport(boardreport_id)
            if not boardreport:
                return False

            boardreport.is_active = False
            boardreport.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted boardreport with ID: {boardreport_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting boardreport {boardreport_id}: {str(e)}")
            raise

    async def change_status(self, boardreport_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a boardreport"""
        try:
            boardreport = self.get_boardreport(boardreport_id)
            if not boardreport:
                return False

            boardreport.is_active = status
            boardreport.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of boardreport {boardreport_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of boardreport {boardreport_id}: {str(e)}")
            raise