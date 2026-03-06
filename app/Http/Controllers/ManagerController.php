<?php

namespace App\Http\Controllers;

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

        return view('manager.index', [
            'products' => $products,
            'categories' => $categories,
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
            'stock' => 'required|integer|min:0',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',
        ], [
            'name.required' => 'Введите наименование товара',
            'model.required' => 'Введите модель товара',
            'price.required' => 'Введите цену товара',
            'price.numeric' => 'Цена должна быть числом',
            'stock.required' => 'Введите остаток товара',
            'stock.integer' => 'Остаток должен быть целым числом',
            'image_file.image' => 'Файл должен быть изображением',
            'image_file.max' => 'Размер изображения не должен превышать 5 МБ',
        ]);

        $imageUrl = null;
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
            'stock' => $validated['stock'],
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
}
