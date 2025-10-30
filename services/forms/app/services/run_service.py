from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.run import RUN, RUNCreate, RUNUpdate, RUNView
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class RUNService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_run(self, run_data: RUNCreate, user_id: int) -> RUN:
        """Create a new run record"""
        try:
            run = RUN(
                **run_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(run)
            await self.db.commit()
            await self.db.refresh(run)
            logger.info(f"Created run with ID: {run.id}")
            return run
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating run: {str(e)}")
            raise

    async def get_run(self, run_id: int) -> Optional[RUN]:
        """Get a run by ID"""
        try:
            return self.db.query(RUN).filter(
                and_(RUN.id == run_id, RUN.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting run {run_id}: {str(e)}")
            raise

    async def get_runs(self, skip: int = 0, limit: int = 100) -> List[RUN]:
        """Get all active runs with pagination"""
        try:
            return list((await self.db.execute(select(RUN).where(
                RUN.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting runs: {str(e)}")
            raise

    async def get_runs_by_company(self, company_id: int) -> List[RUN]:
        """Get all runs for a specific company"""
        try:
            return self.db.query(RUN).filter(
                and_(
                    RUN.company_id == company_id,
                    RUN.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting runs for company {company_id}: {str(e)}")
            raise

    async def update_run(self, run_id: int, run_data: RUNUpdate, user_id: int) -> Optional[RUN]:
        """Update a run record"""
        try:
            run = self.get_run(run_id)
            if not run:
                return None

            update_data = run_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(run, field, value)
            
            run.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(run)
            logger.info(f"Updated run with ID: {run_id}")
            return run
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating run {run_id}: {str(e)}")
            raise

    async def delete_run(self, run_id: int, user_id: int) -> bool:
        """Soft delete a run record"""
        try:
            run = self.get_run(run_id)
            if not run:
                return False

            run.is_active = False
            run.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted run with ID: {run_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting run {run_id}: {str(e)}")
            raise

    async def change_status(self, run_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a run"""
        try:
            run = self.get_run(run_id)
            if not run:
                return False

            run.is_active = status
            run.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of run {run_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of run {run_id}: {str(e)}")
            raise