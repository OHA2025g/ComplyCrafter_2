from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.sh9 import SH9, SH9Create, SH9Update, SH9View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class SH9Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_sh9(self, sh9_data: SH9Create, user_id: int) -> SH9:
        """Create a new sh9 record"""
        try:
            sh9 = SH9(
                **sh9_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(sh9)
            await self.db.commit()
            await self.db.refresh(sh9)
            logger.info(f"Created sh9 with ID: {sh9.id}")
            return sh9
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating sh9: {str(e)}")
            raise

    async def get_sh9(self, sh9_id: int) -> Optional[SH9]:
        """Get a sh9 by ID"""
        try:
            return self.db.query(SH9).filter(
                and_(SH9.id == sh9_id, SH9.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting sh9 {sh9_id}: {str(e)}")
            raise

    async def get_sh9s(self, skip: int = 0, limit: int = 100) -> List[SH9]:
        """Get all active sh9s with pagination"""
        try:
            return list((await self.db.execute(select(SH9).where(
                SH9.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting sh9s: {str(e)}")
            raise

    async def get_sh9s_by_company(self, company_id: int) -> List[SH9]:
        """Get all sh9s for a specific company"""
        try:
            return self.db.query(SH9).filter(
                and_(
                    SH9.company_id == company_id,
                    SH9.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting sh9s for company {company_id}: {str(e)}")
            raise

    async def update_sh9(self, sh9_id: int, sh9_data: SH9Update, user_id: int) -> Optional[SH9]:
        """Update a sh9 record"""
        try:
            sh9 = self.get_sh9(sh9_id)
            if not sh9:
                return None

            update_data = sh9_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(sh9, field, value)
            
            sh9.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(sh9)
            logger.info(f"Updated sh9 with ID: {sh9_id}")
            return sh9
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating sh9 {sh9_id}: {str(e)}")
            raise

    async def delete_sh9(self, sh9_id: int, user_id: int) -> bool:
        """Soft delete a sh9 record"""
        try:
            sh9 = self.get_sh9(sh9_id)
            if not sh9:
                return False

            sh9.is_active = False
            sh9.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted sh9 with ID: {sh9_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting sh9 {sh9_id}: {str(e)}")
            raise

    async def change_status(self, sh9_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a sh9"""
        try:
            sh9 = self.get_sh9(sh9_id)
            if not sh9:
                return False

            sh9.is_active = status
            sh9.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of sh9 {sh9_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of sh9 {sh9_id}: {str(e)}")
            raise