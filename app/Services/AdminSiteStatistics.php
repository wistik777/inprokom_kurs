<?php

namespace App\Services;

use App\Models\ContactMessage;
use App\Models\NewsPost;
use App\Models\Product;
use App\Models\Vacancy;
use App\Models\VacancyApplication;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;

class AdminSiteStatistics
{
    /** @var list<string> */
    private const RU_MONTHS = [
        1 => 'Янв', 2 => 'Фев', 3 => 'Мар', 4 => 'Апр', 5 => 'Май', 6 => 'Июн',
        7 => 'Июл', 8 => 'Авг', 9 => 'Сен', 10 => 'Окт', 11 => 'Ноя', 12 => 'Дек',
    ];

    public function __construct(
        private NewsletterStatistics $newsletterStatistics,
    ) {}

    public function build(string $period = StatisticsPeriod::ALL): array
    {
        $period = StatisticsPeriod::normalize($period);
        $periodRange = StatisticsPeriod::range($period);

        $feedbackQuery = $this->scopedQuery(ContactMessage::query(), $periodRange);
        $vacancyAppsQuery = $this->scopedQuery(VacancyApplication::query(), $periodRange);

        $feedbackTotal = ContactMessage::query()->count();
        $vacancyAppsTotal = VacancyApplication::query()->count();
        $feedbackPeriod = (clone $feedbackQuery)->count();
        $vacancyAppsPeriod = (clone $vacancyAppsQuery)->count();
        $feedbackNew = ContactMessage::query()->where('status', 'new')->count();
        $vacancyAppsNew = VacancyApplication::query()->where('status', 'new')->count();

        return [
            'period' => $period,
            'period_label' => $periodRange['label'] ?? StatisticsPeriod::LABELS[StatisticsPeriod::ALL],
            'summary' => [
                'newsletter_total' => $this->newsletterStatistics->build($periodRange)['total'] ?? 0,
                'newsletter_period_new' => $this->newsletterStatistics->build($periodRange)['period_new'] ?? 0,
                'feedback_total' => $feedbackTotal,
                'feedback_period' => $feedbackPeriod,
                'feedback_new' => $feedbackNew,
                'vacancy_apps_total' => $vacancyAppsTotal,
                'vacancy_apps_period' => $vacancyAppsPeriod,
                'vacancy_apps_new' => $vacancyAppsNew,
                'news_published' => $this->countPublishedNews(),
                'vacancies_active' => $this->countActiveVacancies(),
                'products_active' => Product::query()->where('is_active', true)->count(),
            ],
            'newsletter' => $this->newsletterStatistics->build($periodRange),
            'feedback_monthly' => $this->buildMonthlyCounts(ContactMessage::class, $periodRange),
            'vacancy_apps_monthly' => $this->buildMonthlyCounts(VacancyApplication::class, $periodRange),
            'recent_feedback' => $this->buildRecentFeedback($periodRange),
            'recent_vacancy_apps' => $this->buildRecentVacancyApps($periodRange),
        ];
    }

    private function scopedQuery($query, ?array $periodRange)
    {
        if ($periodRange) {
            $query->whereBetween('created_at', [$periodRange['start'], $periodRange['end']]);
        }

        return $query;
    }

    private function countPublishedNews(): int
    {
        if (!Schema::hasTable('news_posts')) {
            return 0;
        }

        return NewsPost::query()->where('is_published', true)->count();
    }

    private function countActiveVacancies(): int
    {
        if (!Schema::hasTable('vacancies')) {
            return 0;
        }

        return Vacancy::query()->where('is_active', true)->count();
    }

    /**
     * @param  class-string  $modelClass
     * @return list<array{month: string, label: string, count: int}>
     */
    private function buildMonthlyCounts(string $modelClass, ?array $periodRange): array
    {
        $months = $this->monthBuckets($periodRange);

        if (!Schema::hasTable((new $modelClass)->getTable())) {
            return array_values($months);
        }

        $firstMonthKey = array_key_first($months);
        if ($firstMonthKey === null) {
            return [];
        }

        $fromDate = Carbon::parse($firstMonthKey.'-01')->startOfMonth();

        $items = $modelClass::query()
            ->where('created_at', '>=', $fromDate)
            ->get(['created_at']);

        foreach ($items as $item) {
            if (!$item->created_at) {
                continue;
            }

            $key = $item->created_at->format('Y-m');
            if (isset($months[$key])) {
                $months[$key]['count']++;
            }
        }

        return array_values($months);
    }

    /**
     * @return array<string, array{month: string, label: string, count: int}>
     */
    private function monthBuckets(?array $periodRange): array
    {
        $months = [];

        if ($periodRange) {
            $cursor = $periodRange['start']->copy()->startOfMonth();
            $end = $periodRange['end']->copy()->startOfMonth();

            while ($cursor <= $end) {
                $key = $cursor->format('Y-m');
                $months[$key] = [
                    'month' => $key,
                    'label' => (self::RU_MONTHS[(int) $cursor->format('n')] ?? $cursor->format('M')).' '.$cursor->format('Y'),
                    'count' => 0,
                ];
                $cursor->addMonth();
            }

            return $months;
        }

        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $key = $date->format('Y-m');
            $months[$key] = [
                'month' => $key,
                'label' => (self::RU_MONTHS[(int) $date->format('n')] ?? $date->format('M')).' '.$date->format('Y'),
                'count' => 0,
            ];
        }

        return $months;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function buildRecentFeedback(?array $periodRange): array
    {
        if (!Schema::hasTable('contact_messages')) {
            return [];
        }

        $query = ContactMessage::query()->latest('id');

        if ($periodRange) {
            $query->whereBetween('created_at', [$periodRange['start'], $periodRange['end']]);
        }

        return $query->limit(8)->get()->map(fn (ContactMessage $message) => [
            'id' => $message->id,
            'name' => $message->name,
            'email' => $message->email,
            'status' => $message->status ?? 'new',
            'status_label' => ($message->status ?? 'new') === 'processed' ? 'Обработано' : 'Новое',
            'created_at' => optional($message->created_at)->format('d.m.Y H:i'),
        ])->values()->all();
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function buildRecentVacancyApps(?array $periodRange): array
    {
        if (!Schema::hasTable('vacancy_applications')) {
            return [];
        }

        $query = VacancyApplication::query()->latest('id');

        if ($periodRange) {
            $query->whereBetween('created_at', [$periodRange['start'], $periodRange['end']]);
        }

        return $query->limit(8)->get()->map(fn (VacancyApplication $application) => [
            'id' => $application->id,
            'name' => $application->name,
            'position' => $application->position,
            'status' => $application->status ?? 'new',
            'status_label' => ($application->status ?? 'new') === 'processed' ? 'Обработано' : 'Новое',
            'created_at' => optional($application->created_at)->format('d.m.Y H:i'),
        ])->values()->all();
    }
}
