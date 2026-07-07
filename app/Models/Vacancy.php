<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Vacancy extends Model
{
    protected $fillable = [
        'title',
        'published_at',
        'department',
        'experience',
        'schedule',
        'image',
        'image_position',
        'accent',
        'short',
        'duties',
        'requirements',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'duties' => 'array',
            'requirements' => 'array',
            'is_active' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function publicationStatus(): string
    {
        if (!$this->is_active) {
            return 'hidden';
        }

        if ($this->published_at && $this->published_at->isFuture()) {
            return 'scheduled';
        }

        return 'live';
    }

    public function formattedPublishedAt(): string
    {
        $date = $this->published_at ?? $this->created_at ?? now();

        return Carbon::parse($date)->locale('ru')->translatedFormat('j F Y, H:i');
    }

    public function toPublicArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'department' => $this->department,
            'experience' => $this->experience,
            'schedule' => $this->schedule,
            'image' => $this->image ?: '/img/cart_fon.png',
            'imagePosition' => $this->image_position ?: 'center',
            'accent' => $this->accent ?: 'from-[#FA4234]/90 to-[#181818]/80',
            'short' => $this->short,
            'duties' => $this->duties,
            'requirements' => $this->requirements,
        ];
    }
}
