<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\EnsureManager;
use App\Http\Middleware\EnsureUserIsActive;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: 'api',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            EnsureUserIsActive::class,
        ]);

        $middleware->api(append: [
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        ]);

        $middleware->alias([
            'admin' => EnsureAdmin::class,
            'manager' => EnsureManager::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
