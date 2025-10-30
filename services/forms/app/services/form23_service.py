from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime
from ..models.form23 import Form23, Form23Create, Form23Update, Form23View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class Form23Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_form23(self, form23_data: Form23Create, user_id: int) -> Form23:
        """Create a new form23 record"""
        try:
            form23 = Form23(
                **form23_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(form23)
            await self.db.commit()
            await self.db.refresh(form23)
            logger.info(f"Created form23 with ID: {form23.id}")
            return form23
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating form23: {str(e)}")
            raise

    async def get_form23(self, form23_id: int) -> Optional[Form23]:
        """Get a form23 by ID"""
        try:
            result = await self.db.execute(
                select(Form23).where(
                    and_(Form23.id == form23_id, Form23.is_active == True)
                )
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error getting form23 {form23_id}: {str(e)}")
            raise

    async def get_form23s(self, skip: int = 0, limit: int = 100) -> List[Form23]:
        """Get all active form23s with pagination"""
        try:
            result = await self.db.execute(
                select(Form23).where(Form23.is_active == True).offset(skip).limit(limit)
            )
            return list(result.scalars().all())
        except Exception as e:
            logger.error(f"Error getting form23s: {str(e)}")
            raise

    async def get_form23s_by_company(self, company_id: int) -> List[Form23]:
        """Get all form23s for a specific company"""
        try:
            result = await self.db.execute(
                select(Form23).where(
                    and_(
                        Form23.company_id == company_id,
                        Form23.is_active == True
                    )
                )
            )
            return list(result.scalars().all())
        except Exception as e:
            logger.error(f"Error getting form23s for company {company_id}: {str(e)}")
            raise

    async def update_form23(self, form23_id: int, form23_data: Form23Update, user_id: int) -> Optional[Form23]:
        """Update a form23 record"""
        try:
            form23 = await self.get_form23(form23_id)
            if not form23:
                return None

            update_data = form23_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(form23, field, value)
            
            form23.updated_by = user_id
            form23.updated_on = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(form23)
            logger.info(f"Updated form23 with ID: {form23_id}")
            return form23
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating form23 {form23_id}: {str(e)}")
            raise

    async def delete_form23(self, form23_id: int, user_id: int) -> bool:
        """Soft delete a form23 record"""
        try:
            form23 = await self.get_form23(form23_id)
            if not form23:
                return False

            form23.is_active = False
            form23.updated_by = user_id
            form23.updated_on = datetime.utcnow()
            await self.db.commit()
            logger.info(f"Soft deleted form23 with ID: {form23_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting form23 {form23_id}: {str(e)}")
            raise

    async def change_status(self, form23_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a form23"""
        try:
            result = await self.db.execute(
                select(Form23).where(Form23.id == form23_id)
            )
            form23 = result.scalar_one_or_none()
            if not form23:
                return False

            form23.is_active = status
            form23.updated_by = user_id
            form23.updated_on = datetime.utcnow()
            await self.db.commit()
            logger.info(f"Changed status of form23 {form23_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of form23 {form23_id}: {str(e)}")
            raise
