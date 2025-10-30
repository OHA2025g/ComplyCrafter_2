from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime
from ..models.form4 import Form4, Form4Create, Form4Update, Form4View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class Form4Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_form4(self, form4_data: Form4Create, user_id: int) -> Form4:
        """Create a new form4 record"""
        try:
            form4 = Form4(
                **form4_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(form4)
            await self.db.commit()
            await self.db.refresh(form4)
            logger.info(f"Created form4 with ID: {form4.id}")
            return form4
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating form4: {str(e)}")
            raise

    async def get_form4(self, form4_id: int) -> Optional[Form4]:
        """Get a form4 by ID"""
        try:
            result = await self.db.execute(
                select(Form4).where(
                    and_(Form4.id == form4_id, Form4.is_active == True)
                )
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error getting form4 {form4_id}: {str(e)}")
            raise

    async def get_form4s(self, skip: int = 0, limit: int = 100) -> List[Form4]:
        """Get all active form4s with pagination"""
        try:
            result = await self.db.execute(
                select(Form4).where(Form4.is_active == True).offset(skip).limit(limit)
            )
            return list(result.scalars().all())
        except Exception as e:
            logger.error(f"Error getting form4s: {str(e)}")
            raise

    async def get_form4s_by_company(self, company_id: int) -> List[Form4]:
        """Get all form4s for a specific company"""
        try:
            result = await self.db.execute(
                select(Form4).where(
                    and_(
                        Form4.company_id == company_id,
                        Form4.is_active == True
                    )
                )
            )
            return list(result.scalars().all())
        except Exception as e:
            logger.error(f"Error getting form4s for company {company_id}: {str(e)}")
            raise

    async def update_form4(self, form4_id: int, form4_data: Form4Update, user_id: int) -> Optional[Form4]:
        """Update a form4 record"""
        try:
            form4 = await self.get_form4(form4_id)
            if not form4:
                return None

            update_data = form4_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(form4, field, value)
            
            form4.updated_by = user_id
            form4.updated_on = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(form4)
            logger.info(f"Updated form4 with ID: {form4_id}")
            return form4
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating form4 {form4_id}: {str(e)}")
            raise

    async def delete_form4(self, form4_id: int, user_id: int) -> bool:
        """Soft delete a form4 record"""
        try:
            form4 = await self.get_form4(form4_id)
            if not form4:
                return False

            form4.is_active = False
            form4.updated_by = user_id
            form4.updated_on = datetime.utcnow()
            await self.db.commit()
            logger.info(f"Soft deleted form4 with ID: {form4_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting form4 {form4_id}: {str(e)}")
            raise

    async def change_status(self, form4_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a form4"""
        try:
            result = await self.db.execute(
                select(Form4).where(Form4.id == form4_id)
            )
            form4 = result.scalar_one_or_none()
            if not form4:
                return False

            form4.is_active = status
            form4.updated_by = user_id
            form4.updated_on = datetime.utcnow()
            await self.db.commit()
            logger.info(f"Changed status of form4 {form4_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of form4 {form4_id}: {str(e)}")
            raise
