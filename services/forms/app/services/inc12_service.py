from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.inc12 import INC12, INC12Create, INC12Update, INC12View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class INC12Service:
    def __init__(self, db: Session):
        self.db = db

    def create_inc12(self, inc12_data: INC12Create, user_id: int) -> INC12:
        """Create a new inc12 record"""
        try:
            inc12 = INC12(
                **inc12_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(inc12)
            self.db.commit()
            self.db.refresh(inc12)
            logger.info(f"Created inc12 with ID: {inc12.id}")
            return inc12
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating inc12: {str(e)}")
            raise

    def get_inc12(self, inc12_id: int) -> Optional[INC12]:
        """Get a inc12 by ID"""
        try:
            return self.db.query(INC12).filter(
                and_(INC12.id == inc12_id, INC12.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting inc12 {inc12_id}: {str(e)}")
            raise

    def get_inc12s(self, skip: int = 0, limit: int = 100) -> List[INC12]:
        """Get all active inc12s with pagination"""
        try:
            return self.db.query(INC12).filter(
                INC12.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting inc12s: {str(e)}")
            raise

    def get_inc12s_by_company(self, company_id: int) -> List[INC12]:
        """Get all inc12s for a specific company"""
        try:
            return self.db.query(INC12).filter(
                and_(
                    INC12.company_id == company_id,
                    INC12.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting inc12s for company {company_id}: {str(e)}")
            raise

    def update_inc12(self, inc12_id: int, inc12_data: INC12Update, user_id: int) -> Optional[INC12]:
        """Update a inc12 record"""
        try:
            inc12 = self.get_inc12(inc12_id)
            if not inc12:
                return None

            update_data = inc12_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(inc12, field, value)
            
            inc12.updated_by = user_id
            self.db.commit()
            self.db.refresh(inc12)
            logger.info(f"Updated inc12 with ID: {inc12_id}")
            return inc12
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating inc12 {inc12_id}: {str(e)}")
            raise

    def delete_inc12(self, inc12_id: int, user_id: int) -> bool:
        """Soft delete a inc12 record"""
        try:
            inc12 = self.get_inc12(inc12_id)
            if not inc12:
                return False

            inc12.is_active = False
            inc12.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted inc12 with ID: {inc12_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting inc12 {inc12_id}: {str(e)}")
            raise

    def change_status(self, inc12_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a inc12"""
        try:
            inc12 = self.get_inc12(inc12_id)
            if not inc12:
                return False

            inc12.is_active = status
            inc12.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of inc12 {inc12_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of inc12 {inc12_id}: {str(e)}")
            raise