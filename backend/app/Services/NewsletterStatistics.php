<?php

namespace App\Services;

use App\Models\NewsletterSubscriber;
use Carbon\Carbon;

class NewsletterStatistics
{
    /** @var list<string> */
    private const RU_MONTHS = [
        1 => 'Янв', 2 => 'Фев', 3 => 'Мар', 4 => 'Апр', 5 => 'Май', 6 => 'Июн',
        7 => 'Июл', 8 => 'Авг', 9 => 'Сен', 10 => 'Окт', 11 => 'Ноя', 12 => 'Дек',
    ];

    public function build(?array $periodRange): array
    {
        if (!\Illuminate\Support\Facades\Schema::hasTable('newsletter_subscribers')) {
            return [
                'total' => 0,
                'period_new' => 0,
                'monthly' => [],
            ];
        }

        $total = NewsletterSubscriber::query()->count();

        $periodNew = 0;
        if ($periodRange) {
            $periodNew = NewsletterSubscriber::query()
                ->whereBetween('created_at', [$periodRange['start'], $periodRange['end']])
                ->count();
        } else {
            $periodNew = $total;
        }

        return [
            'total' => $total,
            'period_new' => $periodNew,
            'monthly' => $this->buildMonthly($periodRange),
        ];
    }

    /**
     * @return list<array{month: string, label: string, count: int}>
     */
    private function buildMonthly(?array $periodRange): array
    {
        $months = [];

        if ($periodRange && StatisticsPeriod::normalize(null) !== '') {
            $start = $periodRange['start']->copy()->startOfMonth();
            $end = $periodRange['end']->copy()->startOfMonth();

            while ($start <= $end) {
                $key = $start->format('Y-m');
                $months[$key] = [
                    'month' => $key,
                    'label' => (self::RU_MONTHS[(int) $start->format('n')] ?? $start->format('M')).' '.$start->format('Y'),
                    'count' => 0,
                ];
                $start->addMonth();
            }
        } else {
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $key = $date->format('Y-m');
                $months[$key] = [
                    'month' => $key,
                    'label' => (self::RU_MONTHS[(int) $date->format('n')] ?? $date->format('M')).' '.$date->format('Y'),
                    'count' => 0,
                ];
            }
        }

        $firstMonthKey = array_key_first($months);
        $fromDate = Carbon::parse($firstMonthKey.'-01')->startOfMonth();

        $subscribers = NewsletterSubscriber::query()
            ->where('created_at', '>=', $fromDate)
            ->get(['created_at']);

        foreach ($subscribers as $subscriber) {
            if (!$subscriber->created_at) {
                continue;
            }

            $key = $subscriber->created_at->format('Y-m');
            if (isset($months[$key])) {
                $months[$key]['count']++;
            }
        }

        return array_values($months);
    }
}
