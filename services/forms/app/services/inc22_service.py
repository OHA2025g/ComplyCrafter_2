from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.inc22 import INC22, INC22Create, INC22Update, INC22View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class INC22Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_inc22(self, inc22_data: INC22Create, user_id: int) -> INC22:
        """Create a new inc22 record"""
        try:
            inc22 = INC22(
                **inc22_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(inc22)
            await self.db.commit()
            await self.db.refresh(inc22)
            logger.info(f"Created inc22 with ID: {inc22.id}")
            return inc22
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating inc22: {str(e)}")
            raise

    async def get_inc22(self, inc22_id: int) -> Optional[INC22]:
        """Get a inc22 by ID"""
        try:
            return self.db.query(INC22).filter(
                and_(INC22.id == inc22_id, INC22.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting inc22 {inc22_id}: {str(e)}")
            raise

    async def get_inc22s(self, skip: int = 0, limit: int = 100) -> List[INC22]:
        """Get all active inc22s with pagination"""
        try:
            return list((await self.db.execute(select(INC22).where(
                INC22.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting inc22s: {str(e)}")
            raise

    async def get_inc22s_by_company(self, company_id: int) -> List[INC22]:
        """Get all inc22s for a specific company"""
        try:
            return self.db.query(INC22).filter(
                and_(
                    INC22.company_id == company_id,
                    INC22.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting inc22s for company {company_id}: {str(e)}")
            raise

    async def update_inc22(self, inc22_id: int, inc22_data: INC22Update, user_id: int) -> Optional[INC22]:
        """Update a inc22 record"""
        try:
            inc22 = self.get_inc22(inc22_id)
            if not inc22:
                return None

            update_data = inc22_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(inc22, field, value)
            
            inc22.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(inc22)
            logger.info(f"Updated inc22 with ID: {inc22_id}")
            return inc22
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating inc22 {inc22_id}: {str(e)}")
            raise

    async def delete_inc22(self, inc22_id: int, user_id: int) -> bool:
        """Soft delete a inc22 record"""
        try:
            inc22 = self.get_inc22(inc22_id)
            if not inc22:
                return False

            inc22.is_active = False
            inc22.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted inc22 with ID: {inc22_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting inc22 {inc22_id}: {str(e)}")
            raise

    async def change_status(self, inc22_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a inc22"""
        try:
            inc22 = self.get_inc22(inc22_id)
            if not inc22:
                return False

            inc22.is_active = status
            inc22.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of inc22 {inc22_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of inc22 {inc22_id}: {str(e)}")
            raise