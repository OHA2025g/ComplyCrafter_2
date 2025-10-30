from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.mr1 import MR1, MR1Create, MR1Update, MR1View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class MR1Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_mr1(self, mr1_data: MR1Create, user_id: int) -> MR1:
        """Create a new mr1 record"""
        try:
            mr1 = MR1(
                **mr1_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(mr1)
            await self.db.commit()
            await self.db.refresh(mr1)
            logger.info(f"Created mr1 with ID: {mr1.id}")
            return mr1
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating mr1: {str(e)}")
            raise

    async def get_mr1(self, mr1_id: int) -> Optional[MR1]:
        """Get a mr1 by ID"""
        try:
            return self.db.query(MR1).filter(
                and_(MR1.id == mr1_id, MR1.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting mr1 {mr1_id}: {str(e)}")
            raise

    async def get_mr1s(self, skip: int = 0, limit: int = 100) -> List[MR1]:
        """Get all active mr1s with pagination"""
        try:
            return list((await self.db.execute(select(MR1).where(
                MR1.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting mr1s: {str(e)}")
            raise

    async def get_mr1s_by_company(self, company_id: int) -> List[MR1]:
        """Get all mr1s for a specific company"""
        try:
            return self.db.query(MR1).filter(
                and_(
                    MR1.company_id == company_id,
                    MR1.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting mr1s for company {company_id}: {str(e)}")
            raise

    async def update_mr1(self, mr1_id: int, mr1_data: MR1Update, user_id: int) -> Optional[MR1]:
        """Update a mr1 record"""
        try:
            mr1 = self.get_mr1(mr1_id)
            if not mr1:
                return None

            update_data = mr1_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(mr1, field, value)
            
            mr1.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(mr1)
            logger.info(f"Updated mr1 with ID: {mr1_id}")
            return mr1
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating mr1 {mr1_id}: {str(e)}")
            raise

    async def delete_mr1(self, mr1_id: int, user_id: int) -> bool:
        """Soft delete a mr1 record"""
        try:
            mr1 = self.get_mr1(mr1_id)
            if not mr1:
                return False

            mr1.is_active = False
            mr1.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted mr1 with ID: {mr1_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting mr1 {mr1_id}: {str(e)}")
            raise

    async def change_status(self, mr1_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a mr1"""
        try:
            mr1 = self.get_mr1(mr1_id)
            if not mr1:
                return False

            mr1.is_active = status
            mr1.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of mr1 {mr1_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of mr1 {mr1_id}: {str(e)}")
            raise