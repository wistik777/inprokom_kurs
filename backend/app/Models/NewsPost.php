<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class NewsPost extends Model
{
    protected $fillable = [
        'title',
        'published_at',
        'content',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function formattedDisplayDate(): string
    {
        $date = $this->published_at ?? $this->created_at ?? now();

        return Carbon::parse($date)->locale('ru')->translatedFormat('j F y');
    }

    public function publicationStatus(): string
    {
        if (!$this->is_published) {
            return 'hidden';
        }

        if ($this->published_at && $this->published_at->isFuture()) {
            return 'scheduled';
        }

        return 'live';
    }

    public function toPublicArray(): array
    {
        $content = $this->content;
        if (empty($content)) {
            $content = [
                "{$this->title} — событие, в котором приняли участие специалисты НПП «Инпроком». Компания подтвердила высокий уровень компетенций в разработке и производстве продукции специального назначения.",
                'Предприятие продолжает развивать научно-производственный комплекс полного цикла: от проектирования и опытных образцов до серийного выпуска изделий для промышленности и оборонного сектора.',
                'По вопросам сотрудничества и дополнительной информации обращайтесь в пресс-службу по адресу info@inprokom.ru или по телефону 8 (49244) 77-53-4.',
            ];
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'date' => $this->formattedDisplayDate(),
            'content' => $content,
        ];
    }
}
