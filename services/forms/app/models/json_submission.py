from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional

from sqlalchemy import DateTime, Integer, JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from libs.python.data_access import Base


class JsonSubmission(Base):
    """Abstract base mapped to store flexible form payloads as JSON."""

    __abstract__ = True

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    cin: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    company_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    contact_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    filing_period: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    submission_data: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Aoc4Submission(JsonSubmission):
    __tablename__ = 'aoc4_submissions'


class Aoc4cfsSubmission(JsonSubmission):
    __tablename__ = 'aoc4cfs_submissions'


class Mgt7aSubmission(JsonSubmission):
    __tablename__ = 'mgt7a_submissions'


class MsmeSubmission(JsonSubmission):
    __tablename__ = 'msme_submissions'


class Msme1Submission(JsonSubmission):
    __tablename__ = 'msme1_submissions'


class Ndh1Submission(JsonSubmission):
    __tablename__ = 'ndh1_submissions'


class Ndh2Submission(JsonSubmission):
    __tablename__ = 'ndh2_submissions'
