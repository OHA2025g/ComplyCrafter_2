"""Role model for role-based access control."""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from sqlalchemy import DateTime, Integer, String, Text, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship

from libs.python.data_access import Base

# Junction table for many-to-many relationship between users and roles
user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('id', Integer, primary_key=True),
    Column('user_id', Integer, ForeignKey('user_accounts.id', ondelete='CASCADE'), nullable=False),
    Column('role_id', Integer, ForeignKey('roles.id', ondelete='CASCADE'), nullable=False),
    Column('created_at', DateTime, default=datetime.utcnow),
)


class Role(Base):
    """Role model for access control."""
    
    __tablename__ = "roles"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Many-to-many relationship with users
    users: Mapped[List["UserAccount"]] = relationship(
        "UserAccount",
        secondary=user_roles,
        back_populates="roles"
    )

