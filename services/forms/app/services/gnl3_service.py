from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.gnl3 import GNL3, GNL3Create, GNL3Update, GNL3View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class GNL3Service:
    def __init__(self, db: Session):
        self.db = db

    def create_gnl3(self, gnl3_data: GNL3Create, user_id: int) -> GNL3:
        """Create a new gnl3 record"""
        try:
            gnl3 = GNL3(
                **gnl3_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(gnl3)
            self.db.commit()
            self.db.refresh(gnl3)
            logger.info(f"Created gnl3 with ID: {gnl3.id}")
            return gnl3
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating gnl3: {str(e)}")
            raise

    def get_gnl3(self, gnl3_id: int) -> Optional[GNL3]:
        """Get a gnl3 by ID"""
        try:
            return self.db.query(GNL3).filter(
                and_(GNL3.id == gnl3_id, GNL3.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting gnl3 {gnl3_id}: {str(e)}")
            raise

    def get_gnl3s(self, skip: int = 0, limit: int = 100) -> List[GNL3]:
        """Get all active gnl3s with pagination"""
        try:
            return self.db.query(GNL3).filter(
                GNL3.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting gnl3s: {str(e)}")
            raise

    def get_gnl3s_by_company(self, company_id: int) -> List[GNL3]:
        """Get all gnl3s for a specific company"""
        try:
            return self.db.query(GNL3).filter(
                and_(
                    GNL3.company_id == company_id,
                    GNL3.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting gnl3s for company {company_id}: {str(e)}")
            raise

    def update_gnl3(self, gnl3_id: int, gnl3_data: GNL3Update, user_id: int) -> Optional[GNL3]:
        """Update a gnl3 record"""
        try:
            gnl3 = self.get_gnl3(gnl3_id)
            if not gnl3:
                return None

            update_data = gnl3_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(gnl3, field, value)
            
            gnl3.updated_by = user_id
            self.db.commit()
            self.db.refresh(gnl3)
            logger.info(f"Updated gnl3 with ID: {gnl3_id}")
            return gnl3
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating gnl3 {gnl3_id}: {str(e)}")
            raise

    def delete_gnl3(self, gnl3_id: int, user_id: int) -> bool:
        """Soft delete a gnl3 record"""
        try:
            gnl3 = self.get_gnl3(gnl3_id)
            if not gnl3:
                return False

            gnl3.is_active = False
            gnl3.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted gnl3 with ID: {gnl3_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting gnl3 {gnl3_id}: {str(e)}")
            raise

    def change_status(self, gnl3_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a gnl3"""
        try:
            gnl3 = self.get_gnl3(gnl3_id)
            if not gnl3:
                return False

            gnl3.is_active = status
            gnl3.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of gnl3 {gnl3_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of gnl3 {gnl3_id}: {str(e)}")
            raise