from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from libs.python.data_access import Base


class DPT3(Base):
    __tablename__ = 'dpt3_submissions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    ref_user: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    company_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    cin: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    company_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    company_address: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    company_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    type: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    form_purpose: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_gov: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    company_objects: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    deposit_accepted: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    return_period: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    date_of_issue: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    date_of_expiry: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    paid_up_share_capital: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    free_reserves: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    securities_premium_account: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    accumulated_loss: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    deferred_revenue_expenditure_balance: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    accumulated_unprovided_depreciation: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    miscellaneous_expense: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    other_intangible_assets: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    net_worth: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    deposit_max_limit: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    total_deposit_holders_start: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    total_deposit_holders_end: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    existing_deposits_start: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    deposits_renewed: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    secured_deposits: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    unsecured_deposits: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    deposits_repaid: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    deposits_outstanding: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    matured_not_claimed: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    matured_claimed_not_paid: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    deposits_maturing_before_march: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    deposits_maturing_following_next_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    amount_required_in_liquid_assets: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    current_deposits_free_from_charge: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    face_value_gov_securities: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    market_value_gov_securities: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    face_value_trust_securities: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    market_value_trust_securities: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    credit_rating_agency: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    credit_rating: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    credit_rating_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    gnl_form_srn: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    auditor_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    auditor_designation: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    membership_number: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    resolution_number: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    declaration_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    signatory_designation: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    signatory_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    ref_user_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)