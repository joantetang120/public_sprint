<?php

namespace App\Events;

use App\Models\Update;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SprintReactionToggled implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Update $update,
        public int $userId,
        public bool $added
    ) {}

    public function broadcastOn(): array
    {
        return [new Channel('sprint.' . $this->update->sprint_id)];
    }

    public function broadcastAs(): string
    {
        return 'reaction.toggled';
    }

    public function broadcastWith(): array
    {
        return [
            'update_id' => $this->update->id,
            'user_id'   => $this->userId,
            'added'     => $this->added,
            'count'     => $this->update->reactions()->count(),
        ];
    }
}
