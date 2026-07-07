# Развёртывание на Beget

На **обычном** тарифе Beget **нет** пункта «корневая директория → public» в панели. Домен всегда смотрит на папку **`public_html`** у сайта. Это нормально — Laravel на Beget ставят **через симлинк**, как в [официальной инструкции Beget](https://beget.com/ru/kb/how-to/web-apps/ustanovka-php-frejmvorkov).

**Не переименовывайте** `public` в `public_html` — нужна папка `public` и отдельная ссылка `public_html` → `public`.

---

## Перед загрузкой (на компьютере)

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build
```

Или запустите `scripts\prepare-beget.bat`.

В архиве на сервер **обязательно**:

| Есть на сервере | Зачем |
|-----------------|--------|
| `vendor/` | PHP (в git нет) |
| `public/build/manifest.json` | React/CSS после `npm run build` |
| `.env` | создаёте на сервере |

---

## Способ 1 (основной): весь проект в папке сайта + симлинк

Структура после настройки:

```
/home/ВАШ_ЛОГИН/имя-сайта.ru/     ← папка сайта в Beget (как в панели «Сайты»)
├── app/
├── artisan
├── bootstrap/
├── config/
├── database/
├── public/          ← остаётся с именем public
│   ├── index.php
│   ├── .htaccess
│   ├── build/
│   └── img/
├── resources/
├── routes/
├── storage/
├── vendor/
├── .env
└── public_html  →  симлинк на public (не копия, не переименование)
```

### Шаги

1. **Сайты** в панели Beget → создайте сайт / привяжите домен (появится папка, например `ваш-домен.ru`).

2. В файловом менеджере откройте **эту** папку сайта (не только `public_html`).

3. Распакуйте **весь** Laravel-проект **сюда** (рядом с `public_html`), чтобы рядом лежали `artisan`, `app/`, `public/`, `vendor/`.

4. Удалите **стандартную** пустую папку `public_html` (именно папку сайта, не папку `public` внутри проекта).

5. По **SSH** (панель → SSH, или терминал):

   ```bash
   cd ~/ваш-домен.ru
   # если public_html ещё есть:
   rm -rf public_html
   ln -s public public_html
   ls -la public_html
   ```

   Должно показать, что `public_html` → `public`.

6. PHP **8.2** или **8.3** (панель → PHP для сайта).

7. Файл `.env` в корне (рядом с `artisan`) — образец: `deploy/beget/.env.example`.

8. Команды:

   ```bash
   cd ~/ваш-домен.ru
   php artisan key:generate
   php8.2 artisan migrate --force
   php artisan db:seed --force
   php artisan storage:link
   chmod -R ug+rwx storage bootstrap/cache
   ```

### Если SSH нет

Симлинк через файловый менеджер Beget часто **нельзя** создать. Варианты:

- включить SSH в панели (на Beget обычно доступен);
- или **способ 2** ниже (копия `public` + особый `index.php`).

---

## Способ 2: без симлинка (только `public_html`)

Если симлинк сделать нельзя:

1. Проект лежит, например, в `/home/логин/inprokom_kurs/` (с `vendor`, `.env`).

2. В `/home/логин/ваш-домен.ru/public_html/` положите **содержимое** папки `public/`:
   - `index.php`, `.htaccess`, `build/`, `img/`.

3. Замените `public_html/index.php` файлом `deploy/beget/index.php` и укажите путь:

   ```php
   define('LARAVEL_ROOT', '/home/логин/inprokom_kurs');
   ```

   Путь скопируйте из файлового менеджера (полный, с `/home/...`).

4. `.env` и `vendor` остаются **вне** `public_html`.

---

## Частые ошибки

| Что сделали | Результат |
|-------------|-----------|
| Весь проект в `public_html` | Нет нормального входа, 403/500, `.env` в открытой зоне |
| Переименовали `public` → `public_html` | Сломались пути в `index.php` (`../vendor`) |
| Архив без `vendor` / без `build` | 500 или белая страница |
| Два разных `public_html` (у домена и внутри проекта) | Домен открывает не тот каталог |

---

## MySQL

Панель → **MySQL** → БД и пользователь → в `.env` `DB_*` → `php artisan migrate --force`.

---

## Диагностика

| Симптом | Что проверить |
|---------|----------------|
| Список папок | В `public_html` нет `index.php` или симлинк не создан |
| 500 | `storage/logs/laravel.log`, есть ли `vendor`, `APP_KEY`, миграции |
| Белая страница | `public/build/manifest.json`, консоль F12 |
| 404 | `.htaccess` в `public_html` |

В `.env` на время: `APP_DEBUG=true`.

---

## Чеклист

- [ ] `vendor` и `public/build` загружены
- [ ] Проект в папке сайта, `public` **не переименован**
- [ ] `public_html` — симлинк на `public` (способ 1) или витрина + `deploy/beget/index.php` (способ 2)
- [ ] PHP 8.2+, `.env`, `migrate`
- [ ] Права на `storage` и `bootstrap/cache`

Шаблоны: `deploy/beget/index.php`, `deploy/beget/.env.example`
