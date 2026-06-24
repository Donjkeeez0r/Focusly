# Focusly — Backend

REST API на [NestJS](https://nestjs.com/) для приложения Focusly: трекинг рабочих сессий, блокировка сайтов по категориям, статистика и AI-отчёты о продуктивности.

## Стек

- **NestJS 11** (Express)
- **PostgreSQL** через **Prisma ORM 7**
- **Redis** — кеширование (`@nestjs/cache-manager` + `@keyv/redis`)
- **Аутентификация** — Google OAuth2 (`passport-google-oauth20`) + JWT (`@nestjs/jwt`, `passport-jwt`)
- **AI** — Google Gemini API (`@google/generative-ai`) для генерации отчётов
- **@nestjs/schedule** — фоновые задачи
- Node 24 (alpine), пакетный менеджер **pnpm**

## Структура модулей (`src/`)

| Модуль | Назначение |
|---|---|
| `auth` | Google OAuth flow, выпуск и проверка JWT |
| `productivity` | Сессии работы, блок-лист сайтов, тайм-логи |
| `categories` | CRUD категорий пользователя |
| `stats` | Агрегированная статистика (pie/heatmap) |
| `ai` | Генерация AI-отчётов по продуктивности (Gemini) |
| `prisma` | Обёртка над Prisma Client, доступна глобально |

## API

Базовый URL без глобального префикса, порт — `PORT` (по умолчанию `3000`). CORS разрешён для `FRONTEND_URL` (по умолчанию `http://localhost:5173`).

### Auth (`/auth`)
| Метод | Путь | Описание |
|---|---|---|
| GET | `/auth/google` | Запуск OAuth-флоу через Google |
| GET | `/auth/google/callback` | Callback, редиректит на фронтенд с токеном |
| GET | `/auth/me` 🔒 | Профиль текущего пользователя |

### Productivity (`/productivity`, всё 🔒)
| Метод | Путь | Описание |
|---|---|---|
| POST | `/productivity/session/start` | Начать сессию |
| POST | `/productivity/session/end` | Завершить активную сессию |
| GET | `/productivity/session/active` | Текущая активная сессия |
| GET | `/productivity/sessions` | Список сессий пользователя |
| GET | `/productivity/blocklist` | Список заблокированных сайтов |
| POST | `/productivity/blocklist` | Добавить сайт в блок-лист (`{ url, categoryId }`) |
| DELETE | `/productivity/blocklist/:id` | Удалить сайт из блок-листа |
| GET | `/productivity/check-site?url=` | Проверить, заблокирован ли URL |
| GET | `/productivity/logs` | Получить тайм-логи |
| POST | `/productivity/logs` | Сохранить тайм-логи (`{ logs: SaveLogInput[] }`) |

### Categories (`/categories`, всё 🔒)
| Метод | Путь | Описание |
|---|---|---|
| GET | `/categories` | Список категорий |
| POST | `/categories` | Создать категорию |
| DELETE | `/categories/:id` | Удалить категорию |

### Stats (`/stats`, всё 🔒)
| Метод | Путь | Описание |
|---|---|---|
| GET | `/stats/weekly-pie` | Данные для недельной круговой диаграммы |
| GET | `/stats/month-heatmap` | Данные для месячной heatmap |

### AI (`/ai`, всё 🔒)
| Метод | Путь | Описание |
|---|---|---|
| GET | `/ai/reports` | Список сгенерированных отчётов |
| POST | `/ai/reports/generate` | Сгенерировать новый AI-отчёт за неделю |

🔒 — требует `Authorization: Bearer <jwt>`.

## Модель данных (Prisma)

- **User** — учётная запись (email, googleId), связана со всеми остальными сущностями
- **Category** — категория сайта/активности (name, color), уникальна в рамках пользователя
- **BlockList** — заблокированный URL, привязан к категории и пользователю
- **Session** — рабочая сессия (startTime/endTime), содержит тайм-логи
- **TimeLog** — запись о времени на конкретном URL (duration), может относиться к сессии и категории
- **AiReport** — сгенерированный текстовый отчёт по продуктивности

Полная схема: [`prisma/schema.prisma`](./prisma/schema.prisma).

## Переменные окружения

Создайте `.env` в `backend/` со следующими ключами:

```
DATABASE_URL=postgresql://user:password@localhost:5432/focusly
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=...
JWT_EXPIRES_IN=1d
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GEMINI_API_KEY=...
REDIS_URL=redis://localhost:6379
```

## Запуск локально

```bash
pnpm install
pnpm prisma migrate dev   # применить миграции
pnpm run start:dev        # дев-сервер с watch-режимом
```

```bash
pnpm run build      # компиляция в dist/
pnpm run start:prod  # production-запуск (node dist/src/main.js)
```

## Тесты

```bash
pnpm run test       # unit-тесты
pnpm run test:e2e   # e2e (test/app.e2e-spec.ts)
pnpm run test:cov   # покрытие
```

## Docker

```bash
docker build -t focusly-backend .
```

Образ собирается на `node:24-alpine`: `pnpm install` → `prisma generate` → `pnpm run build`. При старте контейнера выполняется `prisma migrate deploy`, затем запускается `node dist/src/main.js`. Обычно backend запускается не отдельно, а через `docker-compose.yml` в корне репозитория (см. [корневой README](../README.md)).
