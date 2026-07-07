<?php

namespace App\Mail\Concerns;

use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Envelope;

trait HasMailEnvelope
{
    protected function siteUrl(): string
    {
        return rtrim((string) config('mail.site_url', config('app.url')), '/');
    }

    protected function mailReplyTo(): Address
    {
        return new Address(
            (string) config('mail.reply_to.address', config('mail.from.address')),
            (string) config('mail.reply_to.name', config('mail.from.name')),
        );
    }

    protected function baseEnvelope(string $subject): Envelope
    {
        return new Envelope(
            subject: $subject,
            replyTo: [$this->mailReplyTo()],
        );
    }
}
