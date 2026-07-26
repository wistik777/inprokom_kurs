<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsPost;
use App\Models\Product;
use App\Support\SiteContent;
use Illuminate\Http\JsonResponse;

class PublicContentController extends Controller
{
    public function news(): JsonResponse
    {
        return response()->json([
            'data' => SiteContent::publishedNews(),
        ]);
    }

    public function newsShow(int $newsPost): JsonResponse
    {
        $items = SiteContent::publishedNews();
        $item = collect($items)->firstWhere('id', $newsPost);

        if (! $item) {
            return response()->json(['message' => 'Новость не найдена'], 404);
        }

        return response()->json(['data' => $item]);
    }

    public function products(): JsonResponse
    {
        $products = Product::query()
            ->with(['categories:id,name,slug,parent_id'])
            ->where('is_active', true)
            ->latest('id')
            ->get();

        return response()->json(['data' => $products]);
    }

    public function productShow(Product $product): JsonResponse
    {
        $product->load(['categories:id,name,slug,parent_id']);

        return response()->json(['data' => $product]);
    }

    public function vacancies(): JsonResponse
    {
        return response()->json([
            'data' => SiteContent::activeVacancies(),
        ]);
    }

    public function categories(): JsonResponse
    {
        return response()->json([
            'data' => SiteContent::categoryTree(),
        ]);
    }
}
