from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.dir3 import DIR3, DIR3Create, DIR3Update, DIR3View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class DIR3Service:
    def __init__(self, db: Session):
        self.db = db

    def create_dir3(self, dir3_data: DIR3Create, user_id: int) -> DIR3:
        """Create a new dir3 record"""
        try:
            dir3 = DIR3(
                **dir3_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(dir3)
            self.db.commit()
            self.db.refresh(dir3)
            logger.info(f"Created dir3 with ID: {dir3.id}")
            return dir3
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating dir3: {str(e)}")
            raise

    def get_dir3(self, dir3_id: int) -> Optional[DIR3]:
        """Get a dir3 by ID"""
        try:
            return self.db.query(DIR3).filter(
                and_(DIR3.id == dir3_id, DIR3.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting dir3 {dir3_id}: {str(e)}")
            raise

    def get_dir3s(self, skip: int = 0, limit: int = 100) -> List[DIR3]:
        """Get all active dir3s with pagination"""
        try:
            return self.db.query(DIR3).filter(
                DIR3.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting dir3s: {str(e)}")
            raise

    def get_dir3s_by_company(self, company_id: int) -> List[DIR3]:
        """Get all dir3s for a specific company"""
        try:
            return self.db.query(DIR3).filter(
                and_(
                    DIR3.company_id == company_id,
                    DIR3.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting dir3s for company {company_id}: {str(e)}")
            raise

    def update_dir3(self, dir3_id: int, dir3_data: DIR3Update, user_id: int) -> Optional[DIR3]:
        """Update a dir3 record"""
        try:
            dir3 = self.get_dir3(dir3_id)
            if not dir3:
                return None

            update_data = dir3_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(dir3, field, value)
            
            dir3.updated_by = user_id
            self.db.commit()
            self.db.refresh(dir3)
            logger.info(f"Updated dir3 with ID: {dir3_id}")
            return dir3
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating dir3 {dir3_id}: {str(e)}")
            raise

    def delete_dir3(self, dir3_id: int, user_id: int) -> bool:
        """Soft delete a dir3 record"""
        try:
            dir3 = self.get_dir3(dir3_id)
            if not dir3:
                return False

            dir3.is_active = False
            dir3.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted dir3 with ID: {dir3_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting dir3 {dir3_id}: {str(e)}")
            raise

    def change_status(self, dir3_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a dir3"""
        try:
            dir3 = self.get_dir3(dir3_id)
            if not dir3:
                return False

            dir3.is_active = status
            dir3.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of dir3 {dir3_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of dir3 {dir3_id}: {str(e)}")
            raise