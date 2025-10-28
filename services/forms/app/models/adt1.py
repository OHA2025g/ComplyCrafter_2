from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from libs.python.data_access import Base


class Adt1(Base):
    __tablename__ = "adt1_submissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    ref_user_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    company_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    cin: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    company_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    company_address: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    company_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    falling_section: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    appointment_nature: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_auditor_appointed: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    auditor_number: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    annual_general_meeting: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    agm_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    appointment_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    is_casual_vacancy: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    srn_of_relevant_form: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    person_vacated: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    vacancy_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    casual_vacancy_reasons: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    membership_number: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    auditor_serial: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    auditor_member_no: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    resolution_number: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    resolution_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    signed_by: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    designation: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    din: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    ref_user_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
