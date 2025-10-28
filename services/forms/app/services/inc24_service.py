from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.inc24 import INC24, INC24Create, INC24Update, INC24View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class INC24Service:
    def __init__(self, db: Session):
        self.db = db

    def create_inc24(self, inc24_data: INC24Create, user_id: int) -> INC24:
        """Create a new inc24 record"""
        try:
            inc24 = INC24(
                **inc24_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(inc24)
            self.db.commit()
            self.db.refresh(inc24)
            logger.info(f"Created inc24 with ID: {inc24.id}")
            return inc24
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating inc24: {str(e)}")
            raise

    def get_inc24(self, inc24_id: int) -> Optional[INC24]:
        """Get a inc24 by ID"""
        try:
            return self.db.query(INC24).filter(
                and_(INC24.id == inc24_id, INC24.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting inc24 {inc24_id}: {str(e)}")
            raise

    def get_inc24s(self, skip: int = 0, limit: int = 100) -> List[INC24]:
        """Get all active inc24s with pagination"""
        try:
            return self.db.query(INC24).filter(
                INC24.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting inc24s: {str(e)}")
            raise

    def get_inc24s_by_company(self, company_id: int) -> List[INC24]:
        """Get all inc24s for a specific company"""
        try:
            return self.db.query(INC24).filter(
                and_(
                    INC24.company_id == company_id,
                    INC24.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting inc24s for company {company_id}: {str(e)}")
            raise

    def update_inc24(self, inc24_id: int, inc24_data: INC24Update, user_id: int) -> Optional[INC24]:
        """Update a inc24 record"""
        try:
            inc24 = self.get_inc24(inc24_id)
            if not inc24:
                return None

            update_data = inc24_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(inc24, field, value)
            
            inc24.updated_by = user_id
            self.db.commit()
            self.db.refresh(inc24)
            logger.info(f"Updated inc24 with ID: {inc24_id}")
            return inc24
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating inc24 {inc24_id}: {str(e)}")
            raise

    def delete_inc24(self, inc24_id: int, user_id: int) -> bool:
        """Soft delete a inc24 record"""
        try:
            inc24 = self.get_inc24(inc24_id)
            if not inc24:
                return False

            inc24.is_active = False
            inc24.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted inc24 with ID: {inc24_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting inc24 {inc24_id}: {str(e)}")
            raise

    def change_status(self, inc24_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a inc24"""
        try:
            inc24 = self.get_inc24(inc24_id)
            if not inc24:
                return False

            inc24.is_active = status
            inc24.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of inc24 {inc24_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of inc24 {inc24_id}: {str(e)}")
            raise