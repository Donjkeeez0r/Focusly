# Focusly — Frontend

SPA на React + Vite — клиент для Focusly: учёт рабочих сессий, управление блок-листом сайтов, статистика и AI-отчёты о продуктивности.

## Стек

- **React 19** + **TypeScript**
- **Vite 6** — сборка и дев-сервер
- **React Router 7** — клиентский роутинг
- **Tailwind CSS 3** — стилизация
- **Recharts** — графики (pie/heatmap)
- **lucide-react** — иконки

## Структура (`src/`)

```
api/         клиент для backend API (client.ts, endpoints.ts)
context/     глобальный стейт (AuthContext, ThemeContext)
hooks/       кастомные хуки (useAsync — загрузка асинхронных данных)
components/  переиспользуемые компоненты (AppLayout, ProtectedRoute)
pages/       страницы приложения
styles/      глобальные стили
```

### Страницы (`src/pages`)
| Страница | Назначение |
|---|---|
| `LoginPage` | Вход через Google OAuth |
| `AuthCallbackPage` | Обработка OAuth-редиректа, сохранение токена |
| `DashboardPage` | Главный экран |
| `SessionsPage` | История и управление рабочими сессиями |
| `BlocklistPage` | Управление заблокированными сайтами |
| `CategoriesPage` | CRUD категорий |
| `LogsPage` | Просмотр тайм-логов |
| `AiReportsPage` | AI-отчёты о продуктивности |

### API-слой (`src/api`)

- `client.ts` — обёртка над `fetch`: базовый URL `VITE_API_BASE_URL` (по умолчанию `http://localhost:3000`), автоматически добавляет `Authorization: Bearer <token>` из `localStorage.access_token`, при ответе `401` шлёт событие `auth:expired` и разлогинивает пользователя.
- `endpoints.ts` — типизированные функции для каждого backend-эндпоинта (`api.me()`, `api.categories()`, `api.startSession()`, `api.weeklyPie()`, `api.generateReport()` и т.д.).

### Контексты (`src/context`)

- **AuthContext** — текущий пользователь, токен, `loginWithGoogle()`, `completeLogin(token)`, `logout()`, `refreshUser()`.
- **ThemeContext** — светлая/тёмная тема, persist в `localStorage`, применяется через класс на `document.documentElement`.

## Переменные окружения

Создайте `.env` в `frontend/`:

```
VITE_API_BASE_URL=http://localhost:3000
```

## Запуск локально

Требуется работающий backend (см. [backend/README.md](../backend/README.md)).

```bash
pnpm install
pnpm run dev       # дев-сервер на http://localhost:5173
```

```bash
pnpm run build     # tsc -b && vite build → dist/
pnpm run preview   # просмотр собранного билда
```

## Docker / Production

Production-образ — двухстадийная сборка: `node:24-alpine` (build, `pnpm install` + `pnpm run build`) → статика копируется в `nginx:stable-alpine`.

Конфигурация nginx (`nginx.conf`):
- SPA-роутинг — fallback на `index.html` для всех путей;
- проксирование `/api/` → `http://backend:3000/` (имя сервиса `backend` из docker-compose).

Контейнер слушает порт `80`. Обычно запускается не отдельно, а через `docker-compose.yml` в корне репозитория — см. [корневой README](../README.md).
