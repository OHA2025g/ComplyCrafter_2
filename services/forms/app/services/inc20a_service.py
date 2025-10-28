from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.inc20a import INC20A, INC20ACreate, INC20AUpdate, INC20AView
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class INC20AService:
    def __init__(self, db: Session):
        self.db = db

    def create_inc20a(self, inc20a_data: INC20ACreate, user_id: int) -> INC20A:
        """Create a new inc20a record"""
        try:
            inc20a = INC20A(
                **inc20a_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(inc20a)
            self.db.commit()
            self.db.refresh(inc20a)
            logger.info(f"Created inc20a with ID: {inc20a.id}")
            return inc20a
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating inc20a: {str(e)}")
            raise

    def get_inc20a(self, inc20a_id: int) -> Optional[INC20A]:
        """Get a inc20a by ID"""
        try:
            return self.db.query(INC20A).filter(
                and_(INC20A.id == inc20a_id, INC20A.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting inc20a {inc20a_id}: {str(e)}")
            raise

    def get_inc20as(self, skip: int = 0, limit: int = 100) -> List[INC20A]:
        """Get all active inc20as with pagination"""
        try:
            return self.db.query(INC20A).filter(
                INC20A.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting inc20as: {str(e)}")
            raise

    def get_inc20as_by_company(self, company_id: int) -> List[INC20A]:
        """Get all inc20as for a specific company"""
        try:
            return self.db.query(INC20A).filter(
                and_(
                    INC20A.company_id == company_id,
                    INC20A.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting inc20as for company {company_id}: {str(e)}")
            raise

    def update_inc20a(self, inc20a_id: int, inc20a_data: INC20AUpdate, user_id: int) -> Optional[INC20A]:
        """Update a inc20a record"""
        try:
            inc20a = self.get_inc20a(inc20a_id)
            if not inc20a:
                return None

            update_data = inc20a_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(inc20a, field, value)
            
            inc20a.updated_by = user_id
            self.db.commit()
            self.db.refresh(inc20a)
            logger.info(f"Updated inc20a with ID: {inc20a_id}")
            return inc20a
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating inc20a {inc20a_id}: {str(e)}")
            raise

    def delete_inc20a(self, inc20a_id: int, user_id: int) -> bool:
        """Soft delete a inc20a record"""
        try:
            inc20a = self.get_inc20a(inc20a_id)
            if not inc20a:
                return False

            inc20a.is_active = False
            inc20a.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted inc20a with ID: {inc20a_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting inc20a {inc20a_id}: {str(e)}")
            raise

    def change_status(self, inc20a_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a inc20a"""
        try:
            inc20a = self.get_inc20a(inc20a_id)
            if not inc20a:
                return False

            inc20a.is_active = status
            inc20a.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of inc20a {inc20a_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of inc20a {inc20a_id}: {str(e)}")
            raise