<?php

namespace App\Http\Controllers;

use App\Models\VacancyApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VacancyApplicationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:32',
            'position' => 'required|string|max:255',
            'message' => 'nullable|string|max:5000',
            'resume' => 'required|file|mimes:txt,pdf,doc,docx|max:2048',
        ], [
            'name.required' => 'Укажите ФИО',
            'email.required' => 'Укажите e-mail',
            'email.email' => 'Укажите корректный e-mail',
            'phone.required' => 'Укажите телефон',
            'position.required' => 'Выберите вакансию',
            'resume.required' => 'Прикрепите файл резюме',
            'resume.mimes' => 'Резюме должно быть в формате TXT, PDF, DOC или DOCX',
            'resume.max' => 'Размер файла резюме не должен превышать 2 МБ',
        ]);

        $file = $request->file('resume');
        $storedPath = $file->store('vacancy-resumes', 'local');

        VacancyApplication::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'position' => $validated['position'],
            'message' => $validated['message'] ?? null,
            'resume_path' => $storedPath,
            'resume_original_name' => $file->getClientOriginalName(),
            'status' => 'new',
        ]);

        return response()->json([
            'message' => 'Спасибо! Ваш отклик принят, мы свяжемся с вами в ближайшее время.',
        ]);
    }
}
