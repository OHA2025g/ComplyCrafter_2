"""Role schemas for API requests and responses."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class RoleBase(BaseModel):
    """Base role schema."""
    name: str = Field(..., min_length=1, max_length=100, description="Role name (unique)")
    description: Optional[str] = Field(None, description="Role description")


class RoleCreate(RoleBase):
    """Schema for creating a role."""
    pass


class RoleUpdate(BaseModel):
    """Schema for updating a role."""
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="Role name")
    description: Optional[str] = Field(None, description="Role description")


class RoleResponse(RoleBase):
    """Schema for role response."""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class RoleListResponse(BaseModel):
    """Schema for list of roles."""
    roles: List[RoleResponse]
    total: int


class AssignRolesRequest(BaseModel):
    """Schema for assigning roles to a user."""
    role_ids: List[int] = Field(..., description="List of role IDs to assign")


class UserRoleResponse(BaseModel):
    """Schema for user role assignment response."""
    user_id: int
    role_id: int
    role_name: str
    created_at: datetime
    
    class Config:
        from_attributes = True

