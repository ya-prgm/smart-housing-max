import hmac
import hashlib
import json
import time
from urllib.parse import parse_qsl
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_pin(pin: str) -> str:
    return pwd_context.hash(pin)


def verify_pin(pin: str, hashed_pin: str) -> bool:
    return pwd_context.verify(pin, hashed_pin)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def check_auth_date(auth_date: int, max_age_seconds: int = 3600) -> bool:
    return (time.time() - auth_date) <= max_age_seconds


def validate_max_init_data(init_data: str, bot_token: str) -> Optional[dict]:
    if not init_data:
        return None

    try:
        params = dict(parse_qsl(init_data, keep_blank_values=True))
    except Exception:
        return None

    received_hash = params.pop("hash", None)
    if not received_hash:
        return None

    data_check_string = "\n".join(
        f"{k}={v}" for k, v in sorted(params.items())
    )

    secret_key = hmac.new(
        b"WebAppData", bot_token.encode(), hashlib.sha256
    ).digest()

    calculated_hash = hmac.new(
        secret_key, data_check_string.encode(), hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(calculated_hash, received_hash):
        return None

    if "user" in params:
        try:
            params["user"] = json.loads(params["user"])
        except json.JSONDecodeError:
            return None

    if "chat" in params:
        try:
            params["chat"] = json.loads(params["chat"])
        except json.JSONDecodeError:
            pass

    return params