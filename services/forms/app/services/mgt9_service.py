from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.mgt9 import MGT9, MGT9Create, MGT9Update, MGT9View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class MGT9Service:
    def __init__(self, db: Session):
        self.db = db

    def create_mgt9(self, mgt9_data: MGT9Create, user_id: int) -> MGT9:
        """Create a new mgt9 record"""
        try:
            mgt9 = MGT9(
                **mgt9_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(mgt9)
            self.db.commit()
            self.db.refresh(mgt9)
            logger.info(f"Created mgt9 with ID: {mgt9.id}")
            return mgt9
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating mgt9: {str(e)}")
            raise

    def get_mgt9(self, mgt9_id: int) -> Optional[MGT9]:
        """Get a mgt9 by ID"""
        try:
            return self.db.query(MGT9).filter(
                and_(MGT9.id == mgt9_id, MGT9.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting mgt9 {mgt9_id}: {str(e)}")
            raise

    def get_mgt9s(self, skip: int = 0, limit: int = 100) -> List[MGT9]:
        """Get all active mgt9s with pagination"""
        try:
            return self.db.query(MGT9).filter(
                MGT9.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting mgt9s: {str(e)}")
            raise

    def get_mgt9s_by_company(self, company_id: int) -> List[MGT9]:
        """Get all mgt9s for a specific company"""
        try:
            return self.db.query(MGT9).filter(
                and_(
                    MGT9.company_id == company_id,
                    MGT9.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting mgt9s for company {company_id}: {str(e)}")
            raise

    def update_mgt9(self, mgt9_id: int, mgt9_data: MGT9Update, user_id: int) -> Optional[MGT9]:
        """Update a mgt9 record"""
        try:
            mgt9 = self.get_mgt9(mgt9_id)
            if not mgt9:
                return None

            update_data = mgt9_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(mgt9, field, value)
            
            mgt9.updated_by = user_id
            self.db.commit()
            self.db.refresh(mgt9)
            logger.info(f"Updated mgt9 with ID: {mgt9_id}")
            return mgt9
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating mgt9 {mgt9_id}: {str(e)}")
            raise

    def delete_mgt9(self, mgt9_id: int, user_id: int) -> bool:
        """Soft delete a mgt9 record"""
        try:
            mgt9 = self.get_mgt9(mgt9_id)
            if not mgt9:
                return False

            mgt9.is_active = False
            mgt9.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted mgt9 with ID: {mgt9_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting mgt9 {mgt9_id}: {str(e)}")
            raise

    def change_status(self, mgt9_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a mgt9"""
        try:
            mgt9 = self.get_mgt9(mgt9_id)
            if not mgt9:
                return False

            mgt9.is_active = status
            mgt9.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of mgt9 {mgt9_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of mgt9 {mgt9_id}: {str(e)}")
            raise