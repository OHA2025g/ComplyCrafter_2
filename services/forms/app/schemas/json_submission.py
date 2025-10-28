from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class JsonSubmissionBase(BaseModel):
    company_id: Optional[int] = None
    cin: Optional[str] = None
    company_name: Optional[str] = None
    contact_email: Optional[str] = None
    filing_period: Optional[str] = None
    submission_data: Dict[str, Any] = Field(default_factory=dict)


class JsonSubmissionCreate(JsonSubmissionBase):
    pass


class JsonSubmissionRead(JsonSubmissionBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
