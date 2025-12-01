from __future__ import annotations

import asyncio
import logging
import smtplib
from email.message import EmailMessage

from app.core.config import get_settings


class EmailDeliveryError(RuntimeError):
    """Raised when the application fails to dispatch an email."""


class EmailService:
    """
    Lightweight email service.

    The service attempts to send email via SMTP when credentials are provided.
    When SMTP settings are missing (local development), it logs the email content
    instead so that the reset link is still discoverable from server logs.
    """

    def __init__(self) -> None:
        self.settings = get_settings()
        self.logger = logging.getLogger(__name__)

    async def send_password_reset_email(
        self,
        recipient: str,
        reset_link: str,
        username: str | None = None,
    ) -> None:
        """Send a password reset email or log it as a fallback."""
        subject = "Reset your ComplyCrafter password"
        friendly_name = username or recipient
        text_body = (
            f"Hello {friendly_name},\n\n"
            "We received a request to reset the password for your ComplyCrafter account.\n"
            f"Reset your password using the secure link below (valid for "
            f"{self.settings.password_reset_token_expiry_minutes} minutes):\n\n"
            f"{reset_link}\n\n"
            "If you did not request a password reset, you can ignore this message.\n"
            "The link will expire automatically.\n\n"
            "— ComplyCrafter Security Team"
        )
        html_body = f"""
            <p>Hello <strong>{friendly_name}</strong>,</p>
            <p>We received a request to reset the password for your ComplyCrafter account.</p>
            <p>
                <a href="{reset_link}" style="
                    display:inline-block;
                    padding:12px 20px;
                    background:#667eea;
                    color:#fff;
                    text-decoration:none;
                    border-radius:6px;
                    font-weight:600;">
                    Reset Password
                </a>
            </p>
            <p>This link is valid for {self.settings.password_reset_token_expiry_minutes} minutes.</p>
            <p>If you did not request this change, you can safely ignore this email.</p>
            <p>— ComplyCrafter Security Team</p>
        """

        if not self.settings.smtp_host:
            # Development fallback: log the link so QA can copy it.
            self.logger.info(
                "[EmailService] SMTP not configured. Simulating password reset email to %s with link %s",
                recipient,
                reset_link,
            )
            return

        message = EmailMessage()
        sender = self.settings.smtp_sender or self.settings.smtp_username or "no-reply@complycrafter.local"
        message["Subject"] = subject
        message["From"] = sender
        message["To"] = recipient
        message.set_content(text_body)
        message.add_alternative(html_body, subtype="html")

        try:
            await asyncio.to_thread(self._send_smtp_message, message)
        except Exception as exc:  # pragma: no cover - depends on SMTP availability
            raise EmailDeliveryError("Failed to send password reset email") from exc

    def _send_smtp_message(self, message: EmailMessage) -> None:
        """Blocking SMTP implementation executed in a background thread."""
        with smtplib.SMTP(self.settings.smtp_host, self.settings.smtp_port) as server:
            if self.settings.smtp_use_tls:
                server.starttls()
            if self.settings.smtp_username:
                server.login(self.settings.smtp_username, self.settings.smtp_password or "")
            server.send_message(message)


