<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function login(Request $r){
        $validated = $r->validate([
            'login' => 'required',
            'password' => 'required',
        ]);
        $guestSessionId = $r->session()->getId();

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

            if (!$admin->isActive()) {
                return back()->withErrors(['login' => 'Аккаунт заблокирован. Обратитесь к администратору системы.']);
            }

            $admin->role = true;
            $admin->save();

            Auth::login($admin);
            $this->mergeGuestCartIntoUser($guestSessionId, $admin->id);
            $r->session()->regenerate();

            return redirect('/admin');
        }

        $existingUser = User::query()->where('login', $validated['login'])->first();
        if ($existingUser && !$existingUser->isActive()) {
            return back()->withErrors(['login' => 'Аккаунт заблокирован. Обратитесь к администратору системы.']);
        }

        if(Auth::attempt(['login' => $validated['login'], 'password' => $validated['password'], 'is_active' => true])){
            $user = Auth::user();
            $this->mergeGuestCartIntoUser($guestSessionId, $user->id);
            $r->session()->regenerate();
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
        $guestSessionId = $r->session()->getId();
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
            $user = User::create($validate);
            Auth::login($user);
            $this->mergeGuestCartIntoUser($guestSessionId, $user->id);
            $r->session()->regenerate();
            return redirect('/');
        }

    }

    public function logout(Request $r){
        Auth::logout();
        $r->session()->invalidate();
        $r->session()->regenerateToken();

        return redirect('/auth');
    }

    public function updateProfile(Request $request)
    {
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Требуется авторизация',
            ], 401);
        }

        $user = auth()->user();

        $validated = $request->validate([
            'login' => [
                'required',
                'min:6',
                Rule::unique('users', 'login')->ignore($user->id),
            ],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'phone' => 'required|regex:/^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/',
        ], [
            'login.min' => 'Логин должен быть не менее 6 символов',
            'login.unique' => 'Такой логин уже существует',
            'email.email' => 'Почта некорректна',
            'email.unique' => 'Такая почта уже существует',
            'phone.regex' => 'Телефон должен соответствовать +7(XXX)-XXX-XX-XX',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Данные профиля обновлены',
            'user' => $user->only(['id', 'login', 'email', 'phone']),
        ]);
    }

    private function mergeGuestCartIntoUser(string $guestSessionId, int $userId): void
    {
        $guestCart = Cart::query()
            ->with('items')
            ->where('session_id', $guestSessionId)
            ->where('status', 'active')
            ->first();

        if (!$guestCart || $guestCart->items->isEmpty()) {
            return;
        }

        $userCart = Cart::query()->firstOrCreate([
            'user_id' => $userId,
            'status' => 'active',
        ]);

        foreach ($guestCart->items as $guestItem) {
            $existingItem = CartItem::query()
                ->where('cart_id', $userCart->id)
                ->where('product_id', $guestItem->product_id)
                ->first();

            if ($existingItem) {
                $existingItem->quantity += $guestItem->quantity;
                $existingItem->save();
                continue;
            }

            CartItem::create([
                'cart_id' => $userCart->id,
                'product_id' => $guestItem->product_id,
                'quantity' => $guestItem->quantity,
                'price_at_add' => $guestItem->price_at_add,
            ]);
        }

        $guestCart->delete();
    }
}
