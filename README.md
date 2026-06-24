# Focusly

Веб-приложение для контроля продуктивности: трекинг рабочих сессий, блокировка отвлекающих сайтов по категориям, статистика и AI-отчёты о том, на что уходит время.

## Архитектура

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   frontend   │ ───▶ │   backend    │ ───▶ │  PostgreSQL  │
│ React+Vite/  │      │   NestJS     │      └──────────────┘
│   Nginx      │      │              │ ───▶ ┌──────────────┐
└──────────────┘      └──────────────┘      │    Redis     │
                              │              └──────────────┘
                              ▼
                        Google Gemini API
                        Google OAuth2
```

- **[backend/](./backend/README.md)** — REST API на NestJS: аутентификация (Google OAuth + JWT), хранение данных в PostgreSQL (Prisma), кеш в Redis, генерация AI-отчётов через Gemini.
- **[frontend/](./frontend/README.md)** — SPA на React + Vite + Tailwind, в продакшене раздаётся через Nginx, который также проксирует `/api/` на backend.

Подробности по каждой части — в их собственных README.

## Возможности

- Google-аутентификация, JWT-сессии
- Трекинг рабочих сессий (старт/стоп, история)
- Блок-лист сайтов с категориями
- Тайм-логи по URL и категориям
- Статистика: недельная диаграмма, месячная heatmap
- AI-отчёты о продуктивности (Google Gemini)

## Стек

| Слой | Технологии |
|---|---|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS, React Router, Recharts |
| Backend | NestJS 11, Prisma 7, PostgreSQL, Redis, Passport (Google OAuth2 + JWT) |
| AI | Google Gemini API |
| Инфраструктура | Docker, Docker Compose, Nginx |

## Запуск через Docker Compose

Это основной способ запуска проекта целиком.

1. Создайте `.env` в корне репозитория:

   ```
   DB_USER=focusly
   DB_PASSWORD=...
   DB_NAME=focusly
   JWT_SECRET=...
   GEMINI_API_KEY=...
   ```

2. Создайте `backend/.env` с переменными, описанными в [backend/README.md](./backend/README.md) (включая `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` для OAuth).

3. Запустите:

   ```bash
   docker compose up --build
   ```

Сервисы:

| Сервис | Образ/сборка | Порт | Назначение |
|---|---|---|---|
| `frontend` | `./frontend` (Nginx) | `80` | SPA + проксирование `/api/` на backend |
| `backend` | `./backend` (Node 24) | `3000` | REST API |
| `db` | `postgres:16-alpine` | `5432` | База данных (volume `postgres_main`) |
| `redis` | `redis:alpine` | `6379` | Кеш (volume `redis_main`) |

После старта приложение доступно на `http://localhost`.

## Локальная разработка без Docker

Запускайте backend и frontend отдельно (нужны локальные PostgreSQL и Redis):

```bash
cd backend && pnpm install && pnpm prisma migrate dev && pnpm run start:dev
cd frontend && pnpm install && pnpm run dev
```

Подробности — в [backend/README.md](./backend/README.md) и [frontend/README.md](./frontend/README.md).
