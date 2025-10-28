from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from libs.python.data_access import Base


class BEN2(Base):
    __tablename__ = 'ben2_submissions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    ref_user: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    company_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    cin: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    company_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    company_address: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    company_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    reporting_company: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    declaration_ownership: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    change_ownership: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    change_exiting: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    change_reporting_company: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    cin_holding_company: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    name_holding_company: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    number_of_significant_owners: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    copy_attachment: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    optional_attachment: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    resolution_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    resolution_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    designation: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    signitory: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    din_pan: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    name_of_pcs: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    associate_or_fellow: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    membership_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    ref_user_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)