<?php
/**
 * Проверка MySQL + запуск migrate/seed без SSH.
 *
 * КАК ПОЛЬЗОВАТЬСЯ:
 * 1) Откройте файл и ЗАПОЛНИТЕ блок DB_* ниже (из phpMyAdmin Reg.ru).
 * 2) Залейте в www/ ИЛИ backend/public/ через Total Commander.
 * 3) Откройте: https://new.inprokom.ru/db-fix.php
 * 4) Если подключение OK — нажмите ссылки migrate / seed на странице.
 * 5) УДАЛИТЕ файл с FTP после работы!
 */

declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '1');

// ========== ЗАПОЛНИТЕ ЭТИ 4 СТРОКИ (как в phpMyAdmin) ==========
const DB_HOST = 'localhost';
const DB_NAME = 'u0422612_new';
const DB_USER = 'СЮДА_ЛОГИН_MYSQL';
const DB_PASS = 'СЮДА_ПАРОЛЬ_MYSQL';
// ===============================================================

const SETUP_SECRET = 'inprokom2026';

header('Content-Type: text/html; charset=utf-8');

function h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function findBackend(): ?string
{
    foreach ([
        dirname(__DIR__),
        dirname(__DIR__) . '/backend',
        __DIR__ . '/backend',
        __DIR__,
    ] as $path) {
        $real = realpath($path);
        if ($real && is_file($real . '/artisan') && is_file($real . '/vendor/autoload.php')) {
            return $real;
        }
    }
    return null;
}

function writeEnvDb(string $envPath, string $backendRoot): void
{
    if (!is_file($envPath)) {
        $candidates = [
            $backendRoot . '/.env.hosting.example',
            $backendRoot . '/.env.example',
        ];
        $source = null;
        foreach ($candidates as $candidate) {
            if (is_file($candidate)) {
                $source = $candidate;
                break;
            }
        }
        if ($source === null) {
            // Минимальный .env, если примеров нет на сервере
            $env = "APP_NAME=Inprokom\nAPP_ENV=production\nAPP_KEY=\nAPP_DEBUG=false\n"
                . "APP_URL=https://new.inprokom.ru\n"
                . "FRONTEND_URL=https://new.inprokom.ru\n"
                . "CORS_ALLOWED_ORIGINS=https://new.inprokom.ru\n"
                . "LOG_CHANNEL=stack\nLOG_LEVEL=error\n"
                . "SESSION_DRIVER=database\nSESSION_LIFETIME=120\n"
                . "CACHE_STORE=database\nQUEUE_CONNECTION=sync\n"
                . "FILESYSTEM_DISK=local\n"
                . "DB_CONNECTION=mysql\nDB_HOST=localhost\nDB_PORT=3306\n"
                . "DB_DATABASE=\nDB_USERNAME=\nDB_PASSWORD=\n";
        } else {
            $env = file_get_contents($source);
            if ($env === false) {
                throw new RuntimeException('Не удалось прочитать шаблон .env');
            }
        }
        if (file_put_contents($envPath, $env) === false) {
            throw new RuntimeException('Не удалось создать .env (проверьте права на папку backend/)');
        }
    }

    $env = file_get_contents($envPath);
    if ($env === false) {
        throw new RuntimeException('Не удалось прочитать .env');
    }

    $replacements = [
        'DB_CONNECTION' => 'mysql',
        'DB_HOST' => DB_HOST,
        'DB_PORT' => '3306',
        'DB_DATABASE' => DB_NAME,
        'DB_USERNAME' => DB_USER,
        'DB_PASSWORD' => DB_PASS,
    ];

    foreach ($replacements as $key => $value) {
        if (preg_match('/^' . preg_quote($key, '/') . '=.*$/m', $env)) {
            $env = preg_replace('/^' . preg_quote($key, '/') . '=.*$/m', $key . '=' . $value, $env, 1);
        } else {
            $env .= "\n{$key}={$value}\n";
        }
    }

    // Убрать sqlite, если был активен
    $env = preg_replace('/^#?\s*DB_CONNECTION=sqlite.*$/m', 'DB_CONNECTION=mysql', $env);

    if (file_put_contents($envPath, $env) === false) {
        throw new RuntimeException('Не удалось записать .env (проверьте права на файл)');
    }
}

echo '<pre style="font:14px/1.45 Consolas,monospace;white-space:pre-wrap">';
echo "=== db-fix.php ===\n";
echo 'PHP: ' . PHP_VERSION . "\n";
echo 'Файл: ' . __FILE__ . "\n\n";

