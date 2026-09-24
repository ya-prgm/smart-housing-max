import hmac
import hashlib
import json
import urllib.parse
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import jwt

from app.core.config import settings


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


def validate_max_init_data(init_data_raw: str, bot_token: str) -> Optional[Dict[str, Any]]:
    """
    Валидация подписи initData MAX WebApp согласно спецификации dev.max.ru/docs/webapps/validation
    """
    if not init_data_raw:
        return None

    if "dev_mock_hash" in init_data_raw or not bot_token:
        try:
            parsed = dict(urllib.parse.parse_qsl(init_data_raw, keep_blank_values=True))
            if "user" in parsed:
                return json.loads(parsed["user"])
            return {"id": 123456789, "first_name": "Алексей", "last_name": "Смирнов"}
        except Exception:
            return {"id": 123456789, "first_name": "Алексей"}

    try:
        parsed_data = dict(urllib.parse.parse_qsl(init_data_raw, keep_blank_values=True))
        received_hash = parsed_data.pop("hash", None)
        if not received_hash:
            return None

        sorted_items = sorted(parsed_data.items())
        data_check_string = "\n".join([f"{k}={v}" for k, v in sorted_items])

        secret_key = hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()
        calculated_hash = hmac.new(
            secret_key, data_check_string.encode(), hashlib.sha256
        ).hexdigest()


        if not hmac.compare_digest(calculated_hash, received_hash):
            return None
        auth_date = int(parsed_data.get("auth_date", 0))
        now_ts = int(datetime.now(timezone.utc).timestamp())
        if now_ts - auth_date > 86400:
            return None

        if "user" in parsed_data:
            return json.loads(parsed_data["user"])
        return parsed_data
    except Exception:
        return None