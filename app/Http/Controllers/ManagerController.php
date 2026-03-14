<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ManagerController extends Controller
{
    private function ensureManager(): void
    {
        if (!auth()->check() || auth()->user()->rule !== 'manager') {
            abort(403);
        }
    }

    public function index()
    {
        $this->ensureManager();

        $products = Product::query()
            ->with(['categories:id,name'])
            ->latest('id')
            ->get(['id', 'name', 'model', 'price', 'stock', 'is_active']);

        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name']);

        $orders = Cart::query()
            ->where('status', '!=', 'active')
            ->with([
                'user:id,login,email,phone',
                'items.product:id,name',
            ])
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
                            'name' => $item->product->name,
                            'qty' => $qty,
                            'sum' => $price * $qty,
                        ];
                    })
                    ->filter()
                    ->values();

                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'created_at' => optional($order->created_at)->format('d.m.Y H:i'),
                    'user' => [
                        'id' => $order->user?->id,
                        'login' => $order->user?->login,
                        'email' => $order->user?->email,
                        'phone' => $order->user?->phone,
                    ],
                    'items' => $itemsDetailed->map(fn ($item) => $item['name'] . ' x' . $item['qty'])->implode(', '),
                    'total' => $itemsDetailed->sum('sum'),
                ];
            })
            ->values()
            ->all();

        return view('manager.index', [
            'products' => $products,
            'categories' => $categories,
            'orders' => $orders,
            'success' => session('success'),
            'oldValues' => old(),
        ]);
    }

    public function storeProduct(Request $request)
    {
        $this->ensureManager();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image_file' => 'nullable|image|max:5120',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',
        ], [
            'name.required' => 'Введите наименование товара',
            'model.required' => 'Введите модель товара',
            'price.required' => 'Введите цену товара',
            'price.numeric' => 'Цена должна быть числом',
            'image_file.image' => 'Файл должен быть изображением',
            'image_file.max' => 'Размер изображения не должен превышать 5 МБ',
        ]);

        $imageUrl = '/img/hoImg.svg';
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('products', 'public');
            $imageUrl = Storage::url($path);
        }

        $product = Product::create([
            'name' => $validated['name'],
            'model' => $validated['model'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'image_url' => $imageUrl,
            'stock' => 0,
            'is_active' => true,
        ]);

        $product->categories()->sync($validated['category_ids'] ?? []);

        return redirect('/manager')->with('success', 'Товар успешно создан');
    }

    public function destroyProduct(Product $product)
    {
        $this->ensureManager();

        $product->delete();

        return redirect('/manager')->with('success', 'Товар успешно удален');
    }

    public function updateOrderStatus(Request $request, Cart $order)
    {
        $this->ensureManager();

        if ($order->status === 'active') {
            abort(404);
        }

        $validated = $request->validate([
            'status' => 'required|in:new,processing,shipped,delivered,cancelled',
        ], [
            'status.in' => 'Некорректный статус заказа',
        ]);

        $order->status = $validated['status'];
        $order->save();

        return redirect('/manager')->with('success', 'Статус заказа обновлен');
    }
}
