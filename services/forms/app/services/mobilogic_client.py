from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass
from typing import Optional, Tuple
from urllib.parse import quote

import httpx  # type: ignore[import]

from app.core.config import Settings, get_settings
from app.services.otp_exceptions import OTPDispatchError


logger = logging.getLogger(__name__)


GENERIC_TEMPLATE_TEXT = (
    "Dear user Welcome to Comply Crafter your trusted partner in compliance management. "
    "Your One-Time Password (OTP) is {otp}. "
    "Please do not share this code with anyone. It is valid for 10 minutes only. "
    "CAPTABLE SOLUTIONS PRIVATE LIMITED"
)


NAMED_TEMPLATE_TEXT = (
    "Dear {name}, Welcome to Comply Crafter – your trusted partner in compliance management. "
    "Your One-Time Password (OTP) is {otp}. "
    "Please do not share this code with anyone. It is valid for 10 minutes only. "
    "CAPTABLE SOLUTIONS PRIVATE LIMITED"
)


@dataclass(frozen=True)
class MobiLogicTemplate:
    template_id: str
    requires_name: bool


class MobiLogicClient:
    """Client for sending SMS OTP via MobiLogic API."""

    def __init__(self, settings: Optional[Settings] = None) -> None:
        self.settings = settings or get_settings()
        self.base_url = self.settings.mobilogic_base_url.rstrip("?")
        self.timeout = self.settings.mobilogic_request_timeout_seconds
        self.retry_attempts = self.settings.mobilogic_retry_attempts
        self.retry_delay = self.settings.mobilogic_retry_backoff_seconds
        self.default_template = MobiLogicTemplate(
            template_id=self.settings.mobilogic_default_template_id,
            requires_name=False,
        )
        self.named_template = MobiLogicTemplate(
            template_id=self.settings.mobilogic_named_template_id,
            requires_name=True,
        )

    async def send_otp_sms(
        self,
        mobile: str,
        otp_code: str,
        requested_template_id: Optional[str] = None,
        recipient_name: Optional[str] = None,
    ) -> None:
        """Send OTP SMS using the configured template."""
        normalized_name = self._normalize_name(recipient_name)
        template_id, message = self._build_message(otp_code, requested_template_id, normalized_name)
        encoded_message = self._encode_message(message)
        query = self._build_query(mobile, encoded_message, template_id)
        request_url = f"{self.base_url}?{query}"

        last_error: Optional[Exception] = None
        for attempt in range(1, self.retry_attempts + 1):
            try:
                logger.info("MobiLogic request attempt %s: %s", attempt, request_url)
                # SSL verification - can be disabled via MOBILOGIC_VERIFY_SSL=false
                verify_ssl = getattr(self.settings, 'mobilogic_verify_ssl', True)
                if not verify_ssl:
                    logger.warning("SSL verification is DISABLED for Mobilogic API - not recommended for production")
                async with httpx.AsyncClient(timeout=self.timeout, verify=verify_ssl) as client:
                    response = await client.get(request_url)
                logger.info(
                    "MobiLogic response (status=%s): %s",
                    response.status_code,
                    response.text.strip(),
                )
                self._raise_for_response(response, template_id, mobile)
                logger.info("OTP SMS submitted via MobiLogic (template=%s, mobile=%s)", template_id, mobile)
                return
            except (httpx.RequestError, OTPDispatchError) as exc:
                last_error = exc
                logger.warning(
                    "MobiLogic OTP send attempt %s/%s failed: %s", attempt, self.retry_attempts, exc
                )
                if attempt >= self.retry_attempts:
                    break
                await asyncio.sleep(self.retry_delay)

        raise OTPDispatchError("Failed to deliver OTP via MobiLogic") from last_error

    def _build_message(
        self,
        otp_code: str,
        requested_template_id: Optional[str],
        recipient_name: Optional[str],
    ) -> Tuple[str, str]:
        """Prepare SMS text and template id."""
        if requested_template_id and requested_template_id == self.named_template.template_id and recipient_name:
            template_id = self.named_template.template_id
            message = NAMED_TEMPLATE_TEXT.format(name=recipient_name, otp=otp_code)
            return template_id, message

        if requested_template_id == self.default_template.template_id and not recipient_name:
            message = GENERIC_TEMPLATE_TEXT.format(otp=otp_code)
            return self.default_template.template_id, message

        if recipient_name:
            message = NAMED_TEMPLATE_TEXT.format(name=recipient_name, otp=otp_code)
            return self.named_template.template_id, message

        message = GENERIC_TEMPLATE_TEXT.format(otp=otp_code)
        return self.default_template.template_id, message

    def _build_query(self, mobile: str, encoded_message: str, template_id: str) -> str:
        """Construct encoded query string for GET request."""
        return (
            f"username={self.settings.mobilogic_username}"
            f"&password={self.settings.mobilogic_password}"
            f"&route={self.settings.mobilogic_route}"
            f"&sender={self.settings.mobilogic_sender}"
            f"&mobile[]={mobile}"
            f"&message[]={encoded_message}"
            f"&templateid={template_id}"
        )

    @staticmethod
    def _normalize_name(name: Optional[str]) -> Optional[str]:
        if not name:
            return None
        cleaned = " ".join(part for part in name.strip().split() if part)
        return cleaned or None

    @staticmethod
    def _encode_message(message: str) -> str:
        if not message or not message.strip():
            raise OTPDispatchError("SMS message content cannot be blank")
        return quote(message)

    @staticmethod
    def _raise_for_response(response: httpx.Response, template_id: str, mobile: str) -> None:
        if response.status_code != httpx.codes.OK:
            raise OTPDispatchError(f"MobiLogic responded with HTTP {response.status_code}")

        body = response.text.strip()
        logger.error("MobiLogic RAW response: %s", body)
        lowered = body.lower()
        success_markers = ("success", "sent", "submitted", "accepted")
        if "msgid" in lowered and ":" in body:
            # e.g. msgid:73341983 → treat as success
            return
        if any(marker in lowered for marker in success_markers):
            if "error" in lowered:
                raise OTPDispatchError(f"MobiLogic reported error for template {template_id} to {mobile}: {body}")
            return

        # Try JSON payloads
        try:
            payload = response.json()
        except ValueError:
            raise OTPDispatchError(f"Unexpected MobiLogic response: {body}") from None

        status = str(payload).lower()
        if not any(marker in status for marker in success_markers) or "error" in status:
            raise OTPDispatchError(f"MobiLogic error response: {payload}")



