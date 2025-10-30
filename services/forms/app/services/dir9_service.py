from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.dir9 import DIR9, DIR9Create, DIR9Update, DIR9View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class DIR9Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_dir9(self, dir9_data: DIR9Create, user_id: int) -> DIR9:
        """Create a new dir9 record"""
        try:
            dir9 = DIR9(
                **dir9_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(dir9)
            await self.db.commit()
            await self.db.refresh(dir9)
            logger.info(f"Created dir9 with ID: {dir9.id}")
            return dir9
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating dir9: {str(e)}")
            raise

    async def get_dir9(self, dir9_id: int) -> Optional[DIR9]:
        """Get a dir9 by ID"""
        try:
            return self.db.query(DIR9).filter(
                and_(DIR9.id == dir9_id, DIR9.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting dir9 {dir9_id}: {str(e)}")
            raise

    async def get_dir9s(self, skip: int = 0, limit: int = 100) -> List[DIR9]:
        """Get all active dir9s with pagination"""
        try:
            return list((await self.db.execute(select(DIR9).where(
                DIR9.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting dir9s: {str(e)}")
            raise

    async def get_dir9s_by_company(self, company_id: int) -> List[DIR9]:
        """Get all dir9s for a specific company"""
        try:
            return self.db.query(DIR9).filter(
                and_(
                    DIR9.company_id == company_id,
                    DIR9.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting dir9s for company {company_id}: {str(e)}")
            raise

    async def update_dir9(self, dir9_id: int, dir9_data: DIR9Update, user_id: int) -> Optional[DIR9]:
        """Update a dir9 record"""
        try:
            dir9 = self.get_dir9(dir9_id)
            if not dir9:
                return None

            update_data = dir9_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(dir9, field, value)
            
            dir9.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(dir9)
            logger.info(f"Updated dir9 with ID: {dir9_id}")
            return dir9
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating dir9 {dir9_id}: {str(e)}")
            raise

    async def delete_dir9(self, dir9_id: int, user_id: int) -> bool:
        """Soft delete a dir9 record"""
        try:
            dir9 = self.get_dir9(dir9_id)
            if not dir9:
                return False

            dir9.is_active = False
            dir9.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted dir9 with ID: {dir9_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting dir9 {dir9_id}: {str(e)}")
            raise

    async def change_status(self, dir9_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a dir9"""
        try:
            dir9 = self.get_dir9(dir9_id)
            if not dir9:
                return False

            dir9.is_active = status
            dir9.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of dir9 {dir9_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of dir9 {dir9_id}: {str(e)}")
            raise