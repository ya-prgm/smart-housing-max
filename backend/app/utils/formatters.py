from datetime import datetime

MONTHS_RU = {
    1: "янв",
    2: "фев",
    3: "мар",
    4: "апр",
    5: "мая",
    6: "июн",
    7: "июл",
    8: "авг",
    9: "сен",
    10: "окт",
    11: "ноя",
    12: "дек",
}


def format_deadline_text(dt: datetime | None) -> str:
    if not dt:
        return ""
    month_name = MONTHS_RU.get(dt.month, "")
    return f"До {dt.day} {month_name}"


def format_russian_datetime(dt: datetime | None) -> str:
    if not dt:
        return ""
    month_name = MONTHS_RU.get(dt.month, "")
    return f"{dt.day:02d} {month_name}, {dt.hour:02d}:{dt.minute:02d}"
