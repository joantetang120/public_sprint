<?php

namespace App\Notifications;

use App\Models\Update;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReactionActivityEmail extends Notification
{
    use Queueable;

    public function __construct(
        private readonly User $reactor,
        private readonly Update $update,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject($this->reactor->name . ' reacted to your update')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line($this->reactor->name . ' liked one of your sprint updates.')
            ->action('View Update', route('sprints.show', $this->update->sprint_id))
            ->line('You can manage these emails from your notification settings.');
    }
}
