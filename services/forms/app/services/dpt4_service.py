from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.dpt4 import DPT4, DPT4Create, DPT4Update, DPT4View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class DPT4Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_dpt4(self, dpt4_data: DPT4Create, user_id: int) -> DPT4:
        """Create a new dpt4 record"""
        try:
            dpt4 = DPT4(
                **dpt4_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(dpt4)
            await self.db.commit()
            await self.db.refresh(dpt4)
            logger.info(f"Created dpt4 with ID: {dpt4.id}")
            return dpt4
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating dpt4: {str(e)}")
            raise

    async def get_dpt4(self, dpt4_id: int) -> Optional[DPT4]:
        """Get a dpt4 by ID"""
        try:
            return self.db.query(DPT4).filter(
                and_(DPT4.id == dpt4_id, DPT4.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting dpt4 {dpt4_id}: {str(e)}")
            raise

    async def get_dpt4s(self, skip: int = 0, limit: int = 100) -> List[DPT4]:
        """Get all active dpt4s with pagination"""
        try:
            return list((await self.db.execute(select(DPT4).where(
                DPT4.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting dpt4s: {str(e)}")
            raise

    async def get_dpt4s_by_company(self, company_id: int) -> List[DPT4]:
        """Get all dpt4s for a specific company"""
        try:
            return self.db.query(DPT4).filter(
                and_(
                    DPT4.company_id == company_id,
                    DPT4.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting dpt4s for company {company_id}: {str(e)}")
            raise

    async def update_dpt4(self, dpt4_id: int, dpt4_data: DPT4Update, user_id: int) -> Optional[DPT4]:
        """Update a dpt4 record"""
        try:
            dpt4 = self.get_dpt4(dpt4_id)
            if not dpt4:
                return None

            update_data = dpt4_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(dpt4, field, value)
            
            dpt4.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(dpt4)
            logger.info(f"Updated dpt4 with ID: {dpt4_id}")
            return dpt4
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating dpt4 {dpt4_id}: {str(e)}")
            raise

    async def delete_dpt4(self, dpt4_id: int, user_id: int) -> bool:
        """Soft delete a dpt4 record"""
        try:
            dpt4 = self.get_dpt4(dpt4_id)
            if not dpt4:
                return False

            dpt4.is_active = False
            dpt4.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted dpt4 with ID: {dpt4_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting dpt4 {dpt4_id}: {str(e)}")
            raise

    async def change_status(self, dpt4_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a dpt4"""
        try:
            dpt4 = self.get_dpt4(dpt4_id)
            if not dpt4:
                return False

            dpt4.is_active = status
            dpt4.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of dpt4 {dpt4_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of dpt4 {dpt4_id}: {str(e)}")
            raise