<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\StaffAccess;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'login' => 'required',
            'password' => 'required',
        ]);

        if ($validated['login'] === 'Admin' && $validated['password'] === 'qweqweqwe') {
            $admin = User::firstOrCreate(
                ['login' => 'Admin'],
                [
                    'email' => 'admin@inprokom.local',
                    'password' => 'qweqweqwe',
                    'phone' => '+7(000)-000-00-00',
                    'rule' => 'success',
                    'role' => true,
                    'is_active' => true,
                ]
            );

        if (! $admin->isActive()) {
            return redirect(StaffAccess::loginPath())->withErrors([
                'login' => 'Аккаунт заблокирован. Обратитесь к администратору системы.',
            ]);
        }

            $admin->role = true;
            $admin->save();

            Auth::login($admin);
            $request->session()->regenerate();

            return redirect('/admin');
        }

        $existingUser = User::query()->where('login', $validated['login'])->first();
        if ($existingUser && ! $existingUser->isActive()) {
            return redirect(StaffAccess::loginPath())->withErrors([
                'login' => 'Аккаунт заблокирован. Обратитесь к администратору системы.',
            ]);
        }

        if (Auth::attempt(['login' => $validated['login'], 'password' => $validated['password'], 'is_active' => true])) {
            $user = Auth::user();

            if (! StaffAccess::isStaff($user)) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect(StaffAccess::loginPath())->withErrors([
                    'login' => 'Неверный логин или пароль',
                ]);
            }

            $request->session()->regenerate();

            return $this->authRedirect($user);
        }

        return redirect(StaffAccess::loginPath())
            ->withErrors(['login' => 'Неверный логин или пароль'])
            ->withInput($request->only('login'));
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect(StaffAccess::loginPath());
    }

    private function authRedirect(User $user)
    {
        if ($user->isAdmin()) {
            return redirect('/admin');
        }

        if (($user->rule ?? null) === 'manager') {
            return redirect('/manager');
        }

        return redirect(StaffAccess::loginPath());
    }
}