if (DB_USER === 'СЮДА_ЛОГИН_MYSQL' || DB_PASS === 'СЮДА_ПАРОЛЬ_MYSQL') {
    echo "ОШИБКА: вы не заполнили DB_USER / DB_PASS в начале файла.\n";
    echo "1) Откройте db-fix.php в Total Commander (F4)\n";
    echo "2) Впишите логин и пароль MySQL из панели Reg.ru / phpMyAdmin\n";
    echo "3) Сохраните, залейте снова, обновите эту страницу\n";
    echo "</pre>";
    exit;
}

echo "Пробую подключиться к MySQL...\n";
echo 'Host: ' . DB_HOST . "\n";
echo 'Database: ' . DB_NAME . "\n";
echo 'User: ' . DB_USER . "\n\n";

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
    echo "ПОДКЛЮЧЕНИЕ: OK\n\n";
} catch (Throwable $e) {
    echo "ПОДКЛЮЧЕНИЕ: ОШИБКА\n";
    echo $e->getMessage() . "\n\n";
    echo "Значит логин/пароль/имя базы неверные, либо хост не localhost.\n";
    echo "В панели Reg.ru откройте MySQL и скопируйте данные ещё раз.\n";
    echo "Иногда хост бывает вида u0422612.mysql.ukraine.com.ua — не localhost.\n";
    echo "</pre>";
    exit;
}

$tables = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
echo 'Таблиц в базе сейчас: ' . count($tables) . "\n";
if ($tables) {
    foreach ($tables as $t) {
        $count = (int) $pdo->query('SELECT COUNT(*) FROM `' . str_replace('`', '``', $t) . '`')->fetchColumn();
        echo "  - {$t}: {$count} строк\n";
    }
} else {
    echo "  (пусто — migrate ещё не выполнялся)\n";
}
echo "\n";

$backend = findBackend();
echo 'Laravel backend: ' . ($backend ?: 'НЕ НАЙДЕН') . "\n";
if (!$backend) {
    echo "Положите db-fix.php в www/ (если backend рядом) или в backend/public/\n";
    echo "</pre>";
    exit;
}

$envPath = $backend . '/.env';
echo '.env: ' . (is_file($envPath) ? $envPath : 'НЕТ ФАЙЛА') . "\n\n";

$action = $_GET['action'] ?? '';
$key = $_GET['key'] ?? '';

if ($action === '') {
    echo "Дальше откройте одну из ссылок:\n\n";
    $base = strtok($_SERVER['REQUEST_URI'] ?? 'db-fix.php', '?');
    echo "1) Записать MySQL в .env + migrate + seed:\n";
    echo '   ' . h($base) . '?action=install&key=' . SETUP_SECRET . "\n\n";
    echo "2) Полные сиды (может долго / таймаут):\n";
    echo '   ' . h($base) . '?action=seed&key=' . SETUP_SECRET . "\n\n";
    echo "3) Лёгкие сиды (admin/manager + категории + новости):\n";
    echo '   ' . h($base) . '?action=seed-light&key=' . SETUP_SECRET . "\n\n";
    echo "4) Только товары:\n";
    echo '   ' . h($base) . '?action=seed-products&key=' . SETUP_SECRET . "\n\n";
    echo "Или кликните:\n";
    echo '<a href="?action=install&key=' . SETUP_SECRET . '">[ install = migrate + seed ]</a>' . "\n";
    echo '<a href="?action=seed&key=' . SETUP_SECRET . '">[ полный seed ]</a>' . "\n";
    echo '<a href="?action=seed-light&key=' . SETUP_SECRET . '">[ лёгкий seed ]</a>' . "\n";
    echo '<a href="?action=seed-products&key=' . SETUP_SECRET . '">[ только товары ]</a>' . "\n";
    echo "</pre>";
    exit;
}

if ($key !== SETUP_SECRET) {
    echo "Неверный key. Нужен key=" . SETUP_SECRET . "\n</pre>";
    exit;
}

try {
    echo "Пишу DB_* в .env ...\n";
    writeEnvDb($envPath, $backend);
    echo "OK (.env " . (is_file($envPath) ? 'есть' : 'нет') . ")\n\n";

    // Сброс кэша конфига, иначе Laravel может помнить sqlite
    foreach (glob($backend . '/bootstrap/cache/*.php') ?: [] as $cacheFile) {
        @unlink($cacheFile);
        echo 'Удалён кэш: ' . basename($cacheFile) . "\n";
    }
    echo "\n";

    chdir($backend);
    require $backend . '/vendor/autoload.php';
    $app = require $backend . '/bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();

    // Показать, куда смотрит Laravel
    $cfg = [
        'default' => config('database.default'),
        'host' => config('database.connections.mysql.host'),
        'database' => config('database.connections.mysql.database'),
        'username' => config('database.connections.mysql.username'),
    ];
    echo "Laravel database.default = {$cfg['default']}\n";
    echo "Laravel mysql host = {$cfg['host']}\n";
    echo "Laravel mysql database = {$cfg['database']}\n";
    echo "Laravel mysql username = {$cfg['username']}\n\n";

    if ($cfg['default'] !== 'mysql' || $cfg['database'] !== DB_NAME) {
        echo "ВНИМАНИЕ: Laravel смотрит не туда! Проверьте .env и права записи.\n\n";
    }

    @set_time_limit(300);
    @ini_set('max_execution_time', '300');
    @ini_set('memory_limit', '512M');

    $run = static function ($kernel, string $cmd, array $params = []): void {
        $out = new Symfony\Component\Console\Output\BufferedOutput();
        $code = $kernel->call($cmd, $params, $out);
        $label = $cmd;
        if (isset($params['--class'])) {
            $label .= ' --class=' . $params['--class'];
        }
        echo ">>> php artisan {$label} (exit={$code})\n";
        echo trim($out->fetch()) . "\n\n";
        if (function_exists('ob_flush')) {
            @ob_flush();
        }
        @flush();
        if ($code !== 0) {
            throw new RuntimeException("Команда {$label} завершилась с кодом {$code}");
        }
    };

    $runSeeders = static function ($kernel, $run): void {
        $run($kernel, 'db:seed', ['--force' => true, '--class' => 'Database\\Seeders\\DatabaseSeeder']);
    };

    if ($action === 'install') {
        $envRaw = file_get_contents($envPath) ?: '';
        if (!preg_match('/^APP_KEY=base64:.+/m', $envRaw)) {
            $run($kernel, 'key:generate', ['--force' => true]);
        }
        $run($kernel, 'migrate', ['--force' => true]);
        $runSeeders($kernel, $run);
        $run($kernel, 'storage:link');
    } elseif ($action === 'seed') {
        $runSeeders($kernel, $run);
    } elseif ($action === 'seed-light') {
        // Только пользователи + категории + контент (без большой массы товаров)
        echo "Режим seed-light: admin/manager + категории + новости/вакансии\n\n";
        // Пользователи
        $admin = App\Models\User::updateOrCreate(
            ['login' => 'admin'],
            [
                'email' => 'admin@inprokom.local',
                'password' => 'admin12345',
                'phone' => '+7(999)-000-00-00',
                'rule' => 'success',
                'role' => true,
                'is_active' => true,
                'blocked_at' => null,
            ]
        );
        $manager = App\Models\User::updateOrCreate(
            ['login' => 'manager'],
            [
                'email' => 'manager@inprokom.local',
                'password' => 'manager12345',
                'phone' => '+7(999)-111-11-11',
                'rule' => 'manager',
                'role' => false,
                'is_active' => true,
                'blocked_at' => null,
            ]
        );
        echo "users: admin#{$admin->id}, manager#{$manager->id}\n\n";
        $run($kernel, 'db:seed', ['--force' => true, '--class' => 'Database\\Seeders\\CategorySeeder']);
        $run($kernel, 'db:seed', ['--force' => true, '--class' => 'Database\\Seeders\\ContentSeeder']);
    } elseif ($action === 'seed-products') {
        $run($kernel, 'db:seed', ['--force' => true, '--class' => 'Database\\Seeders\\ProductSeeder']);
    } else {
        echo "Неизвестный action\n</pre>";
        exit;
    }

    // Повторная проверка через PDO
    $tables = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    echo "После выполнения таблиц: " . count($tables) . "\n";
    foreach ($tables as $t) {
        $count = (int) $pdo->query('SELECT COUNT(*) FROM `' . str_replace('`', '``', $t) . '`')->fetchColumn();
        echo "  - {$t}: {$count} строк\n";
    }

    echo "\n=== ГОТОВО ===\n";
    echo "Обновите phpMyAdmin (F5) — таблицы и строки должны появиться.\n";
    echo "УДАЛИТЕ db-fix.php с FTP!\n";
} catch (Throwable $e) {
    echo "ОШИБКА:\n";
    echo $e->getMessage() . "\n";
    echo $e->getFile() . ':' . $e->getLine() . "\n";
    echo $e->getTraceAsString() . "\n";
}

echo '</pre>';
