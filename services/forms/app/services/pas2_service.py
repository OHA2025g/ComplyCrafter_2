from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.pas2 import PAS2, PAS2Create, PAS2Update, PAS2View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class PAS2Service:
    def __init__(self, db: Session):
        self.db = db

    def create_pas2(self, pas2_data: PAS2Create, user_id: int) -> PAS2:
        """Create a new pas2 record"""
        try:
            pas2 = PAS2(
                **pas2_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(pas2)
            self.db.commit()
            self.db.refresh(pas2)
            logger.info(f"Created pas2 with ID: {pas2.id}")
            return pas2
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating pas2: {str(e)}")
            raise

    def get_pas2(self, pas2_id: int) -> Optional[PAS2]:
        """Get a pas2 by ID"""
        try:
            return self.db.query(PAS2).filter(
                and_(PAS2.id == pas2_id, PAS2.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting pas2 {pas2_id}: {str(e)}")
            raise

    def get_pas2s(self, skip: int = 0, limit: int = 100) -> List[PAS2]:
        """Get all active pas2s with pagination"""
        try:
            return self.db.query(PAS2).filter(
                PAS2.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting pas2s: {str(e)}")
            raise

    def get_pas2s_by_company(self, company_id: int) -> List[PAS2]:
        """Get all pas2s for a specific company"""
        try:
            return self.db.query(PAS2).filter(
                and_(
                    PAS2.company_id == company_id,
                    PAS2.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting pas2s for company {company_id}: {str(e)}")
            raise

    def update_pas2(self, pas2_id: int, pas2_data: PAS2Update, user_id: int) -> Optional[PAS2]:
        """Update a pas2 record"""
        try:
            pas2 = self.get_pas2(pas2_id)
            if not pas2:
                return None

            update_data = pas2_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(pas2, field, value)
            
            pas2.updated_by = user_id
            self.db.commit()
            self.db.refresh(pas2)
            logger.info(f"Updated pas2 with ID: {pas2_id}")
            return pas2
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating pas2 {pas2_id}: {str(e)}")
            raise

    def delete_pas2(self, pas2_id: int, user_id: int) -> bool:
        """Soft delete a pas2 record"""
        try:
            pas2 = self.get_pas2(pas2_id)
            if not pas2:
                return False

            pas2.is_active = False
            pas2.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted pas2 with ID: {pas2_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting pas2 {pas2_id}: {str(e)}")
            raise

    def change_status(self, pas2_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a pas2"""
        try:
            pas2 = self.get_pas2(pas2_id)
            if not pas2:
                return False

            pas2.is_active = status
            pas2.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of pas2 {pas2_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of pas2 {pas2_id}: {str(e)}")
            raise