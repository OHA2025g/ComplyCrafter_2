from __future__ import annotations

import random
import re
from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy import and_, delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.otp_verification import OTPVerification
from app.services.mobilogic_client import MobiLogicClient
from app.services.otp_exceptions import OTPDispatchError, OTPThrottleError

OTP_EXPIRY_MINUTES = 10
OTP_RESEND_INTERVAL_SECONDS = 60
PHONE_REGEX = re.compile(r"^\d{10}$")


def validate_phone_number(phone: str) -> bool:
    """Validate phone number is exactly 10 digits"""
    if not phone:
        return False
    cleaned = re.sub(r"\D", "", phone)  # Remove non-digits
    return bool(PHONE_REGEX.match(cleaned))


def normalize_phone_number(phone: str) -> str:
    """Normalize phone number to 10 digits"""
    cleaned = re.sub(r"\D", "", phone)
    if len(cleaned) == 10:
        return cleaned
    raise ValueError("Phone number must be exactly 10 digits")


def generate_otp() -> str:
    """Generate a 6-digit OTP"""
    return f"{random.randint(100000, 999999)}"


class OTPService:
    def __init__(self, db: AsyncSession, sms_client: Optional[MobiLogicClient] = None):
        self.db = db
        self.sms_client = sms_client or MobiLogicClient()

    async def send_otp(
        self,
        phone_number: str,
        template_id: Optional[str] = None,
        recipient_name: Optional[str] = None,
    ) -> str:
        """
        Generate, persist, and dispatch OTP for a phone number.
        Returns the OTP code for testing/mocking purposes.
        """
        normalized_phone = normalize_phone_number(phone_number)

        await self._enforce_send_rate_limit(normalized_phone)

        # Invalidate any existing unverified OTPs for this phone within the same transaction
        await self._invalidate_existing_otps(normalized_phone)

        otp_code = generate_otp()
        expires_at = datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)

        otp_record = OTPVerification(
            phone_number=normalized_phone,
            otp_code=otp_code,
            expires_at=expires_at,
            verified=False,
        )
        self.db.add(otp_record)
        await self.db.flush()

        try:
            await self.sms_client.send_otp_sms(
                mobile=normalized_phone,
                otp_code=otp_code,
                requested_template_id=template_id,
                recipient_name=recipient_name,
            )
        except OTPDispatchError:
            await self.db.rollback()
            raise

        await self.db.commit()
        await self.db.refresh(otp_record)

        return otp_code

    async def verify_otp(self, phone_number: str, otp_code: str) -> bool:
        """
        Verify OTP for phone number.
        Returns True if valid and not expired, False otherwise.
        Marks OTP as verified on success.
        """
        normalized_phone = normalize_phone_number(phone_number)
        
        # Find the most recent unverified OTP for this phone
        result = await self.db.execute(
            select(OTPVerification)
            .where(
                and_(
                    OTPVerification.phone_number == normalized_phone,
                    OTPVerification.otp_code == otp_code,
                    OTPVerification.verified.is_(False),
                    OTPVerification.expires_at > datetime.utcnow(),
                )
            )
            .order_by(OTPVerification.created_at.desc())
        )
        otp_record = result.scalar_one_or_none()
        
        if not otp_record:
            return False
        
        # Mark as verified
        otp_record.verified = True
        otp_record.verified_at = datetime.utcnow()
        await self.db.commit()
        
        return True

    async def is_otp_verified(self, phone_number: str) -> bool:
        """Check if phone number has a verified OTP (within expiry window)"""
        normalized_phone = normalize_phone_number(phone_number)
        
        result = await self.db.execute(
            select(OTPVerification)
            .where(
                and_(
                    OTPVerification.phone_number == normalized_phone,
                    OTPVerification.verified.is_(True),
                    OTPVerification.verified_at > datetime.utcnow() - timedelta(minutes=OTP_EXPIRY_MINUTES),
                )
            )
            .order_by(OTPVerification.verified_at.desc())
        )
        otp_record = result.scalar_one_or_none()
        return otp_record is not None

    async def _invalidate_existing_otps(self, phone_number: str) -> None:
        """Mark all unverified OTPs for a phone number as expired/invalid"""
        await self.db.execute(
            delete(OTPVerification).where(
                and_(
                    OTPVerification.phone_number == phone_number,
                    OTPVerification.verified.is_(False),
                )
            )
        )

    async def _enforce_send_rate_limit(self, phone_number: str) -> None:
        """Ensure at most one OTP per phone number per minute."""
        cutoff = datetime.utcnow() - timedelta(seconds=OTP_RESEND_INTERVAL_SECONDS)
        result = await self.db.execute(
            select(OTPVerification)
            .where(OTPVerification.phone_number == phone_number)
            .order_by(OTPVerification.created_at.desc())
            .limit(1)
        )
        latest = result.scalar_one_or_none()
        if latest and latest.created_at and latest.created_at > cutoff:
            seconds_left = OTP_RESEND_INTERVAL_SECONDS - int((datetime.utcnow() - latest.created_at).total_seconds())
            wait_time = max(seconds_left, 1)
            raise OTPThrottleError(f"Please wait {wait_time} seconds before requesting another OTP")

