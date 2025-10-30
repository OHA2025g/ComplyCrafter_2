from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime
from ..models.form5 import Form5, Form5Create, Form5Update, Form5View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class Form5Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_form5(self, form5_data: Form5Create, user_id: int) -> Form5:
        """Create a new form5 record"""
        try:
            form5 = Form5(
                **form5_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(form5)
            await self.db.commit()
            await self.db.refresh(form5)
            logger.info(f"Created form5 with ID: {form5.id}")
            return form5
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating form5: {str(e)}")
            raise

    async def get_form5(self, form5_id: int) -> Optional[Form5]:
        """Get a form5 by ID"""
        try:
            result = await self.db.execute(
                select(Form5).where(
                    and_(Form5.id == form5_id, Form5.is_active == True)
                )
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error getting form5 {form5_id}: {str(e)}")
            raise

    async def get_form5s(self, skip: int = 0, limit: int = 100) -> List[Form5]:
        """Get all active form5s with pagination"""
        try:
            result = await self.db.execute(
                select(Form5).where(Form5.is_active == True).offset(skip).limit(limit)
            )
            return list(result.scalars().all())
        except Exception as e:
            logger.error(f"Error getting form5s: {str(e)}")
            raise

    async def get_form5s_by_company(self, company_id: int) -> List[Form5]:
        """Get all form5s for a specific company"""
        try:
            result = await self.db.execute(
                select(Form5).where(
                    and_(
                        Form5.company_id == company_id,
                        Form5.is_active == True
                    )
                )
            )
            return list(result.scalars().all())
        except Exception as e:
            logger.error(f"Error getting form5s for company {company_id}: {str(e)}")
            raise

    async def update_form5(self, form5_id: int, form5_data: Form5Update, user_id: int) -> Optional[Form5]:
        """Update a form5 record"""
        try:
            form5 = await self.get_form5(form5_id)
            if not form5:
                return None

            update_data = form5_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(form5, field, value)
            
            form5.updated_by = user_id
            form5.updated_on = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(form5)
            logger.info(f"Updated form5 with ID: {form5_id}")
            return form5
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating form5 {form5_id}: {str(e)}")
            raise

    async def delete_form5(self, form5_id: int, user_id: int) -> bool:
        """Soft delete a form5 record"""
        try:
            form5 = await self.get_form5(form5_id)
            if not form5:
                return False

            form5.is_active = False
            form5.updated_by = user_id
            form5.updated_on = datetime.utcnow()
            await self.db.commit()
            logger.info(f"Soft deleted form5 with ID: {form5_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting form5 {form5_id}: {str(e)}")
            raise

    async def change_status(self, form5_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a form5"""
        try:
            result = await self.db.execute(
                select(Form5).where(Form5.id == form5_id)
            )
            form5 = result.scalar_one_or_none()
            if not form5:
                return False

            form5.is_active = status
            form5.updated_by = user_id
            form5.updated_on = datetime.utcnow()
            await self.db.commit()
            logger.info(f"Changed status of form5 {form5_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of form5 {form5_id}: {str(e)}")
            raise
