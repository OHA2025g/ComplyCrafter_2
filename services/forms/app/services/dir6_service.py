from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.dir6 import DIR6, DIR6Create, DIR6Update, DIR6View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class DIR6Service:
    def __init__(self, db: Session):
        self.db = db

    def create_dir6(self, dir6_data: DIR6Create, user_id: int) -> DIR6:
        """Create a new dir6 record"""
        try:
            dir6 = DIR6(
                **dir6_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(dir6)
            self.db.commit()
            self.db.refresh(dir6)
            logger.info(f"Created dir6 with ID: {dir6.id}")
            return dir6
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating dir6: {str(e)}")
            raise

    def get_dir6(self, dir6_id: int) -> Optional[DIR6]:
        """Get a dir6 by ID"""
        try:
            return self.db.query(DIR6).filter(
                and_(DIR6.id == dir6_id, DIR6.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting dir6 {dir6_id}: {str(e)}")
            raise

    def get_dir6s(self, skip: int = 0, limit: int = 100) -> List[DIR6]:
        """Get all active dir6s with pagination"""
        try:
            return self.db.query(DIR6).filter(
                DIR6.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting dir6s: {str(e)}")
            raise

    def get_dir6s_by_company(self, company_id: int) -> List[DIR6]:
        """Get all dir6s for a specific company"""
        try:
            return self.db.query(DIR6).filter(
                and_(
                    DIR6.company_id == company_id,
                    DIR6.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting dir6s for company {company_id}: {str(e)}")
            raise

    def update_dir6(self, dir6_id: int, dir6_data: DIR6Update, user_id: int) -> Optional[DIR6]:
        """Update a dir6 record"""
        try:
            dir6 = self.get_dir6(dir6_id)
            if not dir6:
                return None

            update_data = dir6_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(dir6, field, value)
            
            dir6.updated_by = user_id
            self.db.commit()
            self.db.refresh(dir6)
            logger.info(f"Updated dir6 with ID: {dir6_id}")
            return dir6
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating dir6 {dir6_id}: {str(e)}")
            raise

    def delete_dir6(self, dir6_id: int, user_id: int) -> bool:
        """Soft delete a dir6 record"""
        try:
            dir6 = self.get_dir6(dir6_id)
            if not dir6:
                return False

            dir6.is_active = False
            dir6.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted dir6 with ID: {dir6_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting dir6 {dir6_id}: {str(e)}")
            raise

    def change_status(self, dir6_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a dir6"""
        try:
            dir6 = self.get_dir6(dir6_id)
            if not dir6:
                return False

            dir6.is_active = status
            dir6.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of dir6 {dir6_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of dir6 {dir6_id}: {str(e)}")
            raise