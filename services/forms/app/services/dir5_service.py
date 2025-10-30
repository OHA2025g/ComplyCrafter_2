from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.dir5 import DIR5, DIR5Create, DIR5Update, DIR5View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class DIR5Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_dir5(self, dir5_data: DIR5Create, user_id: int) -> DIR5:
        """Create a new dir5 record"""
        try:
            dir5 = DIR5(
                **dir5_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(dir5)
            await self.db.commit()
            await self.db.refresh(dir5)
            logger.info(f"Created dir5 with ID: {dir5.id}")
            return dir5
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating dir5: {str(e)}")
            raise

    async def get_dir5(self, dir5_id: int) -> Optional[DIR5]:
        """Get a dir5 by ID"""
        try:
            return self.db.query(DIR5).filter(
                and_(DIR5.id == dir5_id, DIR5.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting dir5 {dir5_id}: {str(e)}")
            raise

    async def get_dir5s(self, skip: int = 0, limit: int = 100) -> List[DIR5]:
        """Get all active dir5s with pagination"""
        try:
            return list((await self.db.execute(select(DIR5).where(
                DIR5.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting dir5s: {str(e)}")
            raise

    async def get_dir5s_by_company(self, company_id: int) -> List[DIR5]:
        """Get all dir5s for a specific company"""
        try:
            return self.db.query(DIR5).filter(
                and_(
                    DIR5.company_id == company_id,
                    DIR5.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting dir5s for company {company_id}: {str(e)}")
            raise

    async def update_dir5(self, dir5_id: int, dir5_data: DIR5Update, user_id: int) -> Optional[DIR5]:
        """Update a dir5 record"""
        try:
            dir5 = self.get_dir5(dir5_id)
            if not dir5:
                return None

            update_data = dir5_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(dir5, field, value)
            
            dir5.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(dir5)
            logger.info(f"Updated dir5 with ID: {dir5_id}")
            return dir5
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating dir5 {dir5_id}: {str(e)}")
            raise

    async def delete_dir5(self, dir5_id: int, user_id: int) -> bool:
        """Soft delete a dir5 record"""
        try:
            dir5 = self.get_dir5(dir5_id)
            if not dir5:
                return False

            dir5.is_active = False
            dir5.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted dir5 with ID: {dir5_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting dir5 {dir5_id}: {str(e)}")
            raise

    async def change_status(self, dir5_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a dir5"""
        try:
            dir5 = self.get_dir5(dir5_id)
            if not dir5:
                return False

            dir5.is_active = status
            dir5.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of dir5 {dir5_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of dir5 {dir5_id}: {str(e)}")
            raise