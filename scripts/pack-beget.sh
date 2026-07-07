#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ARCHIVE="inprokom_beget_update.tar.gz"

if [[ ! -f public/build/manifest.json ]]; then
    echo "[ОШИБКА] Нет public/build/manifest.json — сначала: npm run build"
    exit 1
fi

if [[ ! -f vendor/autoload.php ]]; then
    echo "[ОШИБКА] Нет vendor/ — сначала: composer install --no-dev --optimize-autoloader"
    exit 1
fi

echo "=== Архив для обновления на Beget ==="
echo "Файл: $ARCHIVE"
echo

tar -czf "$ARCHIVE" \
    app \
    bootstrap \
    config \
    database \
    deploy \
    public/build \
    resources \
    routes \
    vendor \
    artisan \
    composer.json \
    composer.lock

SIZE=$(du -h "$ARCHIVE" | cut -f1)
echo "OK: $ARCHIVE ($SIZE)"
echo
echo "Загрузите архив на Beget, распакуйте в папку сайта (рядом с artisan)."
echo "Не перезаписывайте .env и storage/ на сервере."
echo "Подробно: UPDATE_BEGET.md"
