<?php
/**
 * Одноразовый установщик Laravel без SSH.
 *
 * 1) Откройте этот файл в блокноте.
 * 2) Замените SETUP_SECRET на свой код (например inprokom2026).
 * 3) Залейте в папку, где лежит index.php Laravel (обычно backend/public/).
 *    Если API и сайт на одном домене — можно положить рядом с index.html в www/,
 *    скрипт сам поищет backend/.
 * 4) Сначала откройте проверку (без секрета):
 *      https://new.inprokom.ru/hosting-setup.php?check=1
 *    или
 *      https://api.new.inprokom.ru/hosting-setup.php?check=1
 * 5) Потом установка + сиды:
 *      .../hosting-setup.php?key=ВАШ_КОД&seed=1
 *    Только сиды:
 *      .../hosting-setup.php?key=ВАШ_КОД&action=seed
 * 6) СРАЗУ удалите файл с FTP!
 */

declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');

// === ЗАМЕНИТЕ НА СВОЙ СЕКРЕТ ===
const SETUP_SECRET = 'CHANGE_ME_TO_SECRET';

header('Content-Type: text/plain; charset=utf-8');

function println(string $line = ''): void
{
    echo $line . "\n";
}

function findBackendRoot(): ?string
{
    $candidates = [
        dirname(__DIR__),                 // .../backend  если файл в backend/public/
        __DIR__,                          // если файл в корне backend/
        dirname(__DIR__) . '/backend',    // если файл в www/, backend рядом
        dirname(__DIR__, 2) . '/backend', // www/public → ../backend
        __DIR__ . '/backend',
        dirname(__DIR__) . '/../backend',
    ];

    $seen = [];
    foreach ($candidates as $path) {
        $real = realpath($path);
        if ($real === false || isset($seen[$real])) {
            continue;
        }
        $seen[$real] = true;
        if (is_file($real . '/artisan') && is_file($real . '/vendor/autoload.php')) {
            return $real;
        }
    }

    return null;
}

function envLooksFilled(string $envPath): array
{
    $raw = @file_get_contents($envPath) ?: '';
    $get = static function (string $key) use ($raw): string {
        if (preg_match('/^' . preg_quote($key, '/') . '=(.*)$/m', $raw, $m)) {
            return trim($m[1], " \t\"'");
        }
        return '';
    };

    return [
        'APP_KEY' => $get('APP_KEY') !== '',
        'DB_CONNECTION' => $get('DB_CONNECTION'),
        'DB_HOST' => $get('DB_HOST'),
        'DB_DATABASE' => $get('DB_DATABASE'),
        'DB_USERNAME' => $get('DB_USERNAME'),
        'DB_PASSWORD_SET' => $get('DB_PASSWORD') !== '' && $get('DB_PASSWORD') !== 'ВАШ_ПАРОЛЬ_MYSQL',
        'DB_USERNAME_OK' => $get('DB_USERNAME') !== '' && $get('DB_USERNAME') !== 'ВАШ_ПОЛЬЗОВАТЕЛЬ_MYSQL',
    ];
}

$checkOnly = isset($_GET['check']);
$key = (string) ($_GET['key'] ?? '');
$action = (string) ($_GET['action'] ?? 'setup');
$withSeed = isset($_GET['seed']) && $_GET['seed'] !== '0' && $_GET['seed'] !== 'false';

println('=== hosting-setup диагностика ===');
println('Файл: ' . __FILE__);
println('PHP: ' . PHP_VERSION);
println('URL: ' . ($_SERVER['REQUEST_URI'] ?? ''));
println();

$backendRoot = findBackendRoot();
if ($backendRoot === null) {
    http_response_code(500);
    println('ОШИБКА: Laravel backend не найден рядом с этим файлом.');
    println('Положите hosting-setup.php в одну из папок:');
    println('  - backend/public/  (рядом с index.php Laravel)');
    println('  - www/             (если папка backend лежит рядом с www)');
    println();
    println('Сейчас __DIR__ = ' . __DIR__);
    println('Родитель = ' . dirname(__DIR__));
    exit;
}

$envPath = $backendRoot . '/.env';
println('Backend найден: ' . $backendRoot);
println('.env: ' . (is_file($envPath) ? 'есть' : 'НЕТ'));
println('vendor: ' . (is_file($backendRoot . '/vendor/autoload.php') ? 'есть' : 'НЕТ'));

if (is_file($envPath)) {
    $info = envLooksFilled($envPath);
    println('DB_CONNECTION: ' . ($info['DB_CONNECTION'] ?: '(пусто)'));
    println('DB_HOST: ' . ($info['DB_HOST'] ?: '(пусто)'));
    println('DB_DATABASE: ' . ($info['DB_DATABASE'] ?: '(пусто)'));
    println('DB_USERNAME заполнен: ' . ($info['DB_USERNAME_OK'] ? 'да' : 'НЕТ — откройте .env и укажите логин MySQL'));
    println('DB_PASSWORD заполнен: ' . ($info['DB_PASSWORD_SET'] ? 'да' : 'НЕТ — укажите пароль MySQL'));
    println('APP_KEY задан: ' . ($info['APP_KEY'] ? 'да' : 'нет'));
}
println();

if ($checkOnly) {
    println('Режим check=1 — команды не запускались.');
    println('Если выше всё ОК — откройте:');
    println('  ?key=ВАШ_СЕКРЕТ&seed=1');
    println('или только сиды:');
    println('  ?key=ВАШ_СЕКРЕТ&action=seed');
    exit;
}

if (SETUP_SECRET === 'CHANGE_ME_TO_SECRET') {
    http_response_code(403);
    println('ОШИБКА: вы не заменили SETUP_SECRET в файле.');
    println('1) Скачайте/откройте hosting-setup.php');
    println('2) Строку const SETUP_SECRET = \'CHANGE_ME_TO_SECRET\';');
    println('   замените на const SETUP_SECRET = \'inprokom2026\';');
    println('3) Снова залейте файл на FTP');
    println('4) Откройте URL с ?key=inprokom2026&seed=1');
    exit;
}

if ($key === '' || !hash_equals(SETUP_SECRET, $key)) {
    http_response_code(403);
    println('ОШИБКА: неверный или пустой key.');
    println('Пример: hosting-setup.php?key=ВАШ_СЕКРЕТ&seed=1');
    exit;
}

if (!is_file($envPath)) {
    http_response_code(500);
    println('ОШИБКА: нет файла .env в ' . $envPath);
    exit;
}

$info = envLooksFilled($envPath);
if (!$info['DB_USERNAME_OK'] || !$info['DB_PASSWORD_SET']) {
    http_response_code(500);
    println('ОШИБКА: в backend/.env всё ещё стоят заглушки DB_USERNAME / DB_PASSWORD.');
    println('Откройте backend/.env через Total Commander (F4) и впишите данные из phpMyAdmin Reg.ru.');
    exit;
}

if (version_compare(PHP_VERSION, '8.2.0', '<')) {
    http_response_code(500);
    println('ОШИБКА: нужен PHP 8.2+, сейчас ' . PHP_VERSION);
    println('В панели Reg.ru смените версию PHP для сайта/поддомена.');
    exit;
}

try {
    chdir($backendRoot);
    require $backendRoot . '/vendor/autoload.php';
    $app = require $backendRoot . '/bootstrap/app.php';
    /** @var Illuminate\Contracts\Console\Kernel $kernel */
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();

    // Проверка БД
    try {
        Illuminate\Support\Facades\DB::connection()->getPdo();
        $dbName = Illuminate\Support\Facades\DB::connection()->getDatabaseName();
        println('Подключение к MySQL: OK (' . $dbName . ')');
        println();
    } catch (Throwable $e) {
        http_response_code(500);
        println('ОШИБКА подключения к MySQL:');
        println($e->getMessage());
        println();
        println('Проверьте в .env: DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD');
        println('На Reg.ru хост часто localhost, логин/пароль — из раздела MySQL, не FTP.');
        exit;
    }

    $run = static function ($kernel, string $command, array $params = []): int {
        $buffer = new Symfony\Component\Console\Output\BufferedOutput();
        $exit = $kernel->call($command, $params, $buffer);
        println(">>> php artisan {$command} (exit={$exit})");
        println(trim($buffer->fetch()));
        println();
        return $exit;
    };

    if ($action === 'seed') {
        $code = $run($kernel, 'db:seed', ['--force' => true]);
        println($code === 0 ? '=== СИДЫ ГОТОВЫ ===' : '=== СИДЫ ЗАВЕРШИЛИСЬ С ОШИБКОЙ ===');
        println('Удалите hosting-setup.php с FTP!');
        exit;
    }

    $envRaw = file_get_contents($envPath) ?: '';
    if (!preg_match('/^APP_KEY=.+/m', $envRaw) || preg_match('/^APP_KEY=\s*$/m', $envRaw)) {
        $run($kernel, 'key:generate', ['--force' => true]);
    } else {
        println('APP_KEY уже задан — пропускаю key:generate');
        println();
    }

    $run($kernel, 'migrate', ['--force' => true]);

    if ($withSeed || $action === 'seed') {
        $run($kernel, 'db:seed', ['--force' => true]);
    } else {
        println('Сиды НЕ запускались. Добавьте &seed=1 или &action=seed');
        println();
    }

    $run($kernel, 'storage:link');
    $run($kernel, 'config:cache');
    $run($kernel, 'route:cache');

    println('=== ГОТОВО ===');
    println('Удалите hosting-setup.php с FTP!');
} catch (Throwable $e) {
    http_response_code(500);
    println('ФАТАЛЬНАЯ ОШИБКА:');
    println($e->getMessage());
    println($e->getFile() . ':' . $e->getLine());
    println($e->getTraceAsString());
}
