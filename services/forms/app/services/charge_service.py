from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.charge import CHARGE, CHARGECreate, CHARGEUpdate, CHARGEView
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class CHARGEService:
    def __init__(self, db: Session):
        self.db = db

    def create_charge(self, charge_data: CHARGECreate, user_id: int) -> CHARGE:
        """Create a new charge record"""
        try:
            charge = CHARGE(
                **charge_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(charge)
            self.db.commit()
            self.db.refresh(charge)
            logger.info(f"Created charge with ID: {charge.id}")
            return charge
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating charge: {str(e)}")
            raise

    def get_charge(self, charge_id: int) -> Optional[CHARGE]:
        """Get a charge by ID"""
        try:
            return self.db.query(CHARGE).filter(
                and_(CHARGE.id == charge_id, CHARGE.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting charge {charge_id}: {str(e)}")
            raise

    def get_charges(self, skip: int = 0, limit: int = 100) -> List[CHARGE]:
        """Get all active charges with pagination"""
        try:
            return self.db.query(CHARGE).filter(
                CHARGE.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting charges: {str(e)}")
            raise

    def get_charges_by_company(self, company_id: int) -> List[CHARGE]:
        """Get all charges for a specific company"""
        try:
            return self.db.query(CHARGE).filter(
                and_(
                    CHARGE.company_id == company_id,
                    CHARGE.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting charges for company {company_id}: {str(e)}")
            raise

    def update_charge(self, charge_id: int, charge_data: CHARGEUpdate, user_id: int) -> Optional[CHARGE]:
        """Update a charge record"""
        try:
            charge = self.get_charge(charge_id)
            if not charge:
                return None

            update_data = charge_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(charge, field, value)
            
            charge.updated_by = user_id
            self.db.commit()
            self.db.refresh(charge)
            logger.info(f"Updated charge with ID: {charge_id}")
            return charge
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating charge {charge_id}: {str(e)}")
            raise

    def delete_charge(self, charge_id: int, user_id: int) -> bool:
        """Soft delete a charge record"""
        try:
            charge = self.get_charge(charge_id)
            if not charge:
                return False

            charge.is_active = False
            charge.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted charge with ID: {charge_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting charge {charge_id}: {str(e)}")
            raise

    def change_status(self, charge_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a charge"""
        try:
            charge = self.get_charge(charge_id)
            if not charge:
                return False

            charge.is_active = status
            charge.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of charge {charge_id} to {status}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of charge {charge_id}: {str(e)}")
            raise