from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.sh8 import SH8, SH8Create, SH8Update, SH8View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class SH8Service:
    def __init__(self, db: Session):
        self.db = db

    def create_sh8(self, sh8_data: SH8Create, user_id: int) -> SH8:
        """Create a new sh8 record"""
        try:
            sh8 = SH8(
                **sh8_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(sh8)
            self.db.commit()
            self.db.refresh(sh8)
            logger.info(f"Created sh8 with ID: {sh8.id}")
            return sh8
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating sh8: {str(e)}")
            raise

    def get_sh8(self, sh8_id: int) -> Optional[SH8]:
        """Get a sh8 by ID"""
        try:
            return self.db.query(SH8).filter(
                and_(SH8.id == sh8_id, SH8.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting sh8 {sh8_id}: {str(e)}")
            raise

    def get_sh8s(self, skip: int = 0, limit: int = 100) -> List[SH8]:
        """Get all active sh8s with pagination"""
        try:
            return self.db.query(SH8).filter(
                SH8.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting sh8s: {str(e)}")
            raise

    def get_sh8s_by_company(self, company_id: int) -> List[SH8]:
        """Get all sh8s for a specific company"""
        try:
            return self.db.query(SH8).filter(
                and_(
                    SH8.company_id == company_id,
                    SH8.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting sh8s for company {company_id}: {str(e)}")
            raise

    def update_sh8(self, sh8_id: int, sh8_data: SH8Update, user_id: int) -> Optional[SH8]:
        """Update a sh8 record"""
        try:
            sh8 = self.get_sh8(sh8_id)
            if not sh8:
                return None

            update_data = sh8_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(sh8, field, value)
            
            sh8.updated_by = user_id
            self.db.commit()
            self.db.refresh(sh8)
            logger.info(f"Updated sh8 with ID: {sh8_id}")
            return sh8
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating sh8 {sh8_id}: {str(e)}")
            raise

    def delete_sh8(self, sh8_id: int, user_id: int) -> bool:
        """Soft delete a sh8 record"""
        try:
            sh8 = self.get_sh8(sh8_id)
            if not sh8:
                return False

            sh8.is_active = False
            sh8.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted sh8 with ID: {sh8_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting sh8 {sh8_id}: {str(e)}")
            raise

    def change_status(self, sh8_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a sh8"""
        try:
            sh8 = self.get_sh8(sh8_id)
            if not sh8:
                return False

            sh8.is_active = status
            sh8.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of sh8 {sh8_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of sh8 {sh8_id}: {str(e)}")
            raise