<?php

/**
 * index.php для Beget (схема B): лежит в domain.ru/public_html/
 * Laravel — в отдельной папке. Укажите абсолютный путь с хостинга.
 *
 * Пример: /home/u1234567/inprokom_kurs
 */
define('LARAVEL_ROOT', '/home/ВАШ_ЛОГИН/inprokom_kurs');

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (file_exists($maintenance = LARAVEL_ROOT.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

require LARAVEL_ROOT.'/vendor/autoload.php';

/** @var Application $app */
$app = require_once LARAVEL_ROOT.'/bootstrap/app.php';

$app->handleRequest(Request::capture());
