import time
from typing import Any, Dict

import jwt


def verify_jwt(token: str, secret: str, audience: str) -> Dict[str, Any]:
    payload = jwt.decode(token, secret, algorithms=["HS256"], audience=audience)
    if payload.get("exp", 0) < time.time():
        raise jwt.ExpiredSignatureError("token expired")
    return payload
