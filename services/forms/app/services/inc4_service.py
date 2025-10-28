from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.inc4 import INC4, INC4Create, INC4Update, INC4View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class INC4Service:
    def __init__(self, db: Session):
        self.db = db

    def create_inc4(self, inc4_data: INC4Create, user_id: int) -> INC4:
        """Create a new inc4 record"""
        try:
            inc4 = INC4(
                **inc4_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(inc4)
            self.db.commit()
            self.db.refresh(inc4)
            logger.info(f"Created inc4 with ID: {inc4.id}")
            return inc4
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating inc4: {str(e)}")
            raise

    def get_inc4(self, inc4_id: int) -> Optional[INC4]:
        """Get a inc4 by ID"""
        try:
            return self.db.query(INC4).filter(
                and_(INC4.id == inc4_id, INC4.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting inc4 {inc4_id}: {str(e)}")
            raise

    def get_inc4s(self, skip: int = 0, limit: int = 100) -> List[INC4]:
        """Get all active inc4s with pagination"""
        try:
            return self.db.query(INC4).filter(
                INC4.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting inc4s: {str(e)}")
            raise

    def get_inc4s_by_company(self, company_id: int) -> List[INC4]:
        """Get all inc4s for a specific company"""
        try:
            return self.db.query(INC4).filter(
                and_(
                    INC4.company_id == company_id,
                    INC4.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting inc4s for company {company_id}: {str(e)}")
            raise

    def update_inc4(self, inc4_id: int, inc4_data: INC4Update, user_id: int) -> Optional[INC4]:
        """Update a inc4 record"""
        try:
            inc4 = self.get_inc4(inc4_id)
            if not inc4:
                return None

            update_data = inc4_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(inc4, field, value)
            
            inc4.updated_by = user_id
            self.db.commit()
            self.db.refresh(inc4)
            logger.info(f"Updated inc4 with ID: {inc4_id}")
            return inc4
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating inc4 {inc4_id}: {str(e)}")
            raise

    def delete_inc4(self, inc4_id: int, user_id: int) -> bool:
        """Soft delete a inc4 record"""
        try:
            inc4 = self.get_inc4(inc4_id)
            if not inc4:
                return False

            inc4.is_active = False
            inc4.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted inc4 with ID: {inc4_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting inc4 {inc4_id}: {str(e)}")
            raise

    def change_status(self, inc4_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a inc4"""
        try:
            inc4 = self.get_inc4(inc4_id)
            if not inc4:
                return False

            inc4.is_active = status
            inc4.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of inc4 {inc4_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of inc4 {inc4_id}: {str(e)}")
            raise