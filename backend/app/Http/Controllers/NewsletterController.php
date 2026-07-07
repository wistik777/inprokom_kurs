<?php

namespace App\Http\Controllers;

use App\Mail\NewsletterWelcomeMail;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NewsletterController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
        ], [
            'email.required' => 'Укажите адрес электронной почты',
            'email.email' => 'Укажите корректный адрес электронной почты',
        ]);

        $email = mb_strtolower(trim($validated['email']));

        $isNew = ! NewsletterSubscriber::query()->where('email', $email)->exists();

        NewsletterSubscriber::query()->firstOrCreate([
            'email' => $email,
        ]);

        try {
            Mail::to($email)->send(new NewsletterWelcomeMail());
        } catch (\Throwable $exception) {
            Log::error('Newsletter welcome mail failed', [
                'email' => $email,
                'mailer' => config('mail.default'),
                'message' => $exception->getMessage(),
            ]);

            if ($isNew) {
                NewsletterSubscriber::query()->where('email', $email)->delete();
            }

            return response()->json([
                'message' => $this->resolveMailErrorMessage($exception),
            ], 503);
        }

        $baseMessage = $isNew
            ? 'Подписка оформлена. Проверьте почту — мы отправили письмо с подтверждением.'
            : 'На указанную почту снова отправлено письмо с подтверждением подписки.';

        return response()->json([
            'message' => $baseMessage.$this->logMailerNotice(),
            'email' => $email,
            'already_subscribed' => ! $isNew,
        ]);
    }

    private function resolveMailErrorMessage(\Throwable $exception): string
    {
        $message = $exception->getMessage();

        if (str_contains($message, 'does not have access rights') || str_contains($message, 'access rights to this service')) {
            return 'Яндекс не разрешает отправку через SMTP для этого ящика. Войдите в mail.yandex.ru → Настройки → «Почтовые программы» → включите доступ по IMAP/SMTP и создайте пароль приложения на id.yandex.ru.';
        }

        if (str_contains($message, 'authentication failed') || str_contains($message, '535')) {
            return 'Не удалось войти на почтовый сервер. Используйте пароль приложения Яндекса (не пароль от аккаунта). MAIL_USERNAME и MAIL_FROM_ADDRESS должны совпадать.';
        }

        if (str_contains($message, 'Connection could not be established')) {
            return 'Не удалось подключиться к SMTP-серверу. Проверьте MAIL_HOST, MAIL_PORT и MAIL_ENCRYPTION в .env.';
        }

        return 'Не удалось отправить письмо. '.$this->mailConfigurationHint();
    }

    private function mailConfigurationHint(): string
    {
        if (config('mail.default') === 'log') {
            return 'Почта отправителя не настроена (MAIL_MAILER=log). Укажите SMTP в .env — письма пользователям всё равно будут уходить на тот адрес, который они вводят в форме.';
        }

        if (config('mail.default') === 'smtp' && ! config('mail.mailers.smtp.username')) {
            return 'Укажите в .env почту и пароль ОТПРАВИТЕЛЯ (MAIL_USERNAME / MAIL_PASSWORD) — одну служебную почту сайта. Получателем будет email из формы подписки.';
        }

        return 'Проверьте настройки SMTP в .env (учётная запись отправителя).';
    }

    private function logMailerNotice(): string
    {
        if (config('app.debug') && config('mail.default') === 'log') {
            return ' (режим log: текст письма в storage/logs/laravel.log, в ящик пользователя не доставляется)';
        }

        return '';
    }
}
