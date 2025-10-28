from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from libs.python.data_access import Base


class PAS3(Base):
    __tablename__ = 'pas3_submissions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    ref_user: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    company_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    cin: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    company_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    company_address: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    company_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    number_of_allotments: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    no_of_classes_preference: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    no_of_classes_equity: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    no_of_unclassified: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    total_unclassified: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    debentures: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    loan_secured: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    others: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    equity_authorized_capital: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    equity_paidup_capital: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    allottees_list: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    another_attachment: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    optional_attachment: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    resolution_number: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    resolution_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    designation: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    signatory: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    name_of_pcs: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    assososiate_or_fellow: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    membership_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    equity_share_list: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    preference_share_list: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    ref_user_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    parent_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    type: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    class_of_shares: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    authorized_capital: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    issued_capital: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    subscribed_capital: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    paid_up_capital: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    nominal_amount_per_share: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    nominal_amount_per_share_issue: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    nominal_amount_per_share_sub: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    nominal_amount_per_share_paid: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    total_amount_shares: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    total_amount_shares_issue: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    total_amount_shares_sub: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    total_amount_shares_paid: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    deleted_on: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)