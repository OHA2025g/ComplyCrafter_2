"""Role management API routes."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.schemas.role import (
    RoleCreate,
    RoleUpdate,
    RoleResponse,
    AssignRolesRequest,
    UserRoleResponse
)
from app.services.role_service import RoleService
from app.core.security import get_current_admin_user
from app.models.auth import User

router = APIRouter(prefix="/roles", tags=["roles"])


@router.post("", response_model=RoleResponse, status_code=status.HTTP_201_CREATED)
async def create_role(
    payload: RoleCreate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_admin_user)
) -> RoleResponse:
    """
    Create a new role.
    Requires admin authentication.
    """
    service = RoleService(db)
    try:
        role = await service.create_role(
            name=payload.name,
            description=payload.description
        )
        return RoleResponse(
            id=role.id,
            name=role.name,
            description=role.description,
            created_at=role.created_at,
            updated_at=role.updated_at
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("", response_model=List[RoleResponse])
async def get_all_roles(
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_admin_user)
) -> List[RoleResponse]:
    """
    Get all roles in the system.
    Requires admin authentication.
    """
    service = RoleService(db)
    roles = await service.get_all_roles()
    return [
        RoleResponse(
            id=role.id,
            name=role.name,
            description=role.description,
            created_at=role.created_at,
            updated_at=role.updated_at
        )
        for role in roles
    ]


@router.get("/{role_id}", response_model=RoleResponse)
async def get_role_by_id(
    role_id: int,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_admin_user)
) -> RoleResponse:
    """
    Get a role by ID.
    Requires admin authentication.
    """
    service = RoleService(db)
    role = await service.get_role_by_id(role_id)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with ID {role_id} not found"
        )
    return RoleResponse(
        id=role.id,
        name=role.name,
        description=role.description,
        created_at=role.created_at,
        updated_at=role.updated_at
    )


@router.put("/{role_id}", response_model=RoleResponse)
async def update_role(
    role_id: int,
    payload: RoleUpdate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_admin_user)
) -> RoleResponse:
    """
    Update a role.
    Requires admin authentication.
    """
    service = RoleService(db)
    try:
        role = await service.update_role(
            role_id=role_id,
            name=payload.name,
            description=payload.description
        )
        if not role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Role with ID {role_id} not found"
            )
        return RoleResponse(
            id=role.id,
            name=role.name,
            description=role.description,
            created_at=role.created_at,
            updated_at=role.updated_at
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_role(
    role_id: int,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Delete a role.
    Requires admin authentication.
    """
    service = RoleService(db)
    success = await service.delete_role(role_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with ID {role_id} not found"
        )


@router.post("/users/{user_id}/assign", response_model=List[RoleResponse])
async def assign_roles_to_user(
    user_id: int,
    payload: AssignRolesRequest,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_admin_user)
) -> List[RoleResponse]:
    """
    Assign roles to a user.
    Requires admin authentication.
    """
    service = RoleService(db)
    try:
        user = await service.assign_roles_to_user(user_id, payload.role_ids)
        return [
            RoleResponse(
                id=role.id,
                name=role.name,
                description=role.description,
                created_at=role.created_at,
                updated_at=role.updated_at
            )
            for role in user.roles
        ]
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/users/{user_id}", response_model=List[RoleResponse])
async def get_user_roles(
    user_id: int,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_admin_user)
) -> List[RoleResponse]:
    """
    Get all roles assigned to a user.
    Requires admin authentication.
    """
    service = RoleService(db)
    roles = await service.get_user_roles(user_id)
    return [
        RoleResponse(
            id=role.id,
            name=role.name,
            description=role.description,
            created_at=role.created_at,
            updated_at=role.updated_at
        )
        for role in roles
    ]


@router.delete("/users/{user_id}/roles/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unassign_role_from_user(
    user_id: int,
    role_id: int,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Unassign a role from a user.
    Requires admin authentication.
    """
    service = RoleService(db)
    success = await service.unassign_role_from_user(user_id, role_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} or role {role_id} not found, or role not assigned to user"
        )

