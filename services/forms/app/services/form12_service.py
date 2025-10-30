from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime
from ..models.form12 import Form12, Form12Create, Form12Update, Form12View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class Form12Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_form12(self, form12_data: Form12Create, user_id: int) -> Form12:
        """Create a new form12 record"""
        try:
            form12 = Form12(
                **form12_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(form12)
            await self.db.commit()
            await self.db.refresh(form12)
            logger.info(f"Created form12 with ID: {form12.id}")
            return form12
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating form12: {str(e)}")
            raise

    async def get_form12(self, form12_id: int) -> Optional[Form12]:
        """Get a form12 by ID"""
        try:
            result = await self.db.execute(
                select(Form12).where(
                    and_(Form12.id == form12_id, Form12.is_active == True)
                )
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error getting form12 {form12_id}: {str(e)}")
            raise

    async def get_form12s(self, skip: int = 0, limit: int = 100) -> List[Form12]:
        """Get all active form12s with pagination"""
        try:
            result = await self.db.execute(
                select(Form12).where(Form12.is_active == True).offset(skip).limit(limit)
            )
            return list(result.scalars().all())
        except Exception as e:
            logger.error(f"Error getting form12s: {str(e)}")
            raise

    async def get_form12s_by_company(self, company_id: int) -> List[Form12]:
        """Get all form12s for a specific company"""
        try:
            result = await self.db.execute(
                select(Form12).where(
                    and_(
                        Form12.company_id == company_id,
                        Form12.is_active == True
                    )
                )
            )
            return list(result.scalars().all())
        except Exception as e:
            logger.error(f"Error getting form12s for company {company_id}: {str(e)}")
            raise

    async def update_form12(self, form12_id: int, form12_data: Form12Update, user_id: int) -> Optional[Form12]:
        """Update a form12 record"""
        try:
            form12 = await self.get_form12(form12_id)
            if not form12:
                return None

            update_data = form12_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(form12, field, value)
            
            form12.updated_by = user_id
            form12.updated_on = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(form12)
            logger.info(f"Updated form12 with ID: {form12_id}")
            return form12
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating form12 {form12_id}: {str(e)}")
            raise

    async def delete_form12(self, form12_id: int, user_id: int) -> bool:
        """Soft delete a form12 record"""
        try:
            form12 = await self.get_form12(form12_id)
            if not form12:
                return False

            form12.is_active = False
            form12.updated_by = user_id
            form12.updated_on = datetime.utcnow()
            await self.db.commit()
            logger.info(f"Soft deleted form12 with ID: {form12_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting form12 {form12_id}: {str(e)}")
            raise

    async def change_status(self, form12_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a form12"""
        try:
            result = await self.db.execute(
                select(Form12).where(Form12.id == form12_id)
            )
            form12 = result.scalar_one_or_none()
            if not form12:
                return False

            form12.is_active = status
            form12.updated_by = user_id
            form12.updated_on = datetime.utcnow()
            await self.db.commit()
            logger.info(f"Changed status of form12 {form12_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of form12 {form12_id}: {str(e)}")
            raise
