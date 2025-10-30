from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.chg8 import CHG8, CHG8Create, CHG8Update, CHG8View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class CHG8Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_chg8(self, chg8_data: CHG8Create, user_id: int) -> CHG8:
        """Create a new chg8 record"""
        try:
            chg8 = CHG8(
                **chg8_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(chg8)
            await self.db.commit()
            await self.db.refresh(chg8)
            logger.info(f"Created chg8 with ID: {chg8.id}")
            return chg8
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating chg8: {str(e)}")
            raise

    async def get_chg8(self, chg8_id: int) -> Optional[CHG8]:
        """Get a chg8 by ID"""
        try:
            return self.db.query(CHG8).filter(
                and_(CHG8.id == chg8_id, CHG8.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting chg8 {chg8_id}: {str(e)}")
            raise

    async def get_chg8s(self, skip: int = 0, limit: int = 100) -> List[CHG8]:
        """Get all active chg8s with pagination"""
        try:
            return list((await self.db.execute(select(CHG8).where(
                CHG8.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting chg8s: {str(e)}")
            raise

    async def get_chg8s_by_company(self, company_id: int) -> List[CHG8]:
        """Get all chg8s for a specific company"""
        try:
            return self.db.query(CHG8).filter(
                and_(
                    CHG8.company_id == company_id,
                    CHG8.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting chg8s for company {company_id}: {str(e)}")
            raise

    async def update_chg8(self, chg8_id: int, chg8_data: CHG8Update, user_id: int) -> Optional[CHG8]:
        """Update a chg8 record"""
        try:
            chg8 = self.get_chg8(chg8_id)
            if not chg8:
                return None

            update_data = chg8_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(chg8, field, value)
            
            chg8.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(chg8)
            logger.info(f"Updated chg8 with ID: {chg8_id}")
            return chg8
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating chg8 {chg8_id}: {str(e)}")
            raise

    async def delete_chg8(self, chg8_id: int, user_id: int) -> bool:
        """Soft delete a chg8 record"""
        try:
            chg8 = self.get_chg8(chg8_id)
            if not chg8:
                return False

            chg8.is_active = False
            chg8.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted chg8 with ID: {chg8_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting chg8 {chg8_id}: {str(e)}")
            raise

    async def change_status(self, chg8_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a chg8"""
        try:
            chg8 = self.get_chg8(chg8_id)
            if not chg8:
                return False

            chg8.is_active = status
            chg8.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of chg8 {chg8_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of chg8 {chg8_id}: {str(e)}")
            raise