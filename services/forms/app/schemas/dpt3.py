from datetime import datetime
from typing import Optional

from pydantic import BaseModel

class Dpt3Base(BaseModel):
    ref_user: Optional[int] = None
    company_id: Optional[int] = None
    cin: Optional[str] = None
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    company_email: Optional[str] = None
    type: Optional[str] = None
    form_purpose: Optional[str] = None
    is_gov: Optional[str] = None
    company_objects: Optional[str] = None
    deposit_accepted: Optional[str] = None
    return_period: Optional[datetime] = None
    date_of_issue: Optional[datetime] = None
    date_of_expiry: Optional[datetime] = None
    paid_up_share_capital: Optional[float] = None
    free_reserves: Optional[float] = None
    securities_premium_account: Optional[float] = None
    accumulated_loss: Optional[float] = None
    deferred_revenue_expenditure_balance: Optional[float] = None
    accumulated_unprovided_depreciation: Optional[float] = None
    miscellaneous_expense: Optional[float] = None
    other_intangible_assets: Optional[float] = None
    net_worth: Optional[float] = None
    deposit_max_limit: Optional[float] = None
    total_deposit_holders_start: Optional[int] = None
    total_deposit_holders_end: Optional[int] = None
    existing_deposits_start: Optional[int] = None
    deposits_renewed: Optional[int] = None
    secured_deposits: Optional[int] = None
    unsecured_deposits: Optional[int] = None
    deposits_repaid: Optional[int] = None
    deposits_outstanding: Optional[int] = None
    matured_not_claimed: Optional[int] = None
    matured_claimed_not_paid: Optional[int] = None
    deposits_maturing_before_march: Optional[int] = None
    deposits_maturing_following_next_year: Optional[int] = None
    amount_required_in_liquid_assets: Optional[float] = None
    current_deposits_free_from_charge: Optional[float] = None
    face_value_gov_securities: Optional[float] = None
    market_value_gov_securities: Optional[float] = None
    face_value_trust_securities: Optional[float] = None
    market_value_trust_securities: Optional[float] = None
    credit_rating_agency: Optional[str] = None
    credit_rating: Optional[str] = None
    credit_rating_date: Optional[datetime] = None
    gnl_form_srn: Optional[str] = None
    auditor_name: Optional[str] = None
    auditor_designation: Optional[str] = None
    membership_number: Optional[str] = None
    resolution_number: Optional[str] = None
    declaration_date: Optional[datetime] = None
    signatory_designation: Optional[str] = None
    signatory_id: Optional[str] = None
    ref_user_name: Optional[str] = None

class Dpt3Create(Dpt3Base):
    pass

class Dpt3Read(Dpt3Base):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True