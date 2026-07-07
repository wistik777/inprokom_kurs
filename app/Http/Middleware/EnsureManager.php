<?php

namespace App\Http\Middleware;

use App\Support\StaffAccess;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureManager
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return redirect()->guest(StaffAccess::loginPath());
        }

        if ($request->user()->rule !== 'manager') {
            abort(403);
        }

        return $next($request);
    }
}
