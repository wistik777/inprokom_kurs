<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (app()->environment('local')) {
        $frontendUrl = rtrim((string) env('FRONTEND_URL', 'http://localhost:5173'), '/');

        return response(<<<HTML
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inprokom API</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 640px; margin: 48px auto; padding: 0 20px; color: #222; line-height: 1.6; }
        h1 { color: #FA4234; font-size: 28px; }
        code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; }
        a { color: #FA4234; }
    </style>
</head>
<body>
    <h1>Inprokom API</h1>
    <p>Вы открыли <strong>серверную часть</strong> (Laravel API). Это не сайт — здесь только JSON-ответы для фронтенда.</p>
    <p>Чтобы увидеть сайт, запустите фронтенд и откройте:</p>
    <p><a href="{$frontendUrl}">{$frontendUrl}</a></p>
    <p>API: <code>/api/v1</code> · документация маршрутов: <code>php artisan route:list --path=api</code></p>
</body>
</html>
HTML, 200, ['Content-Type' => 'text/html; charset=UTF-8']);
    }

    return response()->json([
        'name' => 'Inprokom API',
        'version' => 'v1',
        'docs' => '/api/v1',
    ]);
});
