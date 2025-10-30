from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.chg4 import CHG4, CHG4Create, CHG4Update, CHG4View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class CHG4Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_chg4(self, chg4_data: CHG4Create, user_id: int) -> CHG4:
        """Create a new chg4 record"""
        try:
            chg4 = CHG4(
                **chg4_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(chg4)
            await self.db.commit()
            await self.db.refresh(chg4)
            logger.info(f"Created chg4 with ID: {chg4.id}")
            return chg4
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating chg4: {str(e)}")
            raise

    async def get_chg4(self, chg4_id: int) -> Optional[CHG4]:
        """Get a chg4 by ID"""
        try:
            return self.db.query(CHG4).filter(
                and_(CHG4.id == chg4_id, CHG4.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting chg4 {chg4_id}: {str(e)}")
            raise

    async def get_chg4s(self, skip: int = 0, limit: int = 100) -> List[CHG4]:
        """Get all active chg4s with pagination"""
        try:
            return list((await self.db.execute(select(CHG4).where(
                CHG4.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting chg4s: {str(e)}")
            raise

    async def get_chg4s_by_company(self, company_id: int) -> List[CHG4]:
        """Get all chg4s for a specific company"""
        try:
            return self.db.query(CHG4).filter(
                and_(
                    CHG4.company_id == company_id,
                    CHG4.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting chg4s for company {company_id}: {str(e)}")
            raise

    async def update_chg4(self, chg4_id: int, chg4_data: CHG4Update, user_id: int) -> Optional[CHG4]:
        """Update a chg4 record"""
        try:
            chg4 = self.get_chg4(chg4_id)
            if not chg4:
                return None

            update_data = chg4_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(chg4, field, value)
            
            chg4.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(chg4)
            logger.info(f"Updated chg4 with ID: {chg4_id}")
            return chg4
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating chg4 {chg4_id}: {str(e)}")
            raise

    async def delete_chg4(self, chg4_id: int, user_id: int) -> bool:
        """Soft delete a chg4 record"""
        try:
            chg4 = self.get_chg4(chg4_id)
            if not chg4:
                return False

            chg4.is_active = False
            chg4.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted chg4 with ID: {chg4_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting chg4 {chg4_id}: {str(e)}")
            raise

    async def change_status(self, chg4_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a chg4"""
        try:
            chg4 = self.get_chg4(chg4_id)
            if not chg4:
                return False

            chg4.is_active = status
            chg4.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of chg4 {chg4_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of chg4 {chg4_id}: {str(e)}")
            raise