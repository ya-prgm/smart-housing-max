import pytest
from unittest.mock import AsyncMock, patch
from httpx import AsyncClient

from app.bot.client import MaxBotClient, bot_client
from app.core.config import settings


@pytest.mark.asyncio
async def test_bot_client_open_app_button_structure():
    client_instance = MaxBotClient(token="test_token", api_url="https://platform-api2.max.ru", app_url="https://obsuzhdalych.ru", bot_name="t739_hakaton_max_bot")
    btn = client_instance._build_app_button("Открыть приложение")
    assert btn["type"] == "inline_keyboard"
    assert "payload" in btn
    assert "buttons" in btn["payload"]
    row = btn["payload"]["buttons"][0]
    assert len(row) == 1
    assert row[0]["type"] == "open_app"
    assert row[0]["text"] == "Открыть приложение"
    assert row[0]["web_app"] == "t739_hakaton_max_bot"


@pytest.mark.asyncio
async def test_bot_send_start_welcome_calls_api():
    client_instance = MaxBotClient(token="test_token", api_url="https://platform-api2.max.ru", app_url="https://obsuzhdalych.ru", bot_name="t739_hakaton_max_bot")
    with patch.object(client_instance, "send_message", new_callable=AsyncMock) as mock_send:
        mock_send.return_value = {"message_id": 1}
        await client_instance.send_start_welcome(user_id=123456789, user_name="Иван")
        assert mock_send.called
        kwargs = mock_send.call_args.kwargs
        assert kwargs["user_id"] == 123456789
        assert "Иван" in kwargs["text"]
        assert "Мой Дом" in kwargs["text"]
        assert len(kwargs["attachments"]) == 1
        btn = kwargs["attachments"][0]["payload"]["buttons"][0][0]
        assert btn["type"] == "open_app"
        assert btn["web_app"] == "t739_hakaton_max_bot"


@pytest.mark.asyncio
async def test_bot_webhook_bot_started(client: AsyncClient):
    with patch("app.bot.handlers.bot_client.send_start_welcome", new_callable=AsyncMock) as mock_welcome:
        payload = {
            "update_type": "bot_started",
            "timestamp": 1720000000,
            "chat_id": 999,
            "user": {
                "user_id": 123456789,
                "first_name": "Алексей",
                "last_name": "Иванов",
                "username": "alex",
            },
        }
        res = await client.post("/api/v1/bot/webhook", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "ok"
        assert data["handled"] == "bot_started"
        mock_welcome.assert_awaited_once_with(user_id=123456789, user_name="Алексей")


@pytest.mark.asyncio
async def test_bot_webhook_start_command(client: AsyncClient):
    with patch("app.bot.handlers.bot_client.send_start_welcome", new_callable=AsyncMock) as mock_welcome:
        payload = {
            "update_type": "message_created",
            "timestamp": 1720000000,
            "message": {
                "sender": {
                    "user_id": 123456789,
                    "first_name": "Алексей",
                },
                "recipient": {
                    "chat_id": 999,
                    "user_id": 123456789,
                    "chat_type": "dialog",
                },
                "body": {
                    "mid": "mid123",
                    "text": "/start",
                },
            },
        }
        res = await client.post("/api/v1/bot/webhook", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "ok"
        assert data["handled"] == "message_created"
        mock_welcome.assert_awaited_once_with(user_id=123456789, user_name="Алексей")


@pytest.mark.asyncio
async def test_bot_webhook_help_command(client: AsyncClient):
    with patch("app.bot.handlers.bot_client.send_help", new_callable=AsyncMock) as mock_help:
        payload = {
            "update_type": "message_created",
            "timestamp": 1720000000,
            "message": {
                "sender": {
                    "user_id": 123456789,
                    "first_name": "Алексей",
                },
                "body": {
                    "mid": "mid124",
                    "text": "/help",
                },
            },
        }
        res = await client.post("/api/v1/bot/webhook", json=payload)
        assert res.status_code == 200
        mock_help.assert_awaited_once_with(user_id=123456789)


@pytest.mark.asyncio
async def test_bot_info_endpoint(client: AsyncClient):
    res = await client.get("/api/v1/bot/info")
    assert res.status_code == 200
    data = res.json()
    assert "is_configured" in data
    assert data["api_url"] == "https://platform-api2.max.ru"
    assert "app_url" in data


@pytest.mark.asyncio
async def test_send_test_notification(client: AsyncClient, resident_headers: dict):
    with patch("app.bot.client.bot_client.send_message", new_callable=AsyncMock) as mock_send:
        mock_send.return_value = {"message_id": 100}
        res = await client.post(
            "/api/v1/bot/test-notification",
            headers=resident_headers,
            json={"message": "Проверка работы бота"},
        )
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "ok"
        assert data["saved_to_db"] is True
