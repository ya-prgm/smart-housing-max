from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Мой Дом"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DOMAIN: str = "obsuzhdalych.ru"
    APP_URL: str = "https://obsuzhdalych.ru"
    SECRET_KEY: str = "max_smart_housing_super_secret_jwt_key_2026_change_in_prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    MAX_BOT_TOKEN: str = ""
    POSTGRES_DB: str = "my_home_database"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "44558833"
    POSTGRES_HOST: str = "127.0.0.1"
    POSTGRES_PORT: int = 5432
    DATABASE_URL: str = "postgresql+asyncpg://postgres:44558833@127.0.0.1:5432/my_home_database"
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "https://obsuzhdalych.ru",
        "http://obsuzhdalych.ru",
        "https://www.obsuzhdalych.ru",
        "http://www.obsuzhdalych.ru",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()