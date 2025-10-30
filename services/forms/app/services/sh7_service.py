from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.sh7 import SH7, SH7Create, SH7Update, SH7View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class SH7Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_sh7(self, sh7_data: SH7Create, user_id: int) -> SH7:
        """Create a new sh7 record"""
        try:
            sh7 = SH7(
                **sh7_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(sh7)
            await self.db.commit()
            await self.db.refresh(sh7)
            logger.info(f"Created sh7 with ID: {sh7.id}")
            return sh7
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating sh7: {str(e)}")
            raise

    async def get_sh7(self, sh7_id: int) -> Optional[SH7]:
        """Get a sh7 by ID"""
        try:
            return self.db.query(SH7).filter(
                and_(SH7.id == sh7_id, SH7.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting sh7 {sh7_id}: {str(e)}")
            raise

    async def get_sh7s(self, skip: int = 0, limit: int = 100) -> List[SH7]:
        """Get all active sh7s with pagination"""
        try:
            return list((await self.db.execute(select(SH7).where(
                SH7.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting sh7s: {str(e)}")
            raise

    async def get_sh7s_by_company(self, company_id: int) -> List[SH7]:
        """Get all sh7s for a specific company"""
        try:
            return self.db.query(SH7).filter(
                and_(
                    SH7.company_id == company_id,
                    SH7.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting sh7s for company {company_id}: {str(e)}")
            raise

    async def update_sh7(self, sh7_id: int, sh7_data: SH7Update, user_id: int) -> Optional[SH7]:
        """Update a sh7 record"""
        try:
            sh7 = self.get_sh7(sh7_id)
            if not sh7:
                return None

            update_data = sh7_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(sh7, field, value)
            
            sh7.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(sh7)
            logger.info(f"Updated sh7 with ID: {sh7_id}")
            return sh7
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating sh7 {sh7_id}: {str(e)}")
            raise

    async def delete_sh7(self, sh7_id: int, user_id: int) -> bool:
        """Soft delete a sh7 record"""
        try:
            sh7 = self.get_sh7(sh7_id)
            if not sh7:
                return False

            sh7.is_active = False
            sh7.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted sh7 with ID: {sh7_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting sh7 {sh7_id}: {str(e)}")
            raise

    async def change_status(self, sh7_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a sh7"""
        try:
            sh7 = self.get_sh7(sh7_id)
            if not sh7:
                return False

            sh7.is_active = status
            sh7.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of sh7 {sh7_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of sh7 {sh7_id}: {str(e)}")
            raise