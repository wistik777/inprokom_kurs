<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $r){
        $validated = $r->validate([
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
                ]
            );

            $admin->role = true;
            $admin->save();

            Auth::login($admin);
            $r->session()->regenerate();

            return redirect('/admin');
        }

        if(Auth::attempt(['login' => $validated['login'], 'password' => $validated['password']])){
            $r->session()->regenerate();

            $user = Auth::user();
            if ($user?->isAdmin()) {
                return redirect('/admin');
            }

            if (($user?->rule ?? null) === 'manager') {
                return redirect('/manager');
            }

            return redirect('/');
        }

        return back()->withErrors(['login' => 'Неверный логин или пароль']);
    }

    public function register(Request $r){
        $validate = $r -> validate([
            'login' => 'min:6|unique:users|required',
            'password' => 'min:6|required',
            'phone' => 'regex:/^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/|required',
            'email' => 'email|unique:users|required',
            'rule' => 'required|in:success',
        ],[
            'login.min' => 'Логин должен быть не менее 6 символов',
            'login.unique' => 'Такой логин уже существует',
            'password.min' => 'Пароль должен быть не менее 6 символов',
            'phone.regex' => 'Телефон должен соответствовать +7(XXX)-XXX-XX-XX',
            'email.email' => 'Почта некорректна',
            'email.unique' => 'Такая почта уже существует',
            'rule.in' => 'Необходимо принять условия пользовательского соглашения'
        ]);

        if($validate){
            Auth::login(User::create($validate));
            return redirect('/');
        }

    }

    public function logout(Request $r){
        Auth::logout();
        $r->session()->invalidate();
        $r->session()->regenerateToken();

        return redirect('/auth');
    }
}
