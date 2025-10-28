from datetime import datetime
from typing import Optional

from pydantic import BaseModel

class Ben2Base(BaseModel):
    ref_user: Optional[int] = None
    company_id: Optional[int] = None
    cin: Optional[str] = None
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    company_email: Optional[str] = None
    reporting_company: Optional[bool] = None
    declaration_ownership: Optional[bool] = None
    change_ownership: Optional[bool] = None
    change_exiting: Optional[bool] = None
    change_reporting_company: Optional[bool] = None
    cin_holding_company: Optional[int] = None
    name_holding_company: Optional[str] = None
    number_of_significant_owners: Optional[int] = None
    copy_attachment: Optional[str] = None
    optional_attachment: Optional[str] = None
    resolution_number: Optional[int] = None
    resolution_date: Optional[datetime] = None
    designation: Optional[str] = None
    signitory: Optional[str] = None
    din_pan: Optional[str] = None
    category: Optional[str] = None
    name_of_pcs: Optional[str] = None
    associate_or_fellow: Optional[str] = None
    membership_number: Optional[int] = None
    ref_user_name: Optional[str] = None

class Ben2Create(Ben2Base):
    pass

class Ben2Read(Ben2Base):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True