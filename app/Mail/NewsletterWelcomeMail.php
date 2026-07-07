<?php

namespace App\Mail;

use App\Mail\Concerns\HasMailEnvelope;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

class NewsletterWelcomeMail extends Mailable
{
    use HasMailEnvelope, Queueable, SerializesModels;

    public function envelope()
    {
        return $this->baseEnvelope('Подтверждение подписки на новости НПП Инпроком');
    }

    public function headers(): Headers
    {
        $replyTo = config('mail.reply_to.address', config('mail.from.address'));

        $unsubscribeSubject = rawurlencode('Отписка от рассылки');

        return new Headers(
            text: [
                'List-Unsubscribe' => '<mailto:'.$replyTo.'?subject='.$unsubscribeSubject.'>',
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.newsletter-welcome',
            text: 'emails.newsletter-welcome-text',
            with: [
                'siteUrl' => $this->siteUrl(),
            ],
        );
    }
}
