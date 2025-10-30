from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.chg9 import CHG9, CHG9Create, CHG9Update, CHG9View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class CHG9Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_chg9(self, chg9_data: CHG9Create, user_id: int) -> CHG9:
        """Create a new chg9 record"""
        try:
            chg9 = CHG9(
                **chg9_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(chg9)
            await self.db.commit()
            await self.db.refresh(chg9)
            logger.info(f"Created chg9 with ID: {chg9.id}")
            return chg9
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating chg9: {str(e)}")
            raise

    async def get_chg9(self, chg9_id: int) -> Optional[CHG9]:
        """Get a chg9 by ID"""
        try:
            return self.db.query(CHG9).filter(
                and_(CHG9.id == chg9_id, CHG9.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting chg9 {chg9_id}: {str(e)}")
            raise

    async def get_chg9s(self, skip: int = 0, limit: int = 100) -> List[CHG9]:
        """Get all active chg9s with pagination"""
        try:
            return list((await self.db.execute(select(CHG9).where(
                CHG9.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting chg9s: {str(e)}")
            raise

    async def get_chg9s_by_company(self, company_id: int) -> List[CHG9]:
        """Get all chg9s for a specific company"""
        try:
            return self.db.query(CHG9).filter(
                and_(
                    CHG9.company_id == company_id,
                    CHG9.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting chg9s for company {company_id}: {str(e)}")
            raise

    async def update_chg9(self, chg9_id: int, chg9_data: CHG9Update, user_id: int) -> Optional[CHG9]:
        """Update a chg9 record"""
        try:
            chg9 = self.get_chg9(chg9_id)
            if not chg9:
                return None

            update_data = chg9_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(chg9, field, value)
            
            chg9.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(chg9)
            logger.info(f"Updated chg9 with ID: {chg9_id}")
            return chg9
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating chg9 {chg9_id}: {str(e)}")
            raise

    async def delete_chg9(self, chg9_id: int, user_id: int) -> bool:
        """Soft delete a chg9 record"""
        try:
            chg9 = self.get_chg9(chg9_id)
            if not chg9:
                return False

            chg9.is_active = False
            chg9.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted chg9 with ID: {chg9_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting chg9 {chg9_id}: {str(e)}")
            raise

    async def change_status(self, chg9_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a chg9"""
        try:
            chg9 = self.get_chg9(chg9_id)
            if not chg9:
                return False

            chg9.is_active = status
            chg9.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of chg9 {chg9_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of chg9 {chg9_id}: {str(e)}")
            raise