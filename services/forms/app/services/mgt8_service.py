from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.mgt8 import MGT8, MGT8Create, MGT8Update, MGT8View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class MGT8Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_mgt8(self, mgt8_data: MGT8Create, user_id: int) -> MGT8:
        """Create a new mgt8 record"""
        try:
            mgt8 = MGT8(
                **mgt8_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(mgt8)
            await self.db.commit()
            await self.db.refresh(mgt8)
            logger.info(f"Created mgt8 with ID: {mgt8.id}")
            return mgt8
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating mgt8: {str(e)}")
            raise

    async def get_mgt8(self, mgt8_id: int) -> Optional[MGT8]:
        """Get a mgt8 by ID"""
        try:
            return self.db.query(MGT8).filter(
                and_(MGT8.id == mgt8_id, MGT8.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting mgt8 {mgt8_id}: {str(e)}")
            raise

    async def get_mgt8s(self, skip: int = 0, limit: int = 100) -> List[MGT8]:
        """Get all active mgt8s with pagination"""
        try:
            return list((await self.db.execute(select(MGT8).where(
                MGT8.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting mgt8s: {str(e)}")
            raise

    async def get_mgt8s_by_company(self, company_id: int) -> List[MGT8]:
        """Get all mgt8s for a specific company"""
        try:
            return self.db.query(MGT8).filter(
                and_(
                    MGT8.company_id == company_id,
                    MGT8.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting mgt8s for company {company_id}: {str(e)}")
            raise

    async def update_mgt8(self, mgt8_id: int, mgt8_data: MGT8Update, user_id: int) -> Optional[MGT8]:
        """Update a mgt8 record"""
        try:
            mgt8 = self.get_mgt8(mgt8_id)
            if not mgt8:
                return None

            update_data = mgt8_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(mgt8, field, value)
            
            mgt8.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(mgt8)
            logger.info(f"Updated mgt8 with ID: {mgt8_id}")
            return mgt8
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating mgt8 {mgt8_id}: {str(e)}")
            raise

    async def delete_mgt8(self, mgt8_id: int, user_id: int) -> bool:
        """Soft delete a mgt8 record"""
        try:
            mgt8 = self.get_mgt8(mgt8_id)
            if not mgt8:
                return False

            mgt8.is_active = False
            mgt8.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted mgt8 with ID: {mgt8_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting mgt8 {mgt8_id}: {str(e)}")
            raise

    async def change_status(self, mgt8_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a mgt8"""
        try:
            mgt8 = self.get_mgt8(mgt8_id)
            if not mgt8:
                return False

            mgt8.is_active = status
            mgt8.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of mgt8 {mgt8_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of mgt8 {mgt8_id}: {str(e)}")
            raise