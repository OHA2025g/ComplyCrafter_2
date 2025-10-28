from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.form22 import Form22, Form22Create, Form22Update, Form22View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class Form22Service:
    def __init__(self, db: Session):
        self.db = db

    def create_form22(self, form22_data: Form22Create, user_id: int) -> Form22:
        """Create a new form22 record"""
        try:
            form22 = Form22(
                **form22_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(form22)
            self.db.commit()
            self.db.refresh(form22)
            logger.info(f"Created form22 with ID: {form22.id}")
            return form22
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating form22: {str(e)}")
            raise

    def get_form22(self, form22_id: int) -> Optional[Form22]:
        """Get a form22 by ID"""
        try:
            return self.db.query(Form22).filter(
                and_(Form22.id == form22_id, Form22.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting form22 {form22_id}: {str(e)}")
            raise

    def get_form22s(self, skip: int = 0, limit: int = 100) -> List[Form22]:
        """Get all active form22s with pagination"""
        try:
            return self.db.query(Form22).filter(
                Form22.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting form22s: {str(e)}")
            raise

    def get_form22s_by_company(self, company_id: int) -> List[Form22]:
        """Get all form22s for a specific company"""
        try:
            return self.db.query(Form22).filter(
                and_(
                    Form22.company_id == company_id,
                    Form22.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting form22s for company {company_id}: {str(e)}")
            raise

    def update_form22(self, form22_id: int, form22_data: Form22Update, user_id: int) -> Optional[Form22]:
        """Update a form22 record"""
        try:
            form22 = self.get_form22(form22_id)
            if not form22:
                return None

            update_data = form22_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(form22, field, value)
            
            form22.updated_by = user_id
            self.db.commit()
            self.db.refresh(form22)
            logger.info(f"Updated form22 with ID: {form22_id}")
            return form22
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating form22 {form22_id}: {str(e)}")
            raise

    def delete_form22(self, form22_id: int, user_id: int) -> bool:
        """Soft delete a form22 record"""
        try:
            form22 = self.get_form22(form22_id)
            if not form22:
                return False

            form22.is_active = False
            form22.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted form22 with ID: {form22_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting form22 {form22_id}: {str(e)}")
            raise

    def change_status(self, form22_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a form22"""
        try:
            form22 = self.get_form22(form22_id)
            if not form22:
                return False

            form22.is_active = status
            form22.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of form22 {form22_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of form22 {form22_id}: {str(e)}")
            raise