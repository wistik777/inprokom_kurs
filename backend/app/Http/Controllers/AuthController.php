<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\StaffAccess;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
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
                throw ValidationException::withMessages([
                    'login' => ['Аккаунт заблокирован. Обратитесь к администратору системы.'],
                ]);
            }

            $admin->role = true;
            $admin->save();

            Auth::login($admin);
            $request->session()->regenerate();

            return $this->authResponse($admin);
        }

        $existingUser = User::query()->where('login', $validated['login'])->first();
        if ($existingUser && ! $existingUser->isActive()) {
            throw ValidationException::withMessages([
                'login' => ['Аккаунт заблокирован. Обратитесь к администратору системы.'],
            ]);
        }

        if (Auth::attempt(['login' => $validated['login'], 'password' => $validated['password'], 'is_active' => true])) {
            $user = Auth::user();

            if (! StaffAccess::isStaff($user)) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                throw ValidationException::withMessages([
                    'login' => ['Неверный логин или пароль'],
                ]);
            }

            $request->session()->regenerate();

            return $this->authResponse($user);
        }

        throw ValidationException::withMessages([
            'login' => ['Неверный логин или пароль'],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['data' => null]);
        }

        return response()->json([
            'data' => $this->serializeUser($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Вы вышли из системы']);
    }

    private function authResponse(User $user): JsonResponse
    {
        return response()->json([
            'message' => 'Вход выполнен',
            'data' => $this->serializeUser($user),
            'redirect' => $user->isAdmin() ? '/admin' : '/manager',
        ]);
    }

    private function serializeUser(User $user): array
    {
        return [
            'id' => $user->id,
            'login' => $user->login,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->isAdmin() ? 'admin' : (($user->rule ?? null) === 'manager' ? 'manager' : 'user'),
        ];
    }
}
