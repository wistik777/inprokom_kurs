<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $r){
        $validated = $r->validate([
            'login' => 'exists:users,login|required',
            'password' => 'required',
        ],[
            'login.exists' => 'Неверный логин или пароль',
        ]);

        if(Auth::attempt(['login' => $validated['login'], 'password' => $validated['password']])){
            return redirect('/');
        }

        return back()->withErrors(['password' => 'Неверный логин или пароль']);
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
}
