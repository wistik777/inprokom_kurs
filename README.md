# НПП Инпроком

Проект разделён на две части:

| Часть | Папка | Назначение |
|-------|-------|------------|
| Backend | `backend/` | Laravel **только API** (JSON), без Blade views |
| Frontend | `frontend/` | React SPA (Vite + React Router) |

## Локальный запуск

### 1. Backend (Laravel API)

```bash
cd backend
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

API: `http://127.0.0.1:8000/api/v1`

### 2. Frontend (React SPA)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Сайт: `http://localhost:5173` (или другой порт, если 5173 занят — смотрите вывод `npm run dev`)

> **Важно:** `http://localhost:8000` — это только **API**, не сайт. JSON на корне `/` — нормальное поведение API-сервера.

Vite проксирует `/api` и `/storage` на Laravel (`VITE_API_PROXY_TARGET`).

## Связь frontend ↔ backend

- Запросы через `frontend/src/api/client.js` на `/api/v1/*`
- Авторизация сотрудников — session cookie (`credentials: 'include'`)
- CORS: `backend/config/cors.php` (`CORS_ALLOWED_ORIGINS`)
- Секретный вход: `/{STAFF_LOGIN_PATH}` (по умолчанию `/inprokom-staff`)

## Production

1. `cd frontend && npm run build` → `frontend/dist/`
2. Статику — на nginx/Apache или CDN
3. Backend — отдельный домен, например `api.inprokom.ru`
4. Frontend `.env`: `VITE_API_URL=https://api.inprokom.ru/api/v1`
5. Backend `.env`: `CORS_ALLOWED_ORIGINS=https://www.inprokom.ru`

## API

- `GET /api/v1/news`, `/products`, `/vacancies` — публичный контент
- `POST /api/v1/contact-messages`, `/vacancy-applications`, `/newsletter/subscribe` — формы
- `POST /api/v1/auth/login`, `GET /auth/me`, `POST /auth/logout` — staff auth
- `GET /api/v1/admin/*` — админ-панель
- `GET /api/v1/manager/*` — панель менеджера
