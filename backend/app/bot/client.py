import logging
from typing import Any
import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


class MaxBotClient:
    def __init__(self, token: str | None = None, api_url: str | None = None, app_url: str | None = None, bot_name: str | None = None):
        self.token = token or settings.MAX_BOT_TOKEN
        self.api_url = (api_url or settings.MAX_BOT_API_URL).rstrip("/")
        self.app_url = app_url or settings.APP_URL
        self.bot_name = bot_name or settings.MAX_BOT_NAME

    @property
    def is_configured(self) -> bool:
        return bool(self.token and len(self.token.strip()) > 0)

    def _headers(self) -> dict[str, str]:
        return {
            "Authorization": self.token,
            "Content-Type": "application/json",
        }

    def _build_app_button(self, text: str = "🏠 Открыть «Мой Дом»") -> dict[str, Any]:
        app_target = self.bot_name or settings.MAX_BOT_NAME
        return {
            "type": "inline_keyboard",
            "payload": {
                "buttons": [
                    [
                        {
                            "type": "open_app",
                            "text": text,
                            "web_app": app_target,
                        }
                    ]
                ]
            }
        }

    async def send_message(
        self,
        user_id: int,
        text: str,
        attachments: list[dict[str, Any]] | None = None,
        format: str = "markdown",
    ) -> dict[str, Any] | None:
        if not self.is_configured:
            logger.info("MAX Bot token is not configured, skipping send_message")
            return None

        url = f"{self.api_url}/messages"
        params = {"user_id": user_id}
        payload: dict[str, Any] = {
            "text": text,
            "format": format,
        }
        if attachments:
            payload["attachments"] = attachments

        try:
            async with httpx.AsyncClient(timeout=10.0, verify=False) as client:
                response = await client.post(
                    url,
                    params=params,
                    headers=self._headers(),
                    json=payload,
                )
                if response.status_code >= 400:
                    logger.error(
                        "Failed to send MAX bot message: %s %s",
                        response.status_code,
                        response.text,
                    )
                    return None
                return response.json()
        except Exception as exc:
            logger.exception("Exception while sending MAX bot message: %s", exc)
            return None

    async def send_start_welcome(self, user_id: int, user_name: str = "") -> dict[str, Any] | None:
        name_str = f", {user_name}" if user_name else ""
        text = (
            f"Здравствуйте{name_str}!\n\n"
            f"Добро пожаловать в цифровой сервис **«Мой Дом»** — единую платформу для жителей МКД, "
            f"председателей советов домов и управляющих организаций.\n\n"
            f"**Что умеет сервис:**\n"
            f"📋 **Обращения в УК и службы** — подача заявок с классификатором проблем ЖКХ, "
            f"фотофиксацией и отслеживанием статуса в реальном времени.\n"
            f"🤝 **Поддержка проблем «У меня тоже»** — объединяйтесь с соседями для ускорения решения общедомовых вопросов.\n"
            f"🗳 **Опросы и голосования** — участие в принятии решений по дому прямо со смартфона.\n"
            f"📢 **Лента дома** — официальные объявления УК, отчёты председателя и обсуждения жильцов.\n"
            f"🔔 **Уведомления** — мгновенные оповещения об отключениях, статусах заявок и важных событиях.\n\n"
            f"Нажмите кнопку ниже, чтобы запустить сервис внутри MAX:"
        )
        attachments = [self._build_app_button("🏠 Открыть «Мой Дом»")]
        return await self.send_message(user_id=user_id, text=text, attachments=attachments)

    async def send_help(self, user_id: int) -> dict[str, Any] | None:
        text = (
            "ℹ️ **Справка по сервису «Мой Дом»**\n\n"
            "Сервис работает как встроенное мини-приложение внутри мессенджера MAX.\n\n"
            "**Доступные команды бота:**\n"
            "• `/start` — главное меню и запуск мини-приложения\n"
            "• `/help` — справка по возможностям\n"
            "• `/app` — прямая ссылка на открытие мини-приложения\n\n"
            "Все функции (подача заявок, участие в опросах, просмотр документов) доступны в мини-приложении:"
        )
        attachments = [self._build_app_button("📱 Перейти в «Мой Дом»")]
        return await self.send_message(user_id=user_id, text=text, attachments=attachments)

    async def notify_ticket_status(
        self,
        user_id: int,
        ticket_code: str,
        title: str,
        status_title: str,
        status_icon: str,
        comment: str | None = None,
    ) -> dict[str, Any] | None:
        comment_part = f"\n💬 **Комментарий УК:** _{comment}_" if comment else ""
        text = (
            f"{status_icon} **Статус заявки обновлен**\n\n"
            f"Заявка: **{ticket_code}**\n"
            f"Тема: **{title}**\n"
            f"Новый статус: **{status_title}**{comment_part}\n\n"
            f"Подробности доступны в приложении «Мой Дом»:"
        )
        attachments = [self._build_app_button("📄 Открыть заявку")]
        return await self.send_message(user_id=user_id, text=text, attachments=attachments)

    async def notify_ticket_reply(
        self,
        user_id: int,
        ticket_code: str,
        title: str,
        author_name: str,
        author_role: str,
        reply_text: str,
    ) -> dict[str, Any] | None:
        role_label = "Председатель" if author_role == "chairman" else "Управляющая организация"
        text = (
            f"💬 **Новый ответ по вашей заявке**\n\n"
            f"Заявка: **{ticket_code}** — {title}\n"
            f"От: **{author_name}** ({role_label})\n\n"
            f"> {reply_text}\n\n"
            f"Вы можете посмотреть полную переписку в приложении:"
        )
        attachments = [self._build_app_button("📄 Открыть заявку")]
        return await self.send_message(user_id=user_id, text=text, attachments=attachments)

    async def notify_new_post(
        self,
        user_id: int,
        post_title: str,
        author_badge: str,
        excerpt: str,
    ) -> dict[str, Any] | None:
        text = (
            f"📢 **Новое объявление в доме**\n\n"
            f"Автор: **{author_badge}**\n"
            f"Тема: **{post_title}**\n\n"
            f"{excerpt}\n\n"
            f"Перейдите в ленту дома, чтобы прочитать пост полностью и оставить комментарий:"
        )
        attachments = [self._build_app_button("📰 Открыть ленту")]
        return await self.send_message(user_id=user_id, text=text, attachments=attachments)

    async def notify_new_poll(
        self,
        user_id: int,
        poll_title: str,
        deadline_text: str,
        author_badge: str,
    ) -> dict[str, Any] | None:
        text = (
            f"🗳 **Новый опрос жильцов дома**\n\n"
            f"Инициатор: **{author_badge}**\n"
            f"Тема: **{poll_title}**\n"
            f"Срок голосования: **{deadline_text}**\n\n"
            f"Ваш голос важен для принятия общедомового решения:"
        )
        attachments = [self._build_app_button("✍️ Пройти опрос")]
        return await self.send_message(user_id=user_id, text=text, attachments=attachments)

    async def set_commands(self) -> dict[str, Any] | None:
        if not self.is_configured:
            return None
        url = f"{self.api_url}/me/commands"
        payload = {
            "commands": [
                {"name": "start", "description": "Запустить сервис «Мой Дом»"},
                {"name": "help", "description": "Справка и возможности сервиса"},
                {"name": "app", "description": "Открыть мини-приложение «Мой Дом»"},
            ]
        }
        try:
            async with httpx.AsyncClient(timeout=10.0, verify=False) as client:
                res = await client.patch(url, headers=self._headers(), json=payload)
                if res.status_code >= 400:
                    logger.error("Failed to set bot commands: %s %s", res.status_code, res.text)
                    return None
                return res.json()
        except Exception as exc:
            logger.exception("Error setting bot commands: %s", exc)
            return None

    async def set_webhook(self, webhook_url: str) -> dict[str, Any] | None:
        if not self.is_configured:
            return None
        url = f"{self.api_url}/subscriptions"
        payload = {"url": webhook_url}
        try:
            async with httpx.AsyncClient(timeout=10.0, verify=False) as client:
                res = await client.post(url, headers=self._headers(), json=payload)
                if res.status_code >= 400:
                    logger.error("Failed to set webhook: %s %s", res.status_code, res.text)
                    return None
                return res.json()
        except Exception as exc:
            logger.exception("Error setting webhook: %s", exc)
            return None

    async def delete_webhook(self, webhook_url: str) -> dict[str, Any] | None:
        if not self.is_configured:
            return None
        url = f"{self.api_url}/subscriptions"
        params = {"url": webhook_url}
        try:
            async with httpx.AsyncClient(timeout=10.0, verify=False) as client:
                res = await client.delete(url, headers=self._headers(), params=params)
                if res.status_code >= 400:
                    logger.error("Failed to delete webhook: %s %s", res.status_code, res.text)
                    return None
                return res.json()
        except Exception as exc:
            logger.exception("Error deleting webhook: %s", exc)
            return None

    async def get_me(self) -> dict[str, Any] | None:
        if not self.is_configured:
            return None
        url = f"{self.api_url}/me"
        try:
            async with httpx.AsyncClient(timeout=10.0, verify=False) as client:
                res = await client.get(url, headers=self._headers())
                if res.status_code >= 400:
                    logger.error("Failed to get bot info: %s %s", res.status_code, res.text)
                    return None
                return res.json()
        except Exception as exc:
            logger.exception("Error getting bot info: %s", exc)
            return None


bot_client = MaxBotClient()
