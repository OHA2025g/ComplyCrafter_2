from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.pas6 import PAS6, PAS6Create, PAS6Update, PAS6View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class PAS6Service:
    def __init__(self, db: Session):
        self.db = db

    def create_pas6(self, pas6_data: PAS6Create, user_id: int) -> PAS6:
        """Create a new pas6 record"""
        try:
            pas6 = PAS6(
                **pas6_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(pas6)
            self.db.commit()
            self.db.refresh(pas6)
            logger.info(f"Created pas6 with ID: {pas6.id}")
            return pas6
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating pas6: {str(e)}")
            raise

    def get_pas6(self, pas6_id: int) -> Optional[PAS6]:
        """Get a pas6 by ID"""
        try:
            return self.db.query(PAS6).filter(
                and_(PAS6.id == pas6_id, PAS6.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting pas6 {pas6_id}: {str(e)}")
            raise

    def get_pas6s(self, skip: int = 0, limit: int = 100) -> List[PAS6]:
        """Get all active pas6s with pagination"""
        try:
            return self.db.query(PAS6).filter(
                PAS6.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting pas6s: {str(e)}")
            raise

    def get_pas6s_by_company(self, company_id: int) -> List[PAS6]:
        """Get all pas6s for a specific company"""
        try:
            return self.db.query(PAS6).filter(
                and_(
                    PAS6.company_id == company_id,
                    PAS6.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting pas6s for company {company_id}: {str(e)}")
            raise

    def update_pas6(self, pas6_id: int, pas6_data: PAS6Update, user_id: int) -> Optional[PAS6]:
        """Update a pas6 record"""
        try:
            pas6 = self.get_pas6(pas6_id)
            if not pas6:
                return None

            update_data = pas6_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(pas6, field, value)
            
            pas6.updated_by = user_id
            self.db.commit()
            self.db.refresh(pas6)
            logger.info(f"Updated pas6 with ID: {pas6_id}")
            return pas6
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating pas6 {pas6_id}: {str(e)}")
            raise

    def delete_pas6(self, pas6_id: int, user_id: int) -> bool:
        """Soft delete a pas6 record"""
        try:
            pas6 = self.get_pas6(pas6_id)
            if not pas6:
                return False

            pas6.is_active = False
            pas6.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted pas6 with ID: {pas6_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting pas6 {pas6_id}: {str(e)}")
            raise

    def change_status(self, pas6_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a pas6"""
        try:
            pas6 = self.get_pas6(pas6_id)
            if not pas6:
                return False

            pas6.is_active = status
            pas6.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of pas6 {pas6_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of pas6 {pas6_id}: {str(e)}")
            raise