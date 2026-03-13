<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CartController extends Controller
{
    public function data(Request $request): JsonResponse
    {
        $cart = $this->resolveCart($request);

        return response()->json($this->serializeCart($cart));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'qty' => 'nullable|integer|min:1',
        ]);

        $product = Product::query()
            ->where('id', $validated['product_id'])
            ->where('is_active', true)
            ->firstOrFail();

        if ($product->stock <= 0) {
            return response()->json([
                'message' => 'Товар отсутствует на складе',
            ], 422);
        }

        $cart = $this->resolveCart($request, true);
        $qtyToAdd = (int) ($validated['qty'] ?? 1);

        $item = $cart->items()
            ->where('product_id', $product->id)
            ->first();

        if ($item) {
            $item->quantity = min($product->stock, $item->quantity + $qtyToAdd);
            $item->save();
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => min($product->stock, $qtyToAdd),
                'price_at_add' => $product->price,
            ]);
        }

        $cart->load('items.product');

        return response()->json($this->serializeCart($cart));
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'qty' => 'required|integer|min:0',
        ]);

        $cart = $this->resolveCart($request);
        if (!$cart) {
            return response()->json($this->emptyCartPayload());
        }

        $item = $cart->items()
            ->where('product_id', $product->id)
            ->first();

        if (!$item) {
            return response()->json($this->serializeCart($cart));
        }

        $nextQty = min($product->stock, (int) $validated['qty']);
        if ($nextQty <= 0) {
            $item->delete();
        } else {
            $item->quantity = $nextQty;
            $item->save();
        }

        $cart->refresh()->load('items.product');

        return response()->json($this->serializeCart($cart));
    }

    public function destroy(Request $request, Product $product): JsonResponse
    {
        $cart = $this->resolveCart($request);
        if (!$cart) {
            return response()->json($this->emptyCartPayload());
        }

        $cart->items()->where('product_id', $product->id)->delete();

        $cart->refresh()->load('items.product');

        return response()->json($this->serializeCart($cart));
    }

    public function clear(Request $request): JsonResponse
    {
        $cart = $this->resolveCart($request);
        if (!$cart) {
            return response()->json($this->emptyCartPayload());
        }

        $cart->items()->delete();
        $cart->refresh()->load('items.product');

        return response()->json($this->serializeCart($cart));
    }

    public function checkout(Request $request): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Для оформления заказа необходимо зарегистрироваться',
            ], 401);
        }

        $cart = $this->resolveCart($request);
        if (!$cart) {
            return response()->json([
                'message' => 'Корзина пуста',
            ], 422);
        }

        $cart->load('items.product');
        if ($cart->items->isEmpty()) {
            return response()->json([
                'message' => 'Корзина пуста',
            ], 422);
        }

        foreach ($cart->items as $item) {
            if (!$item->product || !$item->product->is_active || $item->product->stock <= 0) {
                return response()->json([
                    'message' => 'Один из товаров недоступен для заказа',
                ], 422);
            }

            if ($item->quantity > $item->product->stock) {
                return response()->json([
                    'message' => 'Недостаточно товара на складе для оформления заказа',
                ], 422);
            }
        }

        foreach ($cart->items as $item) {
            $item->product->decrement('stock', $item->quantity);
        }

        $cart->status = 'new';
        $cart->session_id = null;
        $cart->save();

        return response()->json([
            'message' => 'Заказ успешно оформлен',
            'order_id' => $cart->id,
        ]);
    }

    private function resolveCart(Request $request, bool $create = false): ?Cart
    {
        if (auth()->check()) {
            $query = Cart::query()->where('user_id', auth()->id())->where('status', 'active');
            return $create ? $query->firstOrCreate(['user_id' => auth()->id(), 'status' => 'active']) : $query->first();
        }

        $sessionId = $request->session()->getId();
        $query = Cart::query()->where('session_id', $sessionId)->where('status', 'active');

        return $create
            ? $query->firstOrCreate(['session_id' => $sessionId, 'status' => 'active'])
            : $query->first();
    }

    private function serializeCart(?Cart $cart): array
    {
        if (!$cart) {
            return $this->emptyCartPayload();
        }

        $cart->loadMissing('items.product');
        $items = $cart->items
            ->filter(fn (CartItem $item) => (bool) $item->product)
            ->map(function (CartItem $item) {
                return [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'model' => $item->product->model,
                    'description' => $item->product->description ?? '',
                    'price' => (float) $item->price_at_add,
                    'image_url' => $item->product->image_url,
                    'stock' => (int) $item->product->stock,
                    'qty' => (int) $item->quantity,
                ];
            })
            ->values()
            ->all();

        $count = array_reduce($items, fn ($sum, $item) => $sum + (int) $item['qty'], 0);

        return [
            'items' => $items,
            'count' => $count,
        ];
    }

    private function emptyCartPayload(): array
    {
        return [
            'items' => [],
            'count' => 0,
        ];
    }
}
