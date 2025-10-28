from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.chg6 import CHG6, CHG6Create, CHG6Update, CHG6View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class CHG6Service:
    def __init__(self, db: Session):
        self.db = db

    def create_chg6(self, chg6_data: CHG6Create, user_id: int) -> CHG6:
        """Create a new chg6 record"""
        try:
            chg6 = CHG6(
                **chg6_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(chg6)
            self.db.commit()
            self.db.refresh(chg6)
            logger.info(f"Created chg6 with ID: {chg6.id}")
            return chg6
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating chg6: {str(e)}")
            raise

    def get_chg6(self, chg6_id: int) -> Optional[CHG6]:
        """Get a chg6 by ID"""
        try:
            return self.db.query(CHG6).filter(
                and_(CHG6.id == chg6_id, CHG6.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting chg6 {chg6_id}: {str(e)}")
            raise

    def get_chg6s(self, skip: int = 0, limit: int = 100) -> List[CHG6]:
        """Get all active chg6s with pagination"""
        try:
            return self.db.query(CHG6).filter(
                CHG6.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting chg6s: {str(e)}")
            raise

    def get_chg6s_by_company(self, company_id: int) -> List[CHG6]:
        """Get all chg6s for a specific company"""
        try:
            return self.db.query(CHG6).filter(
                and_(
                    CHG6.company_id == company_id,
                    CHG6.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting chg6s for company {company_id}: {str(e)}")
            raise

    def update_chg6(self, chg6_id: int, chg6_data: CHG6Update, user_id: int) -> Optional[CHG6]:
        """Update a chg6 record"""
        try:
            chg6 = self.get_chg6(chg6_id)
            if not chg6:
                return None

            update_data = chg6_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(chg6, field, value)
            
            chg6.updated_by = user_id
            self.db.commit()
            self.db.refresh(chg6)
            logger.info(f"Updated chg6 with ID: {chg6_id}")
            return chg6
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating chg6 {chg6_id}: {str(e)}")
            raise

    def delete_chg6(self, chg6_id: int, user_id: int) -> bool:
        """Soft delete a chg6 record"""
        try:
            chg6 = self.get_chg6(chg6_id)
            if not chg6:
                return False

            chg6.is_active = False
            chg6.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted chg6 with ID: {chg6_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting chg6 {chg6_id}: {str(e)}")
            raise

    def change_status(self, chg6_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a chg6"""
        try:
            chg6 = self.get_chg6(chg6_id)
            if not chg6:
                return False

            chg6.is_active = status
            chg6.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of chg6 {chg6_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of chg6 {chg6_id}: {str(e)}")
            raise