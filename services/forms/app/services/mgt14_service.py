from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.mgt14 import MGT14, MGT14Create, MGT14Update, MGT14View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class MGT14Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_mgt14(self, mgt14_data: MGT14Create, user_id: int) -> MGT14:
        """Create a new mgt14 record"""
        try:
            mgt14 = MGT14(
                **mgt14_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(mgt14)
            await self.db.commit()
            await self.db.refresh(mgt14)
            logger.info(f"Created mgt14 with ID: {mgt14.id}")
            return mgt14
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating mgt14: {str(e)}")
            raise

    async def get_mgt14(self, mgt14_id: int) -> Optional[MGT14]:
        """Get a mgt14 by ID"""
        try:
            return self.db.query(MGT14).filter(
                and_(MGT14.id == mgt14_id, MGT14.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting mgt14 {mgt14_id}: {str(e)}")
            raise

    async def get_mgt14s(self, skip: int = 0, limit: int = 100) -> List[MGT14]:
        """Get all active mgt14s with pagination"""
        try:
            return list((await self.db.execute(select(MGT14).where(
                MGT14.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting mgt14s: {str(e)}")
            raise

    async def get_mgt14s_by_company(self, company_id: int) -> List[MGT14]:
        """Get all mgt14s for a specific company"""
        try:
            return self.db.query(MGT14).filter(
                and_(
                    MGT14.company_id == company_id,
                    MGT14.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting mgt14s for company {company_id}: {str(e)}")
            raise

    async def update_mgt14(self, mgt14_id: int, mgt14_data: MGT14Update, user_id: int) -> Optional[MGT14]:
        """Update a mgt14 record"""
        try:
            mgt14 = self.get_mgt14(mgt14_id)
            if not mgt14:
                return None

            update_data = mgt14_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(mgt14, field, value)
            
            mgt14.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(mgt14)
            logger.info(f"Updated mgt14 with ID: {mgt14_id}")
            return mgt14
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating mgt14 {mgt14_id}: {str(e)}")
            raise

    async def delete_mgt14(self, mgt14_id: int, user_id: int) -> bool:
        """Soft delete a mgt14 record"""
        try:
            mgt14 = self.get_mgt14(mgt14_id)
            if not mgt14:
                return False

            mgt14.is_active = False
            mgt14.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted mgt14 with ID: {mgt14_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting mgt14 {mgt14_id}: {str(e)}")
            raise

    async def change_status(self, mgt14_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a mgt14"""
        try:
            mgt14 = self.get_mgt14(mgt14_id)
            if not mgt14:
                return False

            mgt14.is_active = status
            mgt14.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of mgt14 {mgt14_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of mgt14 {mgt14_id}: {str(e)}")
            raise