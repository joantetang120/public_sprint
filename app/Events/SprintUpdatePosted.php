<?php

namespace App\Events;

use App\Models\Update;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SprintUpdatePosted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Update $update) {}

    public function broadcastOn(): array
    {
        return [new Channel('sprint.' . $this->update->sprint_id)];
    }

    public function broadcastAs(): string
    {
        return 'update.posted';
    }

    public function broadcastWith(): array
    {
        $user = $this->update->user;
        return [
            'update' => [
                'id'         => $this->update->id,
                'ulid'       => $this->update->ulid,
                'content'    => $this->update->content,
                'images'     => $this->update->images ?? [],
                'links'      => $this->update->links ?? [],
                'day_number' => $this->update->day_number,
                'created_at' => $this->update->created_at->toISOString(),
                'reactions'  => [],
                'comments'   => [],
                'user'       => [
                    'id'     => $user->id,
                    'name'   => $user->name,
                    'avatar' => $user->avatar,
                    'ulid'   => $user->ulid ?? null,
                ],
            ],
        ];
    }
}
