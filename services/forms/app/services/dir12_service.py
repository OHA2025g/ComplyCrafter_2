from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.dir12 import DIR12, DIR12Create, DIR12Update, DIR12View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class DIR12Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_dir12(self, dir12_data: DIR12Create, user_id: int) -> DIR12:
        """Create a new dir12 record"""
        try:
            dir12 = DIR12(
                **dir12_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(dir12)
            await self.db.commit()
            await self.db.refresh(dir12)
            logger.info(f"Created dir12 with ID: {dir12.id}")
            return dir12
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating dir12: {str(e)}")
            raise

    async def get_dir12(self, dir12_id: int) -> Optional[DIR12]:
        """Get a dir12 by ID"""
        try:
            return self.db.query(DIR12).filter(
                and_(DIR12.id == dir12_id, DIR12.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting dir12 {dir12_id}: {str(e)}")
            raise

    async def get_dir12s(self, skip: int = 0, limit: int = 100) -> List[DIR12]:
        """Get all active dir12s with pagination"""
        try:
            return list((await self.db.execute(select(DIR12).where(
                DIR12.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting dir12s: {str(e)}")
            raise

    async def get_dir12s_by_company(self, company_id: int) -> List[DIR12]:
        """Get all dir12s for a specific company"""
        try:
            return self.db.query(DIR12).filter(
                and_(
                    DIR12.company_id == company_id,
                    DIR12.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting dir12s for company {company_id}: {str(e)}")
            raise

    async def update_dir12(self, dir12_id: int, dir12_data: DIR12Update, user_id: int) -> Optional[DIR12]:
        """Update a dir12 record"""
        try:
            dir12 = self.get_dir12(dir12_id)
            if not dir12:
                return None

            update_data = dir12_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(dir12, field, value)
            
            dir12.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(dir12)
            logger.info(f"Updated dir12 with ID: {dir12_id}")
            return dir12
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating dir12 {dir12_id}: {str(e)}")
            raise

    async def delete_dir12(self, dir12_id: int, user_id: int) -> bool:
        """Soft delete a dir12 record"""
        try:
            dir12 = self.get_dir12(dir12_id)
            if not dir12:
                return False

            dir12.is_active = False
            dir12.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted dir12 with ID: {dir12_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting dir12 {dir12_id}: {str(e)}")
            raise

    async def change_status(self, dir12_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a dir12"""
        try:
            dir12 = self.get_dir12(dir12_id)
            if not dir12:
                return False

            dir12.is_active = status
            dir12.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of dir12 {dir12_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of dir12 {dir12_id}: {str(e)}")
            raise