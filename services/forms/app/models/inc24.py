from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

Base = declarative_base()

class INC24(Base):
    __tablename__ = "tbl_inc24"

    id = Column(Integer, primary_key=True, index=True)
    ref_user = Column(Integer, nullable=True)
    company_id = Column(Integer, nullable=True)
    cin = Column(String(255), nullable=True)
    company_name = Column(String(500), nullable=True)
    company_address = Column(Text, nullable=True)
    company_email = Column(String(255), nullable=True)

    # Form-specific fields will be added based on the actual form structure
    # This is a template that needs to be customized for each form

    # Audit fields
    created_by = Column(Integer, nullable=False)
    created_on = Column(DateTime, default=func.now())
    updated_by = Column(Integer, nullable=True)
    updated_on = Column(DateTime, onupdate=func.now())
    is_active = Column(Boolean, default=True)

# Pydantic models
class INC24Base(BaseModel):
    ref_user: Optional[int] = None
    company_id: Optional[int] = None
    cin: Optional[str] = None
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    company_email: Optional[str] = None

    # Form-specific fields will be added based on the actual form structure
    # This is a template that needs to be customized for each form

    class Config:
        from_attributes = True

class INC24Create(INC24Base):
    pass

class INC24Update(INC24Base):
    pass

class INC24Response(INC24Base):
    id: int
    created_by: int
    created_on: datetime
    updated_by: Optional[int] = None
    updated_on: Optional[datetime] = None
    is_active: bool = True

    class Config:
        from_attributes = True

class INC24View(INC24Response):
    ref_user_name: Optional[str] = None