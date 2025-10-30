from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime
from ..models.form11 import Form11, Form11Create, Form11Update, Form11View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class Form11Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_form11(self, form11_data: Form11Create, user_id: int) -> Form11:
        """Create a new form11 record"""
        try:
            form11 = Form11(
                **form11_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(form11)
            await self.db.commit()
            await self.db.refresh(form11)
            logger.info(f"Created form11 with ID: {form11.id}")
            return form11
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating form11: {str(e)}")
            raise

    async def get_form11(self, form11_id: int) -> Optional[Form11]:
        """Get a form11 by ID"""
        try:
            result = await self.db.execute(
                select(Form11).where(
                    and_(Form11.id == form11_id, Form11.is_active == True)
                )
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error getting form11 {form11_id}: {str(e)}")
            raise

    async def get_form11s(self, skip: int = 0, limit: int = 100) -> List[Form11]:
        """Get all active form11s with pagination"""
        try:
            result = await self.db.execute(
                select(Form11).where(Form11.is_active == True).offset(skip).limit(limit)
            )
            return list(result.scalars().all())
        except Exception as e:
            logger.error(f"Error getting form11s: {str(e)}")
            raise

    async def get_form11s_by_company(self, company_id: int) -> List[Form11]:
        """Get all form11s for a specific company"""
        try:
            result = await self.db.execute(
                select(Form11).where(
                    and_(
                        Form11.company_id == company_id,
                        Form11.is_active == True
                    )
                )
            )
            return list(result.scalars().all())
        except Exception as e:
            logger.error(f"Error getting form11s for company {company_id}: {str(e)}")
            raise

    async def update_form11(self, form11_id: int, form11_data: Form11Update, user_id: int) -> Optional[Form11]:
        """Update a form11 record"""
        try:
            form11 = await self.get_form11(form11_id)
            if not form11:
                return None

            update_data = form11_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(form11, field, value)
            
            form11.updated_by = user_id
            form11.updated_on = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(form11)
            logger.info(f"Updated form11 with ID: {form11_id}")
            return form11
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating form11 {form11_id}: {str(e)}")
            raise

    async def delete_form11(self, form11_id: int, user_id: int) -> bool:
        """Soft delete a form11 record"""
        try:
            form11 = await self.get_form11(form11_id)
            if not form11:
                return False

            form11.is_active = False
            form11.updated_by = user_id
            form11.updated_on = datetime.utcnow()
            await self.db.commit()
            logger.info(f"Soft deleted form11 with ID: {form11_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting form11 {form11_id}: {str(e)}")
            raise

    async def change_status(self, form11_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a form11"""
        try:
            result = await self.db.execute(
                select(Form11).where(Form11.id == form11_id)
            )
            form11 = result.scalar_one_or_none()
            if not form11:
                return False

            form11.is_active = status
            form11.updated_by = user_id
            form11.updated_on = datetime.utcnow()
            await self.db.commit()
            logger.info(f"Changed status of form11 {form11_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of form11 {form11_id}: {str(e)}")
            raise
