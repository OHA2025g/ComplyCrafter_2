from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class Adt1Base(BaseModel):
    company_id: Optional[int] = None
    cin: Optional[str] = None
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    company_email: Optional[EmailStr] = None
    falling_section: Optional[str] = None
    appointment_nature: Optional[str] = None
    is_auditor_appointed: Optional[str] = None
    auditor_number: Optional[float] = None
    annual_general_meeting: Optional[str] = None
    agm_date: Optional[datetime] = None
    appointment_date: Optional[datetime] = None
    is_casual_vacancy: Optional[str] = None
    srn_of_relevant_form: Optional[str] = None
    person_vacated: Optional[str] = None
    vacancy_date: Optional[datetime] = None
    casual_vacancy_reasons: Optional[str] = None
    membership_number: Optional[float] = None
    auditor_serial: Optional[bool] = None
    auditor_member_no: Optional[str] = None
    resolution_number: Optional[str] = None
    resolution_date: Optional[datetime] = None
    signed_by: Optional[str] = None
    designation: Optional[str] = None
    din: Optional[str] = None
    ref_user_name: Optional[str] = None


class Adt1Create(Adt1Base):
    company_id: int
    cin: str
    company_name: str


class Adt1Read(Adt1Base):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
