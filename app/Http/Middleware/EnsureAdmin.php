<?php

namespace App\Http\Middleware;

use App\Support\StaffAccess;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return redirect()->guest(StaffAccess::loginPath());
        }

        if (! $request->user()->isAdmin()) {
            abort(403);
        }

        return $next($request);
    }
}
