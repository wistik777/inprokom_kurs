<?php

namespace App\Services;

use Carbon\Carbon;

class StatisticsPeriod
{
    public const ALL = 'all';
    public const YEAR = 'year';
    public const QUARTER = 'quarter';
    public const MONTH = 'month';

    /** @var list<string> */
    public const OPTIONS = [self::ALL, self::YEAR, self::QUARTER, self::MONTH];

    /** @var array<string, string> */
    public const LABELS = [
        self::ALL => 'За всё время',
        self::YEAR => 'За год',
        self::QUARTER => 'За квартал',
        self::MONTH => 'За этот месяц',
    ];

    public static function normalize(?string $period): string
    {
        return in_array($period, self::OPTIONS, true) ? $period : self::ALL;
    }

    /**
     * @return array{start: Carbon, end: Carbon, label: string}|null
     */
    public static function range(string $period): ?array
    {
        $now = now();

        return match ($period) {
            self::MONTH => [
                'start' => $now->copy()->startOfMonth(),
                'end' => $now->copy()->endOfMonth(),
                'label' => self::LABELS[self::MONTH],
            ],
            self::QUARTER => [
                'start' => $now->copy()->firstOfQuarter(),
                'end' => $now->copy()->lastOfQuarter(),
                'label' => self::LABELS[self::QUARTER],
            ],
            self::YEAR => [
                'start' => $now->copy()->startOfYear(),
                'end' => $now->copy()->endOfYear(),
                'label' => self::LABELS[self::YEAR],
            ],
            default => null,
        };
    }
}
