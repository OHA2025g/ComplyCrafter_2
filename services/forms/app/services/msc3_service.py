from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.msc3 import MSC3, MSC3Create, MSC3Update, MSC3View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class MSC3Service:
    def __init__(self, db: Session):
        self.db = db

    def create_msc3(self, msc3_data: MSC3Create, user_id: int) -> MSC3:
        """Create a new msc3 record"""
        try:
            msc3 = MSC3(
                **msc3_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(msc3)
            self.db.commit()
            self.db.refresh(msc3)
            logger.info(f"Created msc3 with ID: {msc3.id}")
            return msc3
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating msc3: {str(e)}")
            raise

    def get_msc3(self, msc3_id: int) -> Optional[MSC3]:
        """Get a msc3 by ID"""
        try:
            return self.db.query(MSC3).filter(
                and_(MSC3.id == msc3_id, MSC3.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting msc3 {msc3_id}: {str(e)}")
            raise

    def get_msc3s(self, skip: int = 0, limit: int = 100) -> List[MSC3]:
        """Get all active msc3s with pagination"""
        try:
            return self.db.query(MSC3).filter(
                MSC3.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting msc3s: {str(e)}")
            raise

    def get_msc3s_by_company(self, company_id: int) -> List[MSC3]:
        """Get all msc3s for a specific company"""
        try:
            return self.db.query(MSC3).filter(
                and_(
                    MSC3.company_id == company_id,
                    MSC3.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting msc3s for company {company_id}: {str(e)}")
            raise

    def update_msc3(self, msc3_id: int, msc3_data: MSC3Update, user_id: int) -> Optional[MSC3]:
        """Update a msc3 record"""
        try:
            msc3 = self.get_msc3(msc3_id)
            if not msc3:
                return None

            update_data = msc3_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(msc3, field, value)
            
            msc3.updated_by = user_id
            self.db.commit()
            self.db.refresh(msc3)
            logger.info(f"Updated msc3 with ID: {msc3_id}")
            return msc3
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating msc3 {msc3_id}: {str(e)}")
            raise

    def delete_msc3(self, msc3_id: int, user_id: int) -> bool:
        """Soft delete a msc3 record"""
        try:
            msc3 = self.get_msc3(msc3_id)
            if not msc3:
                return False

            msc3.is_active = False
            msc3.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted msc3 with ID: {msc3_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting msc3 {msc3_id}: {str(e)}")
            raise

    def change_status(self, msc3_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a msc3"""
        try:
            msc3 = self.get_msc3(msc3_id)
            if not msc3:
                return False

            msc3.is_active = status
            msc3.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of msc3 {msc3_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of msc3 {msc3_id}: {str(e)}")
            raise