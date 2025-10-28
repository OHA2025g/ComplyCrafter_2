from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.stk2 import STK2, STK2Create, STK2Update, STK2View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class STK2Service:
    def __init__(self, db: Session):
        self.db = db

    def create_stk2(self, stk2_data: STK2Create, user_id: int) -> STK2:
        """Create a new stk2 record"""
        try:
            stk2 = STK2(
                **stk2_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(stk2)
            self.db.commit()
            self.db.refresh(stk2)
            logger.info(f"Created stk2 with ID: {stk2.id}")
            return stk2
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating stk2: {str(e)}")
            raise

    def get_stk2(self, stk2_id: int) -> Optional[STK2]:
        """Get a stk2 by ID"""
        try:
            return self.db.query(STK2).filter(
                and_(STK2.id == stk2_id, STK2.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting stk2 {stk2_id}: {str(e)}")
            raise

    def get_stk2s(self, skip: int = 0, limit: int = 100) -> List[STK2]:
        """Get all active stk2s with pagination"""
        try:
            return self.db.query(STK2).filter(
                STK2.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting stk2s: {str(e)}")
            raise

    def get_stk2s_by_company(self, company_id: int) -> List[STK2]:
        """Get all stk2s for a specific company"""
        try:
            return self.db.query(STK2).filter(
                and_(
                    STK2.company_id == company_id,
                    STK2.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting stk2s for company {company_id}: {str(e)}")
            raise

    def update_stk2(self, stk2_id: int, stk2_data: STK2Update, user_id: int) -> Optional[STK2]:
        """Update a stk2 record"""
        try:
            stk2 = self.get_stk2(stk2_id)
            if not stk2:
                return None

            update_data = stk2_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(stk2, field, value)
            
            stk2.updated_by = user_id
            self.db.commit()
            self.db.refresh(stk2)
            logger.info(f"Updated stk2 with ID: {stk2_id}")
            return stk2
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating stk2 {stk2_id}: {str(e)}")
            raise

    def delete_stk2(self, stk2_id: int, user_id: int) -> bool:
        """Soft delete a stk2 record"""
        try:
            stk2 = self.get_stk2(stk2_id)
            if not stk2:
                return False

            stk2.is_active = False
            stk2.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted stk2 with ID: {stk2_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting stk2 {stk2_id}: {str(e)}")
            raise

    def change_status(self, stk2_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a stk2"""
        try:
            stk2 = self.get_stk2(stk2_id)
            if not stk2:
                return False

            stk2.is_active = status
            stk2.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of stk2 {stk2_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of stk2 {stk2_id}: {str(e)}")
            raise