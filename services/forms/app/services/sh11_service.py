from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.sh11 import SH11, SH11Create, SH11Update, SH11View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class SH11Service:
    def __init__(self, db: Session):
        self.db = db

    def create_sh11(self, sh11_data: SH11Create, user_id: int) -> SH11:
        """Create a new sh11 record"""
        try:
            sh11 = SH11(
                **sh11_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(sh11)
            self.db.commit()
            self.db.refresh(sh11)
            logger.info(f"Created sh11 with ID: {sh11.id}")
            return sh11
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating sh11: {str(e)}")
            raise

    def get_sh11(self, sh11_id: int) -> Optional[SH11]:
        """Get a sh11 by ID"""
        try:
            return self.db.query(SH11).filter(
                and_(SH11.id == sh11_id, SH11.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting sh11 {sh11_id}: {str(e)}")
            raise

    def get_sh11s(self, skip: int = 0, limit: int = 100) -> List[SH11]:
        """Get all active sh11s with pagination"""
        try:
            return self.db.query(SH11).filter(
                SH11.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting sh11s: {str(e)}")
            raise

    def get_sh11s_by_company(self, company_id: int) -> List[SH11]:
        """Get all sh11s for a specific company"""
        try:
            return self.db.query(SH11).filter(
                and_(
                    SH11.company_id == company_id,
                    SH11.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting sh11s for company {company_id}: {str(e)}")
            raise

    def update_sh11(self, sh11_id: int, sh11_data: SH11Update, user_id: int) -> Optional[SH11]:
        """Update a sh11 record"""
        try:
            sh11 = self.get_sh11(sh11_id)
            if not sh11:
                return None

            update_data = sh11_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(sh11, field, value)
            
            sh11.updated_by = user_id
            self.db.commit()
            self.db.refresh(sh11)
            logger.info(f"Updated sh11 with ID: {sh11_id}")
            return sh11
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating sh11 {sh11_id}: {str(e)}")
            raise

    def delete_sh11(self, sh11_id: int, user_id: int) -> bool:
        """Soft delete a sh11 record"""
        try:
            sh11 = self.get_sh11(sh11_id)
            if not sh11:
                return False

            sh11.is_active = False
            sh11.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted sh11 with ID: {sh11_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting sh11 {sh11_id}: {str(e)}")
            raise

    def change_status(self, sh11_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a sh11"""
        try:
            sh11 = self.get_sh11(sh11_id)
            if not sh11:
                return False

            sh11.is_active = status
            sh11.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of sh11 {sh11_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of sh11 {sh11_id}: {str(e)}")
            raise