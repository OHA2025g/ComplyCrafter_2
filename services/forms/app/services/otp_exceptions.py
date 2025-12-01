from __future__ import annotations


class OTPDispatchError(Exception):
    """Raised when the SMS gateway fails to deliver an OTP."""


class OTPThrottleError(Exception):
    """Raised when OTP requests exceed the allowed rate."""



