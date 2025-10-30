from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from ..models.gnl1 import GNL1, GNL1Create, GNL1Update, GNL1View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class GNL1Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_gnl1(self, gnl1_data: GNL1Create, user_id: int) -> GNL1:
        """Create a new gnl1 record"""
        try:
            gnl1 = GNL1(
                **gnl1_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(gnl1)
            await self.db.commit()
            await self.db.refresh(gnl1)
            logger.info(f"Created gnl1 with ID: {gnl1.id}")
            return gnl1
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating gnl1: {str(e)}")
            raise

    async def get_gnl1(self, gnl1_id: int) -> Optional[GNL1]:
        """Get a gnl1 by ID"""
        try:
            return self.db.query(GNL1).filter(
                and_(GNL1.id == gnl1_id, GNL1.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting gnl1 {gnl1_id}: {str(e)}")
            raise

    async def get_gnl1s(self, skip: int = 0, limit: int = 100) -> List[GNL1]:
        """Get all active gnl1s with pagination"""
        try:
            return list((await self.db.execute(select(GNL1).where(
                GNL1.is_active == True
            ).offset(skip).limit(limit))).scalars().all())
        except Exception as e:
            logger.error(f"Error getting gnl1s: {str(e)}")
            raise

    async def get_gnl1s_by_company(self, company_id: int) -> List[GNL1]:
        """Get all gnl1s for a specific company"""
        try:
            return self.db.query(GNL1).filter(
                and_(
                    GNL1.company_id == company_id,
                    GNL1.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting gnl1s for company {company_id}: {str(e)}")
            raise

    async def update_gnl1(self, gnl1_id: int, gnl1_data: GNL1Update, user_id: int) -> Optional[GNL1]:
        """Update a gnl1 record"""
        try:
            gnl1 = self.get_gnl1(gnl1_id)
            if not gnl1:
                return None

            update_data = gnl1_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(gnl1, field, value)
            
            gnl1.updated_by = user_id
            await self.db.commit()
            await self.db.refresh(gnl1)
            logger.info(f"Updated gnl1 with ID: {gnl1_id}")
            return gnl1
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating gnl1 {gnl1_id}: {str(e)}")
            raise

    async def delete_gnl1(self, gnl1_id: int, user_id: int) -> bool:
        """Soft delete a gnl1 record"""
        try:
            gnl1 = self.get_gnl1(gnl1_id)
            if not gnl1:
                return False

            gnl1.is_active = False
            gnl1.updated_by = user_id
            await self.db.commit()
            logger.info(f"Soft deleted gnl1 with ID: {gnl1_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting gnl1 {gnl1_id}: {str(e)}")
            raise

    async def change_status(self, gnl1_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a gnl1"""
        try:
            gnl1 = self.get_gnl1(gnl1_id)
            if not gnl1:
                return False

            gnl1.is_active = status
            gnl1.updated_by = user_id
            await self.db.commit()
            logger.info(f"Changed status of gnl1 {gnl1_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of gnl1 {gnl1_id}: {str(e)}")
            raise