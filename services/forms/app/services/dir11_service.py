from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.dir11 import DIR11, DIR11Create, DIR11Update, DIR11View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class DIR11Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_dir11(self, dir11_data: DIR11Create, user_id: int) -> DIR11:
        """Create a new dir11 record"""
        try:
            dir11 = DIR11(
                **dir11_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(dir11)
            await self.db.commit()
            await self.db.refresh(dir11)
            logger.info(f"Created dir11 with ID: {dir11.id}")
            return dir11
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating dir11: {str(e)}")
            raise

    async def get_dir11(self, dir11_id: int) -> Optional[DIR11]:
        """Get a dir11 by ID"""
        try:
            return self.db.query(DIR11).filter(
                and_(DIR11.id == dir11_id, DIR11.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting dir11 {dir11_id}: {str(e)}")
            raise

    async def get_dir11s(self, skip: int = 0, limit: int = 100) -> List[DIR11]:
        """Get all active dir11s with pagination"""
        try:
            return list((await self.db.execute(select(DIR11).where(
                DIR11.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting dir11s: {str(e)}")
            raise

    async def get_dir11s_by_company(self, company_id: int) -> List[DIR11]:
        """Get all dir11s for a specific company"""
        try:
            return self.db.query(DIR11).filter(
                and_(
                    DIR11.company_id == company_id,
                    DIR11.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting dir11s for company {company_id}: {str(e)}")
            raise

    async def update_dir11(self, dir11_id: int, dir11_data: DIR11Update, user_id: int) -> Optional[DIR11]:
        """Update a dir11 record"""
        try:
            dir11 = self.get_dir11(dir11_id)
            if not dir11:
                return None

            update_data = dir11_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(dir11, field, value)
            
            dir11.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(dir11)
            logger.info(f"Updated dir11 with ID: {dir11_id}")
            return dir11
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating dir11 {dir11_id}: {str(e)}")
            raise

    async def delete_dir11(self, dir11_id: int, user_id: int) -> bool:
        """Soft delete a dir11 record"""
        try:
            dir11 = self.get_dir11(dir11_id)
            if not dir11:
                return False

            dir11.is_active = False
            dir11.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted dir11 with ID: {dir11_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting dir11 {dir11_id}: {str(e)}")
            raise

    async def change_status(self, dir11_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a dir11"""
        try:
            dir11 = self.get_dir11(dir11_id)
            if not dir11:
                return False

            dir11.is_active = status
            dir11.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of dir11 {dir11_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of dir11 {dir11_id}: {str(e)}")
            raise