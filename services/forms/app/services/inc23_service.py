from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.inc23 import INC23, INC23Create, INC23Update, INC23View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class INC23Service:
    def __init__(self, db: Session):
        self.db = db

    def create_inc23(self, inc23_data: INC23Create, user_id: int) -> INC23:
        """Create a new inc23 record"""
        try:
            inc23 = INC23(
                **inc23_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(inc23)
            self.db.commit()
            self.db.refresh(inc23)
            logger.info(f"Created inc23 with ID: {inc23.id}")
            return inc23
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating inc23: {str(e)}")
            raise

    def get_inc23(self, inc23_id: int) -> Optional[INC23]:
        """Get a inc23 by ID"""
        try:
            return self.db.query(INC23).filter(
                and_(INC23.id == inc23_id, INC23.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting inc23 {inc23_id}: {str(e)}")
            raise

    def get_inc23s(self, skip: int = 0, limit: int = 100) -> List[INC23]:
        """Get all active inc23s with pagination"""
        try:
            return self.db.query(INC23).filter(
                INC23.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting inc23s: {str(e)}")
            raise

    def get_inc23s_by_company(self, company_id: int) -> List[INC23]:
        """Get all inc23s for a specific company"""
        try:
            return self.db.query(INC23).filter(
                and_(
                    INC23.company_id == company_id,
                    INC23.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting inc23s for company {company_id}: {str(e)}")
            raise

    def update_inc23(self, inc23_id: int, inc23_data: INC23Update, user_id: int) -> Optional[INC23]:
        """Update a inc23 record"""
        try:
            inc23 = self.get_inc23(inc23_id)
            if not inc23:
                return None

            update_data = inc23_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(inc23, field, value)
            
            inc23.updated_by = user_id
            self.db.commit()
            self.db.refresh(inc23)
            logger.info(f"Updated inc23 with ID: {inc23_id}")
            return inc23
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating inc23 {inc23_id}: {str(e)}")
            raise

    def delete_inc23(self, inc23_id: int, user_id: int) -> bool:
        """Soft delete a inc23 record"""
        try:
            inc23 = self.get_inc23(inc23_id)
            if not inc23:
                return False

            inc23.is_active = False
            inc23.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted inc23 with ID: {inc23_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting inc23 {inc23_id}: {str(e)}")
            raise

    def change_status(self, inc23_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a inc23"""
        try:
            inc23 = self.get_inc23(inc23_id)
            if not inc23:
                return False

            inc23.is_active = status
            inc23.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of inc23 {inc23_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of inc23 {inc23_id}: {str(e)}")
            raise