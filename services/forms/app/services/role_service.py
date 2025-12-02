"""Role service for role management operations."""

from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.role import Role
from app.models.user_account import UserAccount


class RoleService:
    """Service for role management operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_role(self, name: str, description: Optional[str] = None) -> Role:
        """Create a new role."""
        # Check if role with same name already exists
        existing = await self.db.execute(
            select(Role).where(Role.name == name)
        )
        if existing.scalar_one_or_none() is not None:
            raise ValueError(f"Role with name '{name}' already exists")
        
        role = Role(
            name=name,
            description=description
        )
        self.db.add(role)
        await self.db.commit()
        await self.db.refresh(role)
        return role
    
    async def get_role_by_id(self, role_id: int) -> Optional[Role]:
        """Get role by ID."""
        result = await self.db.execute(
            select(Role).where(Role.id == role_id)
        )
        return result.scalar_one_or_none()
    
    async def get_role_by_name(self, name: str) -> Optional[Role]:
        """Get role by name."""
        result = await self.db.execute(
            select(Role).where(Role.name == name)
        )
        return result.scalar_one_or_none()
    
    async def get_all_roles(self) -> List[Role]:
        """Get all roles."""
        result = await self.db.execute(
            select(Role).order_by(Role.name)
        )
        return list(result.scalars().all())
    
    async def update_role(self, role_id: int, name: Optional[str] = None, description: Optional[str] = None) -> Optional[Role]:
        """Update a role."""
        role = await self.get_role_by_id(role_id)
        if not role:
            return None
        
        if name is not None:
            # Check if another role with same name exists
            existing = await self.db.execute(
                select(Role).where(Role.name == name, Role.id != role_id)
            )
            if existing.scalar_one_or_none() is not None:
                raise ValueError(f"Role with name '{name}' already exists")
            role.name = name
        
        if description is not None:
            role.description = description
        
        from datetime import datetime
        role.updated_at = datetime.utcnow()
        
        await self.db.commit()
        await self.db.refresh(role)
        return role
    
    async def delete_role(self, role_id: int) -> bool:
        """Delete a role."""
        role = await self.get_role_by_id(role_id)
        if not role:
            return False
        
        await self.db.delete(role)
        await self.db.commit()
        return True
    
    async def assign_roles_to_user(self, user_id: int, role_ids: List[int]) -> UserAccount:
        """Assign roles to a user."""
        user = await self.db.execute(
            select(UserAccount)
            .where(UserAccount.id == user_id)
            .options(selectinload(UserAccount.roles))
        )
        user = user.scalar_one_or_none()
        if not user:
            raise ValueError(f"User with ID {user_id} not found")
        
        # Get roles to assign
        roles_result = await self.db.execute(
            select(Role).where(Role.id.in_(role_ids))
        )
        roles = list(roles_result.scalars().all())
        
        if len(roles) != len(role_ids):
            found_ids = {role.id for role in roles}
            missing_ids = set(role_ids) - found_ids
            raise ValueError(f"Roles with IDs {missing_ids} not found")
        
        # Assign roles (SQLAlchemy will handle the junction table)
        user.roles = roles
        await self.db.commit()
        await self.db.refresh(user, ['roles'])
        return user
    
    async def get_user_roles(self, user_id: int) -> List[Role]:
        """Get all roles assigned to a user."""
        user = await self.db.execute(
            select(UserAccount)
            .where(UserAccount.id == user_id)
            .options(selectinload(UserAccount.roles))
        )
        user = user.scalar_one_or_none()
        if not user:
            return []
        
        return list(user.roles)
    
    async def unassign_role_from_user(self, user_id: int, role_id: int) -> bool:
        """Unassign a role from a user."""
        user = await self.db.execute(
            select(UserAccount)
            .where(UserAccount.id == user_id)
            .options(selectinload(UserAccount.roles))
        )
        user = user.scalar_one_or_none()
        if not user:
            return False
        
        role = await self.get_role_by_id(role_id)
        if not role:
            return False
        
        if role in user.roles:
            user.roles.remove(role)
            await self.db.commit()
            return True
        
        return False

