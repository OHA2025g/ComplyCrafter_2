from __future__ import annotations

import asyncio
import hashlib
import os
import re
import secrets
from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy import and_, select, text, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models.password_reset_token import PasswordResetToken
from app.models.user_account import UserAccount
from app.services.email_service import EmailService

settings = get_settings()
EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
_TOKEN_TABLE_READY = False
_TOKEN_TABLE_LOCK = asyncio.Lock()


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


def _hash_ccpin(ccpin: str, salt: Optional[str] = None) -> str:
    """Hash CCPIN with salt using SHA-256 (same as password)"""
    salt_bytes = (salt or os.urandom(16).hex()).encode()
    hashed = hashlib.sha256(salt_bytes + ccpin.encode()).hexdigest()
    return f"{salt_bytes.decode()}${hashed}"


def _verify_ccpin(ccpin: str, ccpin_hash: str) -> bool:
    """Verify CCPIN against hash"""
    try:
        salt, hashed = ccpin_hash.split("$")
    except ValueError:
        return False
    return _hash_ccpin(ccpin, salt) == ccpin_hash


def _hash_reset_token(token: str) -> str:
    """Return a stable SHA-256 hash for the provided token."""
    return hashlib.sha256(token.encode()).hexdigest()


def _validate_password_strength(password: str) -> None:
    """Ensure password meets minimum complexity requirements."""
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long")
    if not re.search(r"[A-Za-z]", password) or not re.search(r"\d", password):
        raise ValueError("Password must include letters and numbers")


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.email_service = EmailService()
        self.settings = settings

    async def create_user(
        self,
        email: str,
        password: str,
        first_name: str,
        last_name: str,
        profession: str,
        firm_name: str,
        phone_number: str,
        ccpin: str,
    ) -> UserAccount:
        """Create new user account with all required fields"""
        # Check for existing email
        existing = await self.db.execute(
            select(UserAccount).where(UserAccount.email == email)
        )
        if existing.scalar_one_or_none() is not None:
            raise ValueError("Email already exists")
        
        # Check for existing phone number
        existing_phone = await self.db.execute(
            select(UserAccount).where(UserAccount.phone_number == phone_number)
        )
        if existing_phone.scalar_one_or_none() is not None:
            raise ValueError("Phone number already exists")

        password_hash = _hash_password(password)
        ccpin_hash = _hash_ccpin(ccpin)
        
        user = UserAccount(
            email=email,
            password_hash=password_hash,
            first_name=first_name,
            last_name=last_name,
            profession=profession,
            firm_name=firm_name,
            phone_number=phone_number,
            phone_verified=True,  # Set to True after OTP verification
            ccpin_hash=ccpin_hash,
            is_active=True,
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def verify_user(
        self, username: str, password: Optional[str] = None, ccpin: Optional[str] = None
    ) -> Optional[UserAccount]:
        """
        Verify user credentials.
        Can use either password OR CCPIN (not both required).
        """
        if not password and not ccpin:
            return None
        
        result = await self.db.execute(
            select(UserAccount).where(
                (UserAccount.username == username) | (UserAccount.email == username)
            )
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return None
        
        # Verify password if provided
        if password:
            if _verify_password(password, user.password_hash):
                return user
        
        # Verify CCPIN if provided
        if ccpin:
            if user.ccpin_hash and _verify_ccpin(ccpin, user.ccpin_hash):
                return user
        
        return None

    async def request_password_reset(self, email: str) -> None:
        """Generate a password reset token and send the email."""
        normalized_email = (email or "").strip().lower()
        if not normalized_email:
            raise ValueError("Email is required")
        if not EMAIL_REGEX.match(normalized_email):
            raise ValueError("Invalid email address")

        user = await self._get_user_by_email(normalized_email)
        if not user:
            raise LookupError("User not found")

        await self._ensure_token_table()
        await self._invalidate_existing_tokens(user.id)

        raw_token = secrets.token_urlsafe(48)
        token_digest = _hash_reset_token(raw_token)
        expires_at = datetime.utcnow() + timedelta(minutes=self.settings.password_reset_token_expiry_minutes)

        reset_record = PasswordResetToken(
            user_id=user.id,
            token=token_digest,
            expires_at=expires_at,
        )
        self.db.add(reset_record)
        await self.db.commit()
        await self.db.refresh(reset_record)

        reset_link = self._build_reset_link(raw_token)
        await self.email_service.send_password_reset_email(
            recipient=user.email,
            reset_link=reset_link,
            username=user.email,  # Use email as identifier since username is removed
        )

    async def reset_password(self, token: str, new_password: str) -> None:
        """Validate the reset token and update the user's password."""
        provided_token = (token or "").strip()
        if not provided_token:
            raise ValueError("Reset token is required")
        _validate_password_strength(new_password)

        await self._ensure_token_table()
        token_digest = _hash_reset_token(provided_token)

        result = await self.db.execute(
            select(PasswordResetToken).where(PasswordResetToken.token == token_digest)
        )
        reset_record = result.scalar_one_or_none()
        if reset_record is None:
            raise LookupError("Reset token is invalid")
        if reset_record.used:
            raise PermissionError("Reset token has already been used")

        now = datetime.utcnow()
        if reset_record.expires_at < now:
            raise TimeoutError("Reset token has expired")

        user = await self.get_user_by_id(reset_record.user_id)
        if not user:
            raise LookupError("Associated user not found")

        user.password_hash = _hash_password(new_password)
        user.updated_at = now
        reset_record.used = True
        reset_record.used_at = now

        await self.db.commit()

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

    async def _get_user_by_email(self, email: str) -> Optional[UserAccount]:
        result = await self.db.execute(
            select(UserAccount).where(UserAccount.email == email)
        )
        return result.scalar_one_or_none()

    async def _invalidate_existing_tokens(self, user_id: int) -> None:
        """Mark older tokens as used so only the last link remains valid."""
        now = datetime.utcnow()
        await self.db.execute(
            update(PasswordResetToken)
            .where(
                and_(
                    PasswordResetToken.user_id == user_id,
                    PasswordResetToken.used.is_(False),
                    PasswordResetToken.expires_at > now,
                )
            )
            .values(used=True, used_at=now)
        )
        await self.db.commit()

    def _build_reset_link(self, token: str) -> str:
        base_url = (self.settings.frontend_base_url or "").rstrip("/") or "http://localhost:4200"
        return f"{base_url}/reset-password?token={token}"

    async def _ensure_token_table(self) -> None:
        """Create the password_reset_tokens table if it is missing (dev convenience)."""
        global _TOKEN_TABLE_READY
        if _TOKEN_TABLE_READY:
            return

        async with _TOKEN_TABLE_LOCK:
            if _TOKEN_TABLE_READY:
                return
            ddl_statements = [
                """
                CREATE TABLE IF NOT EXISTS password_reset_tokens (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
                    token VARCHAR(255) NOT NULL UNIQUE,
                    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
                    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
                    used BOOLEAN NOT NULL DEFAULT FALSE,
                    used_at TIMESTAMP WITHOUT TIME ZONE
                );
                """,
                """
                ALTER TABLE password_reset_tokens
                ADD COLUMN IF NOT EXISTS used_at TIMESTAMP WITHOUT TIME ZONE;
                """,
                """
                ALTER TABLE password_reset_tokens
                ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW();
                """,
                """
                ALTER TABLE password_reset_tokens
                ADD COLUMN IF NOT EXISTS used BOOLEAN NOT NULL DEFAULT FALSE;
                """,
                """
                CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_token
                ON password_reset_tokens (token);
                """,
                """
                CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_user_id
                ON password_reset_tokens (user_id);
                """,
            ]
            for statement in ddl_statements:
                await self.db.execute(text(statement))
            await self.db.commit()
            _TOKEN_TABLE_READY = True

