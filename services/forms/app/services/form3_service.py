from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime
from ..models.form3 import Form3, Form3Create, Form3Update, Form3View
from libs.python.data_access import get_async_session
import logging

logger = logging.getLogger(__name__)

class Form3Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_form3(self, form3_data: Form3Create, user_id: int) -> Form3:
        """Create a new form3 record"""
        try:
            form3 = Form3(
                **form3_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(form3)
            await self.db.commit()
            await self.db.refresh(form3)
            logger.info(f"Created form3 with ID: {form3.id}")
            return form3
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating form3: {str(e)}")
            raise

    async def get_form3(self, form3_id: int) -> Optional[Form3]:
        """Get a form3 by ID"""
        try:
            result = await self.db.execute(
                select(Form3).where(
                    and_(Form3.id == form3_id, Form3.is_active == True)
                )
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error getting form3 {form3_id}: {str(e)}")
            raise

    async def get_form3s(self, skip: int = 0, limit: int = 100) -> List[Form3]:
        """Get all active form3s with pagination"""
        try:
            result = await self.db.execute(
                select(Form3).where(Form3.is_active == True).offset(skip).limit(limit)
            )
            return list(result.scalars().all())
        except Exception as e:
            logger.error(f"Error getting form3s: {str(e)}")
            raise

    async def get_form3s_by_company(self, company_id: int) -> List[Form3]:
        """Get all form3s for a specific company"""
        try:
            result = await self.db.execute(
                select(Form3).where(
                    and_(
                        Form3.company_id == company_id,
                        Form3.is_active == True
                    )
                )
            )
            return list(result.scalars().all())
        except Exception as e:
            logger.error(f"Error getting form3s for company {company_id}: {str(e)}")
            raise

    async def update_form3(self, form3_id: int, form3_data: Form3Update, user_id: int) -> Optional[Form3]:
        """Update a form3 record"""
        try:
            form3 = await self.get_form3(form3_id)
            if not form3:
                return None

            update_data = form3_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(form3, field, value)
            
            form3.updated_by = user_id
            form3.updated_on = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(form3)
            logger.info(f"Updated form3 with ID: {form3_id}")
            return form3
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating form3 {form3_id}: {str(e)}")
            raise

    async def delete_form3(self, form3_id: int, user_id: int) -> bool:
        """Soft delete a form3 record"""
        try:
            form3 = await self.get_form3(form3_id)
            if not form3:
                return False

            form3.is_active = False
            form3.updated_by = user_id
            form3.updated_on = datetime.utcnow()
            await self.db.commit()
            logger.info(f"Soft deleted form3 with ID: {form3_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting form3 {form3_id}: {str(e)}")
            raise

    async def change_status(self, form3_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a form3"""
        try:
            result = await self.db.execute(
                select(Form3).where(Form3.id == form3_id)
            )
            form3 = result.scalar_one_or_none()
            if not form3:
                return False

            form3.is_active = status
            form3.updated_by = user_id
            form3.updated_on = datetime.utcnow()
            await self.db.commit()
            logger.info(f"Changed status of form3 {form3_id} to {status}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error changing status of form3 {form3_id}: {str(e)}")
            raise
