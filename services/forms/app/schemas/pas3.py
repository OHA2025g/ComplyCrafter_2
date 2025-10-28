from datetime import datetime
from typing import Optional

from pydantic import BaseModel

class Pas3Base(BaseModel):
    ref_user: Optional[int] = None
    company_id: Optional[int] = None
    cin: Optional[str] = None
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    company_email: Optional[str] = None
    number_of_allotments: Optional[int] = None
    no_of_classes_preference: Optional[int] = None
    no_of_classes_equity: Optional[int] = None
    no_of_unclassified: Optional[int] = None
    total_unclassified: Optional[int] = None
    debentures: Optional[int] = None
    loan_secured: Optional[int] = None
    others: Optional[int] = None
    equity_authorized_capital: Optional[str] = None
    equity_paidup_capital: Optional[str] = None
    allottees_list: Optional[str] = None
    another_attachment: Optional[str] = None
    optional_attachment: Optional[str] = None
    resolution_number: Optional[str] = None
    resolution_date: Optional[datetime] = None
    designation: Optional[str] = None
    signatory: Optional[str] = None
    category: Optional[str] = None
    name_of_pcs: Optional[str] = None
    assososiate_or_fellow: Optional[str] = None
    membership_number: Optional[int] = None
    equity_share_list: Optional[str] = None
    preference_share_list: Optional[str] = None
    ref_user_name: Optional[str] = None
    parent_id: Optional[int] = None
    type: Optional[str] = None
    class_of_shares: Optional[str] = None
    authorized_capital: Optional[float] = None
    issued_capital: Optional[float] = None
    subscribed_capital: Optional[float] = None
    paid_up_capital: Optional[float] = None
    nominal_amount_per_share: Optional[float] = None
    nominal_amount_per_share_issue: Optional[float] = None
    nominal_amount_per_share_sub: Optional[float] = None
    nominal_amount_per_share_paid: Optional[float] = None
    total_amount_shares: Optional[float] = None
    total_amount_shares_issue: Optional[float] = None
    total_amount_shares_sub: Optional[float] = None
    total_amount_shares_paid: Optional[float] = None
    deleted_on: Optional[datetime] = None

class Pas3Create(Pas3Base):
    pass

class Pas3Read(Pas3Base):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True