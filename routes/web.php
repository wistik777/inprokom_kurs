<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ManagerController;
use App\Models\Product;

Route::get('/', function () {
    return view('placeholder', ['title' => 'Главная']);
});

Route::get('/auth', function () {
    return view('auth');
});

Route::get('/catalog', function () {
    $products = Product::query()
        ->with(['categories:id,name,slug,parent_id'])
        ->where('is_active', true)
        ->latest('id')
        ->get();

    return view('catalog', compact('products'));
});

Route::get('/catalog/{product}', function (Product $product) {
    $product->load(['categories:id,name,slug,parent_id']);

    return view('product', compact('product'));
})->whereNumber('product');

Route::get('/cart', function () {
    return view('cart');
});

Route::get('/profile', function () {
    if (!auth()->check()) {
        return redirect('/auth');
    }

    return view('profile');
});

Route::get('/admin', [AdminController::class, 'index']);
Route::get('/admin/create-manager', [AdminController::class, 'createManager']);
Route::post('/admin/create-manager', [AdminController::class, 'storeManager']);
Route::get('/manager', [ManagerController::class, 'index']);
Route::post('/manager/products', [ManagerController::class, 'storeProduct']);
Route::delete('/manager/products/{product}', [ManagerController::class, 'destroyProduct']);

Route::get('/about-company', function () {
    return view('placeholder', ['title' => 'О компании']);
});

Route::get('/press-center', function () {
    return view('placeholder', ['title' => 'Пресс-центр']);
});

Route::get('/contacts', function () {
    return view('placeholder', ['title' => 'Контакты']);
});

Route::get('/vacancies', function () {
    return view('placeholder', ['title' => 'Вакансии']);
});

Route::get('/stock-remainders', function () {
    return view('placeholder', ['title' => 'Неликвиды и остатки складов']);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/reg', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);


