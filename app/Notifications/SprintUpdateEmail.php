<?php

namespace App\Notifications;

use App\Models\Sprint;
use App\Models\Update;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class SprintUpdateEmail extends Notification
{
    use Queueable;

    public function __construct(
        private readonly User $author,
        private readonly Sprint $sprint,
        private readonly Update $update,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $preview = Str::limit($this->update->content, 140);

        return (new MailMessage)
            ->subject('New sprint update in ' . $this->sprint->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line($this->author->name . ' posted a new update in "' . $this->sprint->title . '".')
            ->line('Update preview: "' . $preview . '"')
            ->action('View Sprint', route('sprints.show', $this->sprint->id))
            ->line('You can manage these emails from your notification settings.');
    }
}
