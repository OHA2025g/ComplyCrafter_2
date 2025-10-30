from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.gnl2 import GNL2, GNL2Create, GNL2Update, GNL2View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class GNL2Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_gnl2(self, gnl2_data: GNL2Create, user_id: int) -> GNL2:
        """Create a new gnl2 record"""
        try:
            gnl2 = GNL2(
                **gnl2_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(gnl2)
            await self.db.commit()
            await self.db.refresh(gnl2)
            logger.info(f"Created gnl2 with ID: {gnl2.id}")
            return gnl2
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating gnl2: {str(e)}")
            raise

    async def get_gnl2(self, gnl2_id: int) -> Optional[GNL2]:
        """Get a gnl2 by ID"""
        try:
            return self.db.query(GNL2).filter(
                and_(GNL2.id == gnl2_id, GNL2.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting gnl2 {gnl2_id}: {str(e)}")
            raise

    async def get_gnl2s(self, skip: int = 0, limit: int = 100) -> List[GNL2]:
        """Get all active gnl2s with pagination"""
        try:
            return list((await self.db.execute(select(GNL2).where(
                GNL2.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting gnl2s: {str(e)}")
            raise

    async def get_gnl2s_by_company(self, company_id: int) -> List[GNL2]:
        """Get all gnl2s for a specific company"""
        try:
            return self.db.query(GNL2).filter(
                and_(
                    GNL2.company_id == company_id,
                    GNL2.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting gnl2s for company {company_id}: {str(e)}")
            raise

    async def update_gnl2(self, gnl2_id: int, gnl2_data: GNL2Update, user_id: int) -> Optional[GNL2]:
        """Update a gnl2 record"""
        try:
            gnl2 = self.get_gnl2(gnl2_id)
            if not gnl2:
                return None

            update_data = gnl2_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(gnl2, field, value)
            
            gnl2.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(gnl2)
            logger.info(f"Updated gnl2 with ID: {gnl2_id}")
            return gnl2
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating gnl2 {gnl2_id}: {str(e)}")
            raise

    async def delete_gnl2(self, gnl2_id: int, user_id: int) -> bool:
        """Soft delete a gnl2 record"""
        try:
            gnl2 = self.get_gnl2(gnl2_id)
            if not gnl2:
                return False

            gnl2.is_active = False
            gnl2.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted gnl2 with ID: {gnl2_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting gnl2 {gnl2_id}: {str(e)}")
            raise

    async def change_status(self, gnl2_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a gnl2"""
        try:
            gnl2 = self.get_gnl2(gnl2_id)
            if not gnl2:
                return False

            gnl2.is_active = status
            gnl2.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of gnl2 {gnl2_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of gnl2 {gnl2_id}: {str(e)}")
            raise