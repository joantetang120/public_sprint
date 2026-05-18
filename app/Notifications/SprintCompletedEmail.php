<?php

namespace App\Notifications;

use App\Models\Sprint;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SprintCompletedEmail extends Notification
{
    use Queueable;

    public function __construct(
        private readonly Sprint $sprint,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Sprint completed: ' . $this->sprint->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Your sprint "' . $this->sprint->title . '" has now been marked as completed.')
            ->action('View Sprint', route('sprints.show', $this->sprint->id))
            ->line('You can manage these emails from your notification settings.');
    }
}
