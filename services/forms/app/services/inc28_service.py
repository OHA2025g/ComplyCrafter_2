from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.inc28 import INC28, INC28Create, INC28Update, INC28View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class INC28Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_inc28(self, inc28_data: INC28Create, user_id: int) -> INC28:
        """Create a new inc28 record"""
        try:
            inc28 = INC28(
                **inc28_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(inc28)
            await self.db.commit()
            await self.db.refresh(inc28)
            logger.info(f"Created inc28 with ID: {inc28.id}")
            return inc28
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating inc28: {str(e)}")
            raise

    async def get_inc28(self, inc28_id: int) -> Optional[INC28]:
        """Get a inc28 by ID"""
        try:
            return self.db.query(INC28).filter(
                and_(INC28.id == inc28_id, INC28.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting inc28 {inc28_id}: {str(e)}")
            raise

    async def get_inc28s(self, skip: int = 0, limit: int = 100) -> List[INC28]:
        """Get all active inc28s with pagination"""
        try:
            return list((await self.db.execute(select(INC28).where(
                INC28.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting inc28s: {str(e)}")
            raise

    async def get_inc28s_by_company(self, company_id: int) -> List[INC28]:
        """Get all inc28s for a specific company"""
        try:
            return self.db.query(INC28).filter(
                and_(
                    INC28.company_id == company_id,
                    INC28.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting inc28s for company {company_id}: {str(e)}")
            raise

    async def update_inc28(self, inc28_id: int, inc28_data: INC28Update, user_id: int) -> Optional[INC28]:
        """Update a inc28 record"""
        try:
            inc28 = self.get_inc28(inc28_id)
            if not inc28:
                return None

            update_data = inc28_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(inc28, field, value)
            
            inc28.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(inc28)
            logger.info(f"Updated inc28 with ID: {inc28_id}")
            return inc28
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating inc28 {inc28_id}: {str(e)}")
            raise

    async def delete_inc28(self, inc28_id: int, user_id: int) -> bool:
        """Soft delete a inc28 record"""
        try:
            inc28 = self.get_inc28(inc28_id)
            if not inc28:
                return False

            inc28.is_active = False
            inc28.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted inc28 with ID: {inc28_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting inc28 {inc28_id}: {str(e)}")
            raise

    async def change_status(self, inc28_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a inc28"""
        try:
            inc28 = self.get_inc28(inc28_id)
            if not inc28:
                return False

            inc28.is_active = status
            inc28.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of inc28 {inc28_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of inc28 {inc28_id}: {str(e)}")
            raise