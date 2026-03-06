<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    private function ensureAdmin(): void
    {
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            abort(403);
        }
    }

    public function index()
    {
        $this->ensureAdmin();

        $managers = User::query()
            ->where('rule', 'manager')
            ->latest('id')
            ->get(['id', 'login', 'email', 'phone', 'created_at']);

        return view('admin.index', [
            'managers' => $managers->map(fn ($manager) => [
                'id' => $manager->id,
                'login' => $manager->login,
                'email' => $manager->email,
                'phone' => $manager->phone,
                'created_at' => optional($manager->created_at)->format('d.m.Y H:i'),
            ]),
            'success' => session('success'),
            'oldValues' => old(),
        ]);
    }

    public function createManager()
    {
        $this->ensureAdmin();

        return redirect('/admin');
    }

    public function storeManager(Request $request)
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'login' => 'required|min:6|unique:users,login',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'phone' => 'required|regex:/^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/',
        ], [
            'login.min' => 'Логин должен быть не менее 6 символов',
            'login.unique' => 'Такой логин уже существует',
            'email.email' => 'Почта некорректна',
            'email.unique' => 'Такая почта уже существует',
            'password.min' => 'Пароль должен быть не менее 6 символов',
            'phone.regex' => 'Телефон должен соответствовать +7(XXX)-XXX-XX-XX',
        ]);

        User::create([
            'login' => $validated['login'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'phone' => $validated['phone'],
            'rule' => 'manager',
            'role' => false,
        ]);

        return redirect('/admin')->with('success', 'Менеджер успешно создан');
    }

}
