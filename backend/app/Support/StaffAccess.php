<?php

namespace App\Support;

use App\Models\User;

class StaffAccess
{
    public static function loginPath(): string
    {
        return '/'.ltrim((string) config('staff.login_path', 'inprokom-staff'), '/');
    }

    public static function isStaff(User $user): bool
    {
        return $user->isAdmin() || ($user->rule ?? null) === 'manager';
    }
}
