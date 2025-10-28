from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.form24 import Form24, Form24Create, Form24Update, Form24View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class Form24Service:
    def __init__(self, db: Session):
        self.db = db

    def create_form24(self, form24_data: Form24Create, user_id: int) -> Form24:
        """Create a new form24 record"""
        try:
            form24 = Form24(
                **form24_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(form24)
            self.db.commit()
            self.db.refresh(form24)
            logger.info(f"Created form24 with ID: {form24.id}")
            return form24
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating form24: {str(e)}")
            raise

    def get_form24(self, form24_id: int) -> Optional[Form24]:
        """Get a form24 by ID"""
        try:
            return self.db.query(Form24).filter(
                and_(Form24.id == form24_id, Form24.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting form24 {form24_id}: {str(e)}")
            raise

    def get_form24s(self, skip: int = 0, limit: int = 100) -> List[Form24]:
        """Get all active form24s with pagination"""
        try:
            return self.db.query(Form24).filter(
                Form24.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting form24s: {str(e)}")
            raise

    def get_form24s_by_company(self, company_id: int) -> List[Form24]:
        """Get all form24s for a specific company"""
        try:
            return self.db.query(Form24).filter(
                and_(
                    Form24.company_id == company_id,
                    Form24.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting form24s for company {company_id}: {str(e)}")
            raise

    def update_form24(self, form24_id: int, form24_data: Form24Update, user_id: int) -> Optional[Form24]:
        """Update a form24 record"""
        try:
            form24 = self.get_form24(form24_id)
            if not form24:
                return None

            update_data = form24_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(form24, field, value)
            
            form24.updated_by = user_id
            self.db.commit()
            self.db.refresh(form24)
            logger.info(f"Updated form24 with ID: {form24_id}")
            return form24
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating form24 {form24_id}: {str(e)}")
            raise

    def delete_form24(self, form24_id: int, user_id: int) -> bool:
        """Soft delete a form24 record"""
        try:
            form24 = self.get_form24(form24_id)
            if not form24:
                return False

            form24.is_active = False
            form24.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted form24 with ID: {form24_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting form24 {form24_id}: {str(e)}")
            raise

    def change_status(self, form24_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a form24"""
        try:
            form24 = self.get_form24(form24_id)
            if not form24:
                return False

            form24.is_active = status
            form24.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of form24 {form24_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of form24 {form24_id}: {str(e)}")
            raise