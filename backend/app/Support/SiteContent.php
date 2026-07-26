<?php

namespace App\Support;

use App\Models\Category;
use App\Models\NewsPost;
use App\Models\Vacancy;
use Carbon\Carbon;

class SiteContent
{
    public static function publishedNews(): array
    {
        if (!self::tablesExist()) {
            return [];
        }

        return NewsPost::query()
            ->where('is_published', true)
            ->where('published_at', '<=', now())
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (NewsPost $post) => $post->toPublicArray())
            ->values()
            ->all();
    }

    public static function activeVacancies(): array
    {
        if (!self::tablesExist()) {
            return [];
        }

        return Vacancy::query()
            ->where('is_active', true)
            ->where('published_at', '<=', now())
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Vacancy $vacancy) => $vacancy->toPublicArray())
            ->values()
            ->all();
    }

    public static function categoryTree(): array
    {
        if (!self::tablesExist() || !\Illuminate\Support\Facades\Schema::hasTable('categories')) {
            return [];
        }

        return Category::query()
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->with(['children' => function ($query) {
                $query->where('is_active', true)->orderBy('sort_order')->orderBy('name');
            }])
            ->get(['id', 'name', 'slug', 'parent_id', 'sort_order'])
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'children' => $category->children->map(fn (Category $child) => [
                    'id' => $child->id,
                    'name' => $child->name,
                    'slug' => $child->slug,
                    'parent_id' => $child->parent_id,
                ])->values()->all(),
            ])
            ->values()
            ->all();
    }

    public static function newsForManager(): array
    {
        if (!self::tablesExist()) {
            return [];
        }

        return NewsPost::query()
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (NewsPost $post) => self::formatNewsForManager($post))
            ->values()
            ->all();
    }

    public static function vacanciesForManager(): array
    {
        if (!self::tablesExist()) {
            return [];
        }

        return Vacancy::query()
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Vacancy $vacancy) => self::formatVacancyForManager($vacancy))
            ->values()
            ->all();
    }

    public static function formatNewsForManager(NewsPost $post): array
    {
        $content = $post->content ?? [];
        $publishedAt = $post->published_at ?? $post->created_at;

        return [
            'id' => $post->id,
            'title' => $post->title,
            'display_date' => $post->formattedDisplayDate(),
            'published_at_input' => $publishedAt ? Carbon::parse($publishedAt)->format('Y-m-d\TH:i') : '',
            'published_at_label' => $publishedAt ? Carbon::parse($publishedAt)->locale('ru')->translatedFormat('j F Y, H:i') : '—',
            'publication_status' => $post->publicationStatus(),
            'content_text' => implode("\n", $content),
            'is_published' => $post->is_published,
            'updated_at' => optional($post->updated_at)->format('d.m.Y H:i'),
        ];
    }

    public static function formatVacancyForManager(Vacancy $vacancy): array
    {
        $publishedAt = $vacancy->published_at ?? $vacancy->created_at;

        return [
            'id' => $vacancy->id,
            'title' => $vacancy->title,
            'department' => $vacancy->department,
            'experience' => $vacancy->experience,
            'schedule' => $vacancy->schedule,
            'short' => $vacancy->short,
            'duties_text' => implode("\n", $vacancy->duties ?? []),
            'requirements_text' => implode("\n", $vacancy->requirements ?? []),
            'published_at_input' => $publishedAt ? Carbon::parse($publishedAt)->format('Y-m-d\TH:i') : '',
            'published_at_label' => $vacancy->formattedPublishedAt(),
            'publication_status' => $vacancy->publicationStatus(),
            'is_active' => $vacancy->is_active,
            'updated_at' => optional($vacancy->updated_at)->format('d.m.Y H:i'),
        ];
    }

    private static function tablesExist(): bool
    {
        try {
            return \Illuminate\Support\Facades\Schema::hasTable('news_posts')
                && \Illuminate\Support\Facades\Schema::hasTable('vacancies');
        } catch (\Throwable) {
            return false;
        }
    }
}
