<?php

namespace App\Console\Commands;

use App\Mail\NewsletterWelcomeMail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestNewsletterMail extends Command
{
    protected $signature = 'newsletter:test {email : Адрес получателя}';

    protected $description = 'Проверка отправки письма подписки на указанный email';

    public function handle(): int
    {
        $email = $this->argument('email');
        $siteUrl = config('mail.site_url', config('app.url'));

        $this->line('Mailer: '.config('mail.default'));
        $this->line('Host: '.config('mail.mailers.smtp.host'));
        $this->line('Port: '.config('mail.mailers.smtp.port'));
        $this->line('From: '.config('mail.from.address'));
        $this->line('Reply-To: '.config('mail.reply_to.address'));
        $this->line('Site URL in letters: '.$siteUrl);
        $this->newLine();

        if (str_contains((string) $siteUrl, 'localhost') || str_contains((string) $siteUrl, '127.0.0.1')) {
            $this->warn('MAIL_SITE_URL указывает на localhost — письма часто попадают в «Спам».');
            $this->warn('Укажите в .env: MAIL_SITE_URL=https://ваш-домен.ru');
            $this->newLine();
        }

        try {
            Mail::to($email)->send(new NewsletterWelcomeMail());

            $this->info("Письмо отправлено на {$email}");
            $this->line('Если письма нет во «Входящих» — проверьте папку «Спам» и отметьте «Не спам».');

            return self::SUCCESS;
        } catch (\Throwable $exception) {
            $this->error('Ошибка отправки:');
            $this->line($exception->getMessage());

            return self::FAILURE;
        }
    }
}
