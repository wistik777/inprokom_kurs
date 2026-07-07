<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureManager
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return response()->json(['message' => 'Требуется авторизация'], 401);
        }

        if ($request->user()->rule !== 'manager') {
            return response()->json(['message' => 'Доступ запрещён'], 403);
        }

        return $next($request);
    }
}
