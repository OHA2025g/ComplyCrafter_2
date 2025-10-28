from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.form15 import Form15, Form15Create, Form15Update, Form15View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class Form15Service:
    def __init__(self, db: Session):
        self.db = db

    def create_form15(self, form15_data: Form15Create, user_id: int) -> Form15:
        """Create a new form15 record"""
        try:
            form15 = Form15(
                **form15_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(form15)
            self.db.commit()
            self.db.refresh(form15)
            logger.info(f"Created form15 with ID: {form15.id}")
            return form15
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating form15: {str(e)}")
            raise

    def get_form15(self, form15_id: int) -> Optional[Form15]:
        """Get a form15 by ID"""
        try:
            return self.db.query(Form15).filter(
                and_(Form15.id == form15_id, Form15.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting form15 {form15_id}: {str(e)}")
            raise

    def get_form15s(self, skip: int = 0, limit: int = 100) -> List[Form15]:
        """Get all active form15s with pagination"""
        try:
            return self.db.query(Form15).filter(
                Form15.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting form15s: {str(e)}")
            raise

    def get_form15s_by_company(self, company_id: int) -> List[Form15]:
        """Get all form15s for a specific company"""
        try:
            return self.db.query(Form15).filter(
                and_(
                    Form15.company_id == company_id,
                    Form15.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting form15s for company {company_id}: {str(e)}")
            raise

    def update_form15(self, form15_id: int, form15_data: Form15Update, user_id: int) -> Optional[Form15]:
        """Update a form15 record"""
        try:
            form15 = self.get_form15(form15_id)
            if not form15:
                return None

            update_data = form15_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(form15, field, value)
            
            form15.updated_by = user_id
            self.db.commit()
            self.db.refresh(form15)
            logger.info(f"Updated form15 with ID: {form15_id}")
            return form15
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating form15 {form15_id}: {str(e)}")
            raise

    def delete_form15(self, form15_id: int, user_id: int) -> bool:
        """Soft delete a form15 record"""
        try:
            form15 = self.get_form15(form15_id)
            if not form15:
                return False

            form15.is_active = False
            form15.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted form15 with ID: {form15_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting form15 {form15_id}: {str(e)}")
            raise

    def change_status(self, form15_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a form15"""
        try:
            form15 = self.get_form15(form15_id)
            if not form15:
                return False

            form15.is_active = status
            form15.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of form15 {form15_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of form15 {form15_id}: {str(e)}")
            raise