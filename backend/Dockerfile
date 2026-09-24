FROM python:3.12-slim

WORKDIR /app

# Системные зависимости для сборки C-библиотек
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

# Создание директории для загружаемых файлов
RUN mkdir -p /app/data/uploads

EXPOSE 8000

# Автоматический запуск миграций и сервера
CMD ["sh", "-c", "alembic upgrade head 2>/dev/null || true && uvicorn app.main:app --host 0.0.0.0 --port 8000"]