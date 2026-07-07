<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\NewsPost;
use App\Models\Product;
use App\Models\Vacancy;
use App\Models\VacancyApplication;
use App\Support\SiteContent;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ManagerController extends Controller
{
    public function index()
    {
        $products = Product::query()
            ->with(['categories:id,name'])
            ->latest('id')
            ->get(['id', 'name', 'model', 'is_active']);

        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json([
            'data' => [
                'products' => $products,
                'categories' => $categories,
            ],
        ]);
    }

    public function storeProduct(Request $request)
    {


        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_file' => 'nullable|image|max:5120',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',
        ], [
            'name.required' => 'Введите наименование продукции',
            'model.required' => 'Введите модель продукции',
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
            'price' => 0,
            'image_url' => $imageUrl,
            'is_active' => true,
        ]);

        $product->categories()->sync($validated['category_ids'] ?? []);

        return response()->json([
            'message' => 'Продукция успешно добавлена',
            'data' => $product->load('categories:id,name'),
        ], 201);
    }

    public function destroyProduct(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Продукция успешно удалена']);
    }

    public function inbox()
    {


        $feedbackMessages = ContactMessage::query()
            ->latest('id')
            ->get()
            ->map(fn (ContactMessage $message) => $this->formatInboxItem($message))
            ->values()
            ->all();

        $vacancyApplications = VacancyApplication::query()
            ->latest('id')
            ->get()
            ->map(function (VacancyApplication $application) {
                return array_merge($this->formatInboxItem($application), [
                    'position' => $application->position,
                    'resume_name' => $application->resume_original_name,
                    'resume_url' => url('/api/v1/manager/vacancy-applications/'.$application->id.'/resume'),
                ]);
            })
            ->values()
            ->all();

        return response()->json([
            'data' => [
                'feedback' => $feedbackMessages,
                'vacancyApplications' => $vacancyApplications,
            ],
        ]);
    }

    public function updateFeedbackStatus(Request $request, ContactMessage $message)
    {
        $this->updateInboxStatus($request, $message);

        return response()->json(['message' => 'Статус обращения обновлен']);
    }

    public function updateVacancyStatus(Request $request, VacancyApplication $application)
    {
        $this->updateInboxStatus($request, $application);

        return response()->json(['message' => 'Статус отклика обновлен']);
    }

    public function downloadVacancyResume(VacancyApplication $application)
    {


        if (!Storage::disk('local')->exists($application->resume_path)) {
            abort(404);
        }

        return Storage::disk('local')->download(
            $application->resume_path,
            $application->resume_original_name
        );
    }

    public function content()
    {


        return response()->json([
            'data' => [
                'newsPosts' => SiteContent::newsForManager(),
                'vacancies' => SiteContent::vacanciesForManager(),
            ],
        ]);
    }

    public function previewNews(NewsPost $newsPost)
    {
        return response()->json([
            'data' => $newsPost->toPublicArray(),
        ]);
    }

    public function storeNews(Request $request)
    {


        $validated = $this->validateNews($request);
        $publishedAt = $this->resolvePublishedAt($request);

        NewsPost::create([
            'title' => $validated['title'],
            'published_at' => $publishedAt,
            'content' => $this->paragraphsFromText($validated['content_text'] ?? null),
            'is_published' => $request->boolean('is_published', true),
        ]);

        return response()->json(['message' => 'Новость успешно добавлена'], 201);
    }

    public function updateNews(Request $request, NewsPost $newsPost)
    {


        $validated = $this->validateNews($request, $newsPost);
        $publishedAt = $this->resolvePublishedAt($request, $newsPost);

        $newsPost->update([
            'title' => $validated['title'],
            'published_at' => $publishedAt,
            'content' => $this->paragraphsFromText($validated['content_text'] ?? null),
            'is_published' => $request->boolean('is_published'),
        ]);

        return response()->json(['message' => 'Новость успешно обновлена']);
    }

    public function destroyNews(NewsPost $newsPost)
    {


        $newsPost->delete();

        return response()->json(['message' => 'Новость удалена']);
    }

    public function storeVacancy(Request $request)
    {


        $validated = $this->validateVacancy($request);
        $publishedAt = $this->resolvePublishedAt($request);

        Vacancy::create([
            ...$this->vacancyPayload($validated),
            'published_at' => $publishedAt,
            'is_active' => $request->boolean('is_active', true),
            'image' => '/img/cart_fon.png',
            'image_position' => 'center',
            'accent' => 'from-[#FA4234]/90 to-[#181818]/80',
        ]);

        return response()->json(['message' => 'Вакансия успешно добавлена'], 201);
    }

    public function updateVacancy(Request $request, Vacancy $vacancy)
    {


        $validated = $this->validateVacancy($request, $vacancy);
        $publishedAt = $this->resolvePublishedAt($request, $vacancy);

        $vacancy->update([
            ...$this->vacancyPayload($validated),
            'published_at' => $publishedAt,
            'is_active' => $request->boolean('is_active'),
        ]);

        return response()->json(['message' => 'Вакансия успешно обновлена']);
    }

    public function destroyVacancy(Vacancy $vacancy)
    {


        $vacancy->delete();

        return response()->json(['message' => 'Вакансия удалена']);
    }

    private function validateNews(Request $request, ?NewsPost $existing = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:500',
            'published_at' => 'nullable|date',
            'content_text' => 'nullable|string',
        ], [
            'title.required' => 'Введите заголовок новости',
            'published_at.date' => 'Укажите корректную дату и время публикации',
        ]);
    }

    private function resolvePublishedAt(Request $request, NewsPost|Vacancy|null $existing = null): Carbon
    {
        $raw = trim((string) $request->input('published_at', ''));

        if ($raw === '') {
            return now();
        }

        $publishedAt = Carbon::parse($raw);

        if ($existing && $existing->published_at && $publishedAt->equalTo($existing->published_at)) {
            return $publishedAt;
        }

        if ($publishedAt->lt(Carbon::today()->startOfDay())) {
            throw ValidationException::withMessages([
                'published_at' => ['Дата публикации не может быть раньше сегодняшнего дня'],
            ]);
        }

        return $publishedAt;
    }

    private function validateVacancy(Request $request, ?Vacancy $existing = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'experience' => 'nullable|string|max:100',
            'schedule' => 'nullable|string|max:100',
            'published_at' => 'nullable|date',
            'short' => 'required|string|max:1000',
            'duties_text' => 'required|string',
            'requirements_text' => 'required|string',
        ], [
            'title.required' => 'Введите название вакансии',
            'department.required' => 'Укажите подразделение',
            'short.required' => 'Добавьте краткое описание',
            'duties_text.required' => 'Укажите обязанности',
            'requirements_text.required' => 'Укажите требования',
            'published_at.date' => 'Укажите корректную дату и время публикации',
        ]);
    }

    private function vacancyPayload(array $validated): array
    {
        return [
            'title' => $validated['title'],
            'department' => $validated['department'],
            'experience' => $validated['experience'] ?? null,
            'schedule' => $validated['schedule'] ?? null,
            'short' => $validated['short'],
            'duties' => $this->linesToArray($validated['duties_text']),
            'requirements' => $this->linesToArray($validated['requirements_text']),
        ];
    }

    private function paragraphsFromText(?string $text): ?array
    {
        if ($text === null || trim($text) === '') {
            return null;
        }

        $lines = preg_split("/\R/u", trim($text)) ?: [];
        $paragraphs = array_values(array_filter(array_map('trim', $lines)));

        return $paragraphs ?: [trim($text)];
    }

    private function linesToArray(string $text): array
    {
        $lines = preg_split("/\R/u", $text) ?: [];

        return array_values(array_filter(array_map('trim', $lines)));
    }

    private function formatInboxItem(ContactMessage|VacancyApplication $item): array
    {
        return [
            'id' => $item->id,
            'name' => $item->name,
            'email' => $item->email,
            'phone' => $item->phone,
            'message' => $item->message,
            'status' => $item->status ?? 'new',
            'created_at' => optional($item->created_at)->format('d.m.Y H:i'),
        ];
    }

    private function updateInboxStatus(Request $request, ContactMessage|VacancyApplication $item): void
    {
        $validated = $request->validate([
            'status' => 'required|in:new,processed',
        ], [
            'status.in' => 'Некорректный статус',
        ]);

        $item->status = $validated['status'];
        $item->save();
    }
}
