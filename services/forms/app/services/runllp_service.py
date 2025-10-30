from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.runllp import RUNLLP, RUNLLPCreate, RUNLLPUpdate, RUNLLPView
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class RUNLLPService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_runllp(self, runllp_data: RUNLLPCreate, user_id: int) -> RUNLLP:
        """Create a new runllp record"""
        try:
            runllp = RUNLLP(
                **runllp_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(runllp)
            await self.db.commit()
            await self.db.refresh(runllp)
            logger.info(f"Created runllp with ID: {runllp.id}")
            return runllp
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating runllp: {str(e)}")
            raise

    async def get_runllp(self, runllp_id: int) -> Optional[RUNLLP]:
        """Get a runllp by ID"""
        try:
            return self.db.query(RUNLLP).filter(
                and_(RUNLLP.id == runllp_id, RUNLLP.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting runllp {runllp_id}: {str(e)}")
            raise

    async def get_runllps(self, skip: int = 0, limit: int = 100) -> List[RUNLLP]:
        """Get all active runllps with pagination"""
        try:
            return list((await self.db.execute(select(RUNLLP).where(
                RUNLLP.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting runllps: {str(e)}")
            raise

    async def get_runllps_by_company(self, company_id: int) -> List[RUNLLP]:
        """Get all runllps for a specific company"""
        try:
            return self.db.query(RUNLLP).filter(
                and_(
                    RUNLLP.company_id == company_id,
                    RUNLLP.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting runllps for company {company_id}: {str(e)}")
            raise

    async def update_runllp(self, runllp_id: int, runllp_data: RUNLLPUpdate, user_id: int) -> Optional[RUNLLP]:
        """Update a runllp record"""
        try:
            runllp = self.get_runllp(runllp_id)
            if not runllp:
                return None

            update_data = runllp_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(runllp, field, value)
            
            runllp.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(runllp)
            logger.info(f"Updated runllp with ID: {runllp_id}")
            return runllp
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating runllp {runllp_id}: {str(e)}")
            raise

    async def delete_runllp(self, runllp_id: int, user_id: int) -> bool:
        """Soft delete a runllp record"""
        try:
            runllp = self.get_runllp(runllp_id)
            if not runllp:
                return False

            runllp.is_active = False
            runllp.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted runllp with ID: {runllp_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting runllp {runllp_id}: {str(e)}")
            raise

    async def change_status(self, runllp_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a runllp"""
        try:
            runllp = self.get_runllp(runllp_id)
            if not runllp:
                return False

            runllp.is_active = status
            runllp.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of runllp {runllp_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of runllp {runllp_id}: {str(e)}")
            raise