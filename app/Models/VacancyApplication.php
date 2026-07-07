<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VacancyApplication extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'position',
        'message',
        'resume_path',
        'resume_original_name',
        'status',
    ];
}
