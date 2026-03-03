<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Models\Product;

Route::get('/', function () {
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

Route::post('/login', [AuthController::class, 'login']);
Route::post('/reg', [AuthController::class, 'register']);


