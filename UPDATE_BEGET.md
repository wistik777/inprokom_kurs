# Обновление сайта на Beget

## 1. Подготовка на компьютере

В корне проекта (PowerShell или Git Bash):

```bash
composer install --no-dev --optimize-autoloader
npm install
npm run build
```

Или двойной клик: `scripts\prepare-beget.bat` (то же самое; если `npm ci` падает с EPERM — используйте `npm install`).

Проверка: есть файлы `vendor/autoload.php` и `public/build/manifest.json`.

Упаковать архив для загрузки:

```bash
bash scripts/pack-beget.sh
```

Получится **`inprokom_beget_update.tar.gz`** (~15–25 МБ) с `app`, `vendor`, `public/build`, миграциями и т.д.

---

## 2. Загрузка на Beget

1. Панель Beget → **Файловый менеджер** (или FTP) → папка сайта, например `/home/логин/ваш-домен.ru/`.
2. Загрузите `inprokom_beget_update.tar.gz`.
3. Распакуйте **в эту же папку** (где лежат `artisan`, `app`, `public`).
4. **Не заменяйте** на сервере:
   - `.env` — настройки БД и почты Beget;
   - `storage/` — логи и загруженные резюме;
   - симлинк `public_html` → `public` (если уже настроен).

Если обновляете без архива — залейте вручную изменённые каталоги:

| Обязательно | Зачем |
|-------------|--------|
| `public/build/` | React/CSS после `npm run build` |
| `app/` | контроллеры, модели, сервисы, почта |
| `routes/` | новые маршруты |
| `resources/` | Blade, JS, CSS |
| `database/migrations/` | новые таблицы |
| `database/seeders/` | начальный контент (опционально) |
| `vendor/` | если менялся `composer.lock` |
| `config/` | почта и пр. |

---

## 3. SSH на Beget (миграции и кэш)

В панели включите SSH, подключитесь и перейдите в папку сайта:

```bash
cd ~/ваш-домен.ru
php8.2 artisan migrate --force
php8.2 artisan config:clear
php8.2 artisan route:clear
php8.2 artisan view:clear
```

### Новые миграции в этом обновлении

Если сайт уже был на Beget раньше, применятся только недостающие:

- `2026_05_19_*` — подписчики newsletter
- `2026_05_20_*` — отклики на вакансии
- `2026_05_21_*` — обратная связь, отзывы, статусы откликов
- `2026_05_22_*` — вопросы по заказам
- `2026_05_23_*` — поля доставки
- `2026_05_24_*` — таблицы `news_posts`, `vacancies`
- `2026_05_25_*` — `published_at` для новостей и вакансий
- `2026_05_26_*` — логи статусов заказов

### Начальный контент (один раз)

Если таблицы новостей/вакансий пустые и нужны демо-материалы с сайта:

```bash
php8.2 artisan db:seed --class=ContentSeeder --force
```

Сидер **не перезаписывает** уже существующие записи.

---

## 4. Почта в `.env` на сервере

Для форм «Обратная связь», откликов, подписки проверьте в `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mail.ru
MAIL_PORT=465
MAIL_ENCRYPTION=ssl
MAIL_USERNAME=ваш@mail.ru
MAIL_PASSWORD=пароль-приложения
MAIL_FROM_ADDRESS=ваш@mail.ru
MAIL_FROM_NAME="НПП Инпроком"
```

После правок: `php8.2 artisan config:clear`.

---

## 5. Проверка после обновления

Откройте в браузере (**Ctrl+F5**):

| Страница | Что проверить |
|----------|----------------|
| `/` | главная, слайдер |
| `/press-center/news` | новости из БД |
| `/vacancies` | вакансии из БД |
| `/contacts` | форма обратной связи |
| `/manager/content` | CMS новостей и вакансий (менеджер) |
| `/manager/inbox` | входящие заявки |
| `/admin/statistics` | статистика, период, подписчики (без топа менеджеров) |
| `/cart`, `/profile` | корзина, доставка, заказы |

Ошибка 500 → `storage/logs/laravel.log`.  
Белая страница → консоль F12, наличие `public/build/manifest.json`.

---

## 6. Права (если 500 после распаковки)

```bash
chmod -R ug+rwx storage bootstrap/cache
```

---

Первичная установка с нуля: **DEPLOY_BEGET.md**.
