<?php

namespace App\Notifications;

use App\Models\Comment;
use App\Models\Update;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class CommentActivityEmail extends Notification
{
    use Queueable;

    public function __construct(
        private readonly User $commenter,
        private readonly Update $update,
        private readonly Comment $comment,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $preview = Str::limit($this->comment->content, 120);

        return (new MailMessage)
            ->subject($this->commenter->name . ' commented on your update')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line($this->commenter->name . ' commented on your sprint update.')
            ->line('Comment preview: "' . $preview . '"')
            ->action('View Update', route('sprints.show', $this->update->sprint))
            ->line('You can manage these emails from your notification settings.');
    }
}
