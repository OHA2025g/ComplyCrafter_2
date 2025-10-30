from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.mgt6 import MGT6, MGT6Create, MGT6Update, MGT6View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class MGT6Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_mgt6(self, mgt6_data: MGT6Create, user_id: int) -> MGT6:
        """Create a new mgt6 record"""
        try:
            mgt6 = MGT6(
                **mgt6_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(mgt6)
            await self.db.commit()
            await self.db.refresh(mgt6)
            logger.info(f"Created mgt6 with ID: {mgt6.id}")
            return mgt6
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating mgt6: {str(e)}")
            raise

    async def get_mgt6(self, mgt6_id: int) -> Optional[MGT6]:
        """Get a mgt6 by ID"""
        try:
            return self.db.query(MGT6).filter(
                and_(MGT6.id == mgt6_id, MGT6.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting mgt6 {mgt6_id}: {str(e)}")
            raise

    async def get_mgt6s(self, skip: int = 0, limit: int = 100) -> List[MGT6]:
        """Get all active mgt6s with pagination"""
        try:
            return list((await self.db.execute(select(MGT6).where(
                MGT6.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting mgt6s: {str(e)}")
            raise

    async def get_mgt6s_by_company(self, company_id: int) -> List[MGT6]:
        """Get all mgt6s for a specific company"""
        try:
            return self.db.query(MGT6).filter(
                and_(
                    MGT6.company_id == company_id,
                    MGT6.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting mgt6s for company {company_id}: {str(e)}")
            raise

    async def update_mgt6(self, mgt6_id: int, mgt6_data: MGT6Update, user_id: int) -> Optional[MGT6]:
        """Update a mgt6 record"""
        try:
            mgt6 = self.get_mgt6(mgt6_id)
            if not mgt6:
                return None

            update_data = mgt6_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(mgt6, field, value)
            
            mgt6.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(mgt6)
            logger.info(f"Updated mgt6 with ID: {mgt6_id}")
            return mgt6
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating mgt6 {mgt6_id}: {str(e)}")
            raise

    async def delete_mgt6(self, mgt6_id: int, user_id: int) -> bool:
        """Soft delete a mgt6 record"""
        try:
            mgt6 = self.get_mgt6(mgt6_id)
            if not mgt6:
                return False

            mgt6.is_active = False
            mgt6.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted mgt6 with ID: {mgt6_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting mgt6 {mgt6_id}: {str(e)}")
            raise

    async def change_status(self, mgt6_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a mgt6"""
        try:
            mgt6 = self.get_mgt6(mgt6_id)
            if not mgt6:
                return False

            mgt6.is_active = status
            mgt6.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of mgt6 {mgt6_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of mgt6 {mgt6_id}: {str(e)}")
            raise