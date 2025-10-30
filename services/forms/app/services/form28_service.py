from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime
from ..models.form28 import Form28, Form28Create, Form28Update, Form28View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class Form28Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_form28(self, form28_data: Form28Create, user_id: int) -> Form28:
        """Create a new form28 record"""
        try:
            form28 = Form28(
                **form28_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(form28)
            await self.db.commit()
            await self.db.refresh(form28)
            logger.info(f"Created form28 with ID: {form28.id}")
            return form28
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating form28: {str(e)}")
            raise

    async def get_form28(self, form28_id: int) -> Optional[Form28]:
        """Get a form28 by ID"""
        try:
            result = await self.db.execute(
                select(Form28).where(
                    and_(Form28.id == form28_id, Form28.is_active == True)
                )
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error getting form28 {form28_id}: {str(e)}")
            raise

    async def get_form28s(self, skip: int = 0, limit: int = 100) -> List[Form28]:
        """Get all active form28s with pagination"""
        try:
            result = await self.db.execute(
                select(Form28).where(Form28.is_active == True).offset(skip).limit(limit)
            )
            return list(result.scalars().all())
        except Exception as e:
            logger.error(f"Error getting form28s: {str(e)}")
            raise

    async def get_form28s_by_company(self, company_id: int) -> List[Form28]:
        """Get all form28s for a specific company"""
        try:
            result = await self.db.execute(
                select(Form28).where(
                    and_(
                        Form28.company_id == company_id,
                        Form28.is_active == True
                    )
                )
            )
            return list(result.scalars().all())
        except Exception as e:
            logger.error(f"Error getting form28s for company {company_id}: {str(e)}")
            raise

    async def update_form28(self, form28_id: int, form28_data: Form28Update, user_id: int) -> Optional[Form28]:
        """Update a form28 record"""
        try:
            form28 = await self.get_form28(form28_id)
            if not form28:
                return None

            update_data = form28_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(form28, field, value)
            
            form28.updated_by = user_id
            form28.updated_on = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(form28)
            logger.info(f"Updated form28 with ID: {form28_id}")
            return form28
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating form28 {form28_id}: {str(e)}")
            raise

    async def delete_form28(self, form28_id: int, user_id: int) -> bool:
        """Soft delete a form28 record"""
        try:
            form28 = await self.get_form28(form28_id)
            if not form28:
                return False

            form28.is_active = False
            form28.updated_by = user_id
            form28.updated_on = datetime.utcnow()
            await self.db.commit()
            logger.info(f"Soft deleted form28 with ID: {form28_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting form28 {form28_id}: {str(e)}")
            raise

    async def change_status(self, form28_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a form28"""
        try:
            result = await self.db.execute(
                select(Form28).where(Form28.id == form28_id)
            )
            form28 = result.scalar_one_or_none()
            if not form28:
                return False

            form28.is_active = status
            form28.updated_by = user_id
            form28.updated_on = datetime.utcnow()
            await self.db.commit()
            logger.info(f"Changed status of form28 {form28_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of form28 {form28_id}: {str(e)}")
            raise
