import asyncio
import logging
import httpx

from app.core.database import AsyncSessionLocal
from app.bot.client import bot_client
from app.bot.handlers import handle_bot_update

logger = logging.getLogger(__name__)


async def run_bot_polling():
    if not bot_client.is_configured:
        logger.info("MAX bot is not configured, skipping long polling")
        return

    me = await bot_client.get_me()
    if me and me.get("username"):
        bot_client.bot_name = me.get("username")
        logger.info("MAX bot connected as @%s (id=%s)", me.get("username"), me.get("user_id"))

    marker = None
    headers = {"Authorization": bot_client.token}
    url = f"{bot_client.api_url}/updates"

    while True:
        try:
            params = {"timeout": 20}
            if marker is not None:
                params["marker"] = marker

            async with httpx.AsyncClient(timeout=25.0, verify=False) as client:
                res = await client.get(url, headers=headers, params=params)

            if res.status_code == 200:
                data = res.json()
                marker = data.get("marker", marker)
                updates = data.get("updates", [])
                for upd in updates:
                    try:
                        async with AsyncSessionLocal() as db:
                            await handle_bot_update(upd, db)
                    except Exception as err:
                        logger.exception("Error processing update: %s", err)
            elif res.status_code in (401, 403):
                logger.error("MAX bot authentication failed: %s", res.text)
                await asyncio.sleep(10)
            else:
                logger.warning("MAX bot polling returned status %s: %s", res.status_code, res.text)
                await asyncio.sleep(2)
        except asyncio.CancelledError:
            logger.info("MAX bot polling stopped")
            break
        except Exception as exc:
            logger.exception("Error in MAX bot polling loop: %s", exc)
            await asyncio.sleep(2)
