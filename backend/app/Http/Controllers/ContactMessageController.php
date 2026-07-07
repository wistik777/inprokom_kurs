<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:32',
            'message' => 'required|string|max:5000',
        ], [
            'name.required' => 'Укажите ФИО',
            'email.required' => 'Укажите e-mail',
            'email.email' => 'Укажите корректный e-mail',
            'message.required' => 'Введите сообщение',
        ]);

        ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'message' => $validated['message'],
            'status' => 'new',
        ]);

        return response()->json([
            'message' => 'Спасибо! Сообщение отправлено. Мы свяжемся с вами в ближайшее время.',
        ]);
    }
}
