<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Notification;

class NotificationService
{
    public static function create(
        User $user,
        string $type,
        string $message,
        ?User $actor = null,
        ?array $data = null
    ): void {
        $notificationData = array_merge($data ?? [], [
            'message' => $message,
            'actor_id' => $actor?->id,
        ]);

        \DB::table('notifications')->insert([
            'id' => \Str::uuid(),
            'type' => $type,
            'notifiable_type' => User::class,
            'notifiable_id' => $user->id,
            'data' => json_encode($notificationData),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public static function newFollower(User $user, User $follower): void
    {
        self::create(
            $user,
            'new_follower',
            "{$follower->name} started following you",
            $follower,
            ['follower_id' => $follower->id]
        );
    }

    public static function newComment(User $updateOwner, User $commenter, $update, $comment): void
    {
        if ($updateOwner->id !== $commenter->id) {
            self::create(
                $updateOwner,
                'new_comment',
                "{$commenter->name} commented on your post",
                $commenter,
                [
                    'update_id' => $update->id,
                    'comment_id' => $comment->id,
                    'sprint_id' => $update->sprint_id,
                ]
            );
        }
    }

    public static function newReaction(User $updateOwner, User $reactor, $update): void
    {
        if ($updateOwner->id !== $reactor->id) {
            self::create(
                $updateOwner,
                'new_reaction',
                "{$reactor->name} liked your post",
                $reactor,
                [
                    'update_id' => $update->id,
                    'sprint_id' => $update->sprint_id,
                ]
            );
        }
    }

    public static function sprintMilestone(User $user, $sprint, string $milestone): void
    {
        self::create(
            $user,
            'sprint_milestone',
            "Sprint '{$sprint->title}' {$milestone}",
            null,
            ['sprint_id' => $sprint->id]
        );
    }

    public static function newParticipant(User $sprintOwner, User $participant, $sprint): void
    {
        if ($sprintOwner->id !== $participant->id) {
            self::create(
                $sprintOwner,
                'new_participant',
                "{$participant->name} joined your sprint '{$sprint->title}'",
                $participant,
                ['sprint_id' => $sprint->id]
            );
        }
    }
}
