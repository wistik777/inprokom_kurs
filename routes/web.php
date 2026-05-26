<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ManagerController;
use App\Models\Cart;
use App\Models\Product;

Route::get('/', function () {
    return view('home');
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
Route::get('/cart/data', [CartController::class, 'data']);
Route::post('/cart/items', [CartController::class, 'store']);
Route::patch('/cart/items/{product}', [CartController::class, 'update']);
Route::delete('/cart/items/{product}', [CartController::class, 'destroy']);
Route::delete('/cart/items', [CartController::class, 'clear']);
Route::post('/checkout', [CartController::class, 'checkout']);

Route::get('/profile', function () {
    if (!auth()->check()) {
        return redirect('/auth');
    }

    $orders = Cart::query()
        ->where('user_id', auth()->id())
        ->where('status', '!=', 'active')
        ->with(['items.product:id,name,model'])
        ->latest('id')
        ->get()
        ->map(function (Cart $order) {
            $itemsDetailed = $order->items
                ->map(function ($item) {
                    if (!$item->product) {
                        return null;
                    }

                    $price = (float) $item->price_at_add;
                    $qty = (int) $item->quantity;

                    return [
                        'id' => $item->id,
                        'name' => $item->product->name,
                        'model' => $item->product->model,
                        'price' => $price,
                        'qty' => $qty,
                        'sum' => $price * $qty,
                    ];
                })
                ->filter()
                ->values();

            $itemsText = $order->items
                ->map(function ($item) {
                    if (!$item->product) {
                        return null;
                    }

                    return $item->product->name . ' x' . $item->quantity;
                })
                ->filter()
                ->values()
                ->implode(', ');

            return [
                'id' => $order->id,
                'number' => $order->id,
                'items' => $itemsText ?: 'Состав заказа недоступен',
                'status' => $order->status,
                'created_at' => optional($order->created_at)->format('d.m.Y H:i'),
                'items_detailed' => $itemsDetailed->all(),
                'total' => $itemsDetailed->sum('sum'),
            ];
        })
        ->values()
        ->all();

    return view('profile', ['orders' => $orders]);
});

Route::get('/admin', [AdminController::class, 'index']);
Route::get('/admin/create-manager', [AdminController::class, 'createManager']);
Route::post('/admin/create-manager', [AdminController::class, 'storeManager']);
Route::delete('/admin/managers/{manager}', [AdminController::class, 'destroyManager']);
Route::post('/admin/audit-logs/{auditLog}/rollback', [AdminController::class, 'rollbackAuditLog']);
Route::get('/manager', [ManagerController::class, 'index']);
Route::post('/manager/products', [ManagerController::class, 'storeProduct']);
Route::delete('/manager/products/{product}', [ManagerController::class, 'destroyProduct']);
Route::patch('/manager/orders/{order}', [ManagerController::class, 'updateOrderStatus']);

Route::get('/about-company', function () {
    return view('about-company');
});

Route::get('/press-center', function () {
    return view('press-center');
});

Route::get('/press-center/news', function () {
    return view('press-center-news');
});

Route::get('/press-center/news/{news}', function (int $news) {
    return view('press-center-news-article', ['newsId' => $news]);
})->whereNumber('news');

Route::get('/contacts', function () {
    return view('contacts');
});

Route::get('/vacancies', function () {
    return view('vacancies');
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/reg', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::patch('/profile', [AuthController::class, 'updateProfile']);


