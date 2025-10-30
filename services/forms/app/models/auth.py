"""Authentication models for the Forms service."""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, EmailStr


class User(BaseModel):
    """User model for authentication and authorization."""
    
    id: int
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False
    company_id: Optional[int] = None
    
    class Config:
        from_attributes = True


class UserInDB(User):
    """User model with hashed password."""
    
    hashed_password: str

