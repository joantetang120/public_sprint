<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordResetCodeNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly string $code)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your PublicSprint verification code')
            ->greeting('Hi ' . ($notifiable->name ?? 'there') . ',')
            ->line('Use this 6-digit verification code to reset your password:')
            ->line($this->code)
            ->line('This code expires in 15 minutes.')
            ->line('If you did not request this reset, you can ignore this email.');
    }
}
