from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.iepf5 import IEPF5, IEPF5Create, IEPF5Update, IEPF5View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class IEPF5Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_iepf5(self, iepf5_data: IEPF5Create, user_id: int) -> IEPF5:
        """Create a new iepf5 record"""
        try:
            iepf5 = IEPF5(
                **iepf5_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(iepf5)
            await self.db.commit()
            await self.db.refresh(iepf5)
            logger.info(f"Created iepf5 with ID: {iepf5.id}")
            return iepf5
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating iepf5: {str(e)}")
            raise

    async def get_iepf5(self, iepf5_id: int) -> Optional[IEPF5]:
        """Get a iepf5 by ID"""
        try:
            return self.db.query(IEPF5).filter(
                and_(IEPF5.id == iepf5_id, IEPF5.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting iepf5 {iepf5_id}: {str(e)}")
            raise

    async def get_iepf5s(self, skip: int = 0, limit: int = 100) -> List[IEPF5]:
        """Get all active iepf5s with pagination"""
        try:
            return list((await self.db.execute(select(IEPF5).where(
                IEPF5.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting iepf5s: {str(e)}")
            raise

    async def get_iepf5s_by_company(self, company_id: int) -> List[IEPF5]:
        """Get all iepf5s for a specific company"""
        try:
            return self.db.query(IEPF5).filter(
                and_(
                    IEPF5.company_id == company_id,
                    IEPF5.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting iepf5s for company {company_id}: {str(e)}")
            raise

    async def update_iepf5(self, iepf5_id: int, iepf5_data: IEPF5Update, user_id: int) -> Optional[IEPF5]:
        """Update a iepf5 record"""
        try:
            iepf5 = self.get_iepf5(iepf5_id)
            if not iepf5:
                return None

            update_data = iepf5_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(iepf5, field, value)
            
            iepf5.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(iepf5)
            logger.info(f"Updated iepf5 with ID: {iepf5_id}")
            return iepf5
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating iepf5 {iepf5_id}: {str(e)}")
            raise

    async def delete_iepf5(self, iepf5_id: int, user_id: int) -> bool:
        """Soft delete a iepf5 record"""
        try:
            iepf5 = self.get_iepf5(iepf5_id)
            if not iepf5:
                return False

            iepf5.is_active = False
            iepf5.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted iepf5 with ID: {iepf5_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting iepf5 {iepf5_id}: {str(e)}")
            raise

    async def change_status(self, iepf5_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a iepf5"""
        try:
            iepf5 = self.get_iepf5(iepf5_id)
            if not iepf5:
                return False

            iepf5.is_active = status
            iepf5.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of iepf5 {iepf5_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of iepf5 {iepf5_id}: {str(e)}")
            raise