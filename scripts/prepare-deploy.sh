#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEPLOY="$ROOT/deploy"
WWW="$DEPLOY/www"
BACKEND="$DEPLOY/backend"

echo "==> Подготовка deploy-пакета для Reg.ru"

# Frontend .env.production
if [[ ! -f "$ROOT/frontend/.env.production" ]]; then
    cp "$ROOT/frontend/.env.production.example" "$ROOT/frontend/.env.production"
    echo "    Создан frontend/.env.production из example"
fi

echo "==> Сборка frontend"
cd "$ROOT/frontend"
npm install
npm run build

echo "==> Установка backend-зависимостей (production)"
cd "$ROOT/backend"
composer install --optimize-autoloader --no-dev --no-interaction

echo "==> Сборка папки deploy/"
rm -rf "$DEPLOY"
mkdir -p "$WWW" "$BACKEND"

cp -r "$ROOT/frontend/dist/." "$WWW/"

(
    cd "$ROOT/backend"
    tar \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='tests' \
        --exclude='.env' \
        --exclude='.env.*' \
        --exclude='database/database.sqlite' \
        --exclude='storage/logs' \
        --exclude='storage/framework/cache/data' \
        --exclude='storage/framework/sessions' \
        --exclude='storage/framework/views' \
        --exclude='storage/app/public' \
        -cf - .
) | (cd "$BACKEND" && tar -xf -)

mkdir -p \
    "$BACKEND/storage/logs" \
    "$BACKEND/storage/framework/cache/data" \
    "$BACKEND/storage/framework/sessions" \
    "$BACKEND/storage/framework/views" \
    "$BACKEND/storage/app/public" \
    "$BACKEND/bootstrap/cache"

cp "$ROOT/backend/.env.hosting.example" "$BACKEND/.env"

cat > "$DEPLOY/ЗАГРУЗКА.txt" <<'EOF'
ПАПКИ ДЛЯ ЗАГРУЗКИ НА FTP (Total Commander)
==========================================

1. Содержимое deploy/www/  →  в папку www/ на хостинге
   (выделить ВСЁ внутри www, F5 → удалённая www/)

2. Содержимое deploy/backend/  →  в папку backend/ на хостинге
   (создайте backend/ рядом с www/, если её нет)

3. В панели Reg.ru:
   - Поддомен api.new.inprokom.ru → корень: backend/public
   - PHP версия 8.2 или выше

4. Отредактируйте на сервере backend/.env:
   - APP_KEY (сгенерировать: php artisan key:generate)
   - DB_USERNAME и DB_PASSWORD (из панели MySQL)
   - MAIL_* (если нужна почта)

5. На сервере выполните (SSH или терминал в панели):
   cd backend
   php artisan key:generate
   php artisan migrate --force
   php artisan storage:link
   php artisan config:cache
   php artisan route:cache

6. Проверка:
   https://new.inprokom.ru          — сайт
   https://api.new.inprokom.ru/up     — API жив
   https://api.new.inprokom.ru/api/v1/news — JSON
   https://new.inprokom.ru/inprokom-staff  — вход сотрудников
EOF

echo ""
echo "Готово! Пакет для FTP: $DEPLOY"
echo "Читайте: $DEPLOY/ЗАГРУЗКА.txt"
