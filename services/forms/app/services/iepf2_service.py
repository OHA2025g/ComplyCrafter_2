from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.iepf2 import IEPF2, IEPF2Create, IEPF2Update, IEPF2View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class IEPF2Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_iepf2(self, iepf2_data: IEPF2Create, user_id: int) -> IEPF2:
        """Create a new iepf2 record"""
        try:
            iepf2 = IEPF2(
                **iepf2_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(iepf2)
            await self.db.commit()
            await self.db.refresh(iepf2)
            logger.info(f"Created iepf2 with ID: {iepf2.id}")
            return iepf2
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating iepf2: {str(e)}")
            raise

    async def get_iepf2(self, iepf2_id: int) -> Optional[IEPF2]:
        """Get a iepf2 by ID"""
        try:
            return self.db.query(IEPF2).filter(
                and_(IEPF2.id == iepf2_id, IEPF2.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting iepf2 {iepf2_id}: {str(e)}")
            raise

    async def get_iepf2s(self, skip: int = 0, limit: int = 100) -> List[IEPF2]:
        """Get all active iepf2s with pagination"""
        try:
            return list((await self.db.execute(select(IEPF2).where(
                IEPF2.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting iepf2s: {str(e)}")
            raise

    async def get_iepf2s_by_company(self, company_id: int) -> List[IEPF2]:
        """Get all iepf2s for a specific company"""
        try:
            return self.db.query(IEPF2).filter(
                and_(
                    IEPF2.company_id == company_id,
                    IEPF2.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting iepf2s for company {company_id}: {str(e)}")
            raise

    async def update_iepf2(self, iepf2_id: int, iepf2_data: IEPF2Update, user_id: int) -> Optional[IEPF2]:
        """Update a iepf2 record"""
        try:
            iepf2 = self.get_iepf2(iepf2_id)
            if not iepf2:
                return None

            update_data = iepf2_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(iepf2, field, value)
            
            iepf2.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(iepf2)
            logger.info(f"Updated iepf2 with ID: {iepf2_id}")
            return iepf2
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating iepf2 {iepf2_id}: {str(e)}")
            raise

    async def delete_iepf2(self, iepf2_id: int, user_id: int) -> bool:
        """Soft delete a iepf2 record"""
        try:
            iepf2 = self.get_iepf2(iepf2_id)
            if not iepf2:
                return False

            iepf2.is_active = False
            iepf2.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted iepf2 with ID: {iepf2_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting iepf2 {iepf2_id}: {str(e)}")
            raise

    async def change_status(self, iepf2_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a iepf2"""
        try:
            iepf2 = self.get_iepf2(iepf2_id)
            if not iepf2:
                return False

            iepf2.is_active = status
            iepf2.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of iepf2 {iepf2_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of iepf2 {iepf2_id}: {str(e)}")
            raise