from __future__ import annotations

import hashlib
import os
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_account import UserAccount


def _hash_password(password: str, salt: Optional[str] = None) -> str:
    """Hash password with salt using SHA-256"""
    salt_bytes = (salt or os.urandom(16).hex()).encode()
    hashed = hashlib.sha256(salt_bytes + password.encode()).hexdigest()
    return f"{salt_bytes.decode()}${hashed}"


def _verify_password(password: str, password_hash: str) -> bool:
    """Verify password against hash"""
    try:
        salt, hashed = password_hash.split("$")
    except ValueError:
        return False
    return _hash_password(password, salt) == password_hash


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_user(self, username: str, email: str, password: str) -> UserAccount:
        """Create new user account"""
        # Check if username or email already exists
        existing = await self.db.execute(
            select(UserAccount).where(
                (UserAccount.username == username) | (UserAccount.email == email)
            )
        )
        if existing.scalar_one_or_none() is not None:
            raise ValueError("Username or email already exists")

        # Create user
        password_hash = _hash_password(password)
        user = UserAccount(
            username=username,
            email=email,
            password_hash=password_hash,
            is_active=True
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def verify_user(self, username: str, password: str) -> Optional[UserAccount]:
        """Verify user credentials (username or email + password)"""
        result = await self.db.execute(
            select(UserAccount).where(
                (UserAccount.username == username) | (UserAccount.email == username)
            )
        )
        user = result.scalar_one_or_none()
        
        if user and _verify_password(password, user.password_hash):
            return user
        return None

    async def get_user_by_id(self, user_id: int) -> Optional[UserAccount]:
        """Get user by ID"""
        result = await self.db.execute(
            select(UserAccount).where(UserAccount.id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_user_by_username(self, username: str) -> Optional[UserAccount]:
        """Get user by username"""
        result = await self.db.execute(
            select(UserAccount).where(UserAccount.username == username)
        )
        return result.scalar_one_or_none()
