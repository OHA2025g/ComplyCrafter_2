from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.chg1 import CHG1, CHG1Create, CHG1Update, CHG1View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class CHG1Service:
    def __init__(self, db: Session):
        self.db = db

    def create_chg1(self, chg1_data: CHG1Create, user_id: int) -> CHG1:
        """Create a new chg1 record"""
        try:
            chg1 = CHG1(
                **chg1_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(chg1)
            self.db.commit()
            self.db.refresh(chg1)
            logger.info(f"Created chg1 with ID: {chg1.id}")
            return chg1
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating chg1: {str(e)}")
            raise

    def get_chg1(self, chg1_id: int) -> Optional[CHG1]:
        """Get a chg1 by ID"""
        try:
            return self.db.query(CHG1).filter(
                and_(CHG1.id == chg1_id, CHG1.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting chg1 {chg1_id}: {str(e)}")
            raise

    def get_chg1s(self, skip: int = 0, limit: int = 100) -> List[CHG1]:
        """Get all active chg1s with pagination"""
        try:
            return self.db.query(CHG1).filter(
                CHG1.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting chg1s: {str(e)}")
            raise

    def get_chg1s_by_company(self, company_id: int) -> List[CHG1]:
        """Get all chg1s for a specific company"""
        try:
            return self.db.query(CHG1).filter(
                and_(
                    CHG1.company_id == company_id,
                    CHG1.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting chg1s for company {company_id}: {str(e)}")
            raise

    def update_chg1(self, chg1_id: int, chg1_data: CHG1Update, user_id: int) -> Optional[CHG1]:
        """Update a chg1 record"""
        try:
            chg1 = self.get_chg1(chg1_id)
            if not chg1:
                return None

            update_data = chg1_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(chg1, field, value)
            
            chg1.updated_by = user_id
            self.db.commit()
            self.db.refresh(chg1)
            logger.info(f"Updated chg1 with ID: {chg1_id}")
            return chg1
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating chg1 {chg1_id}: {str(e)}")
            raise

    def delete_chg1(self, chg1_id: int, user_id: int) -> bool:
        """Soft delete a chg1 record"""
        try:
            chg1 = self.get_chg1(chg1_id)
            if not chg1:
                return False

            chg1.is_active = False
            chg1.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted chg1 with ID: {chg1_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting chg1 {chg1_id}: {str(e)}")
            raise

    def change_status(self, chg1_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a chg1"""
        try:
            chg1 = self.get_chg1(chg1_id)
            if not chg1:
                return False

            chg1.is_active = status
            chg1.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of chg1 {chg1_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of chg1 {chg1_id}: {str(e)}")
            raise