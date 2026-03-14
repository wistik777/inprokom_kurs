<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminAuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'actor_user_id',
        'action',
        'target_type',
        'target_id',
        'before_state',
        'after_state',
        'reverted_at',
        'reverted_by_user_id',
    ];

    protected function casts(): array
    {
        return [
            'before_state' => 'array',
            'after_state' => 'array',
            'reverted_at' => 'datetime',
        ];
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_user_id');
    }

    public function revertedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reverted_by_user_id');
    }
}
