<?php

namespace App\Services;

use App\Notifications\CommentActivityEmail;
use App\Notifications\ReactionActivityEmail;
use App\Notifications\SprintCompletedEmail;
use App\Notifications\SprintUpdateEmail;
use App\Models\User;

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

            if ($updateOwner->wantsCommentNotifications()) {
                $updateOwner->notify(new CommentActivityEmail($commenter, $update, $comment));
            }
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

            if ($updateOwner->wantsReactionNotifications()) {
                $updateOwner->notify(new ReactionActivityEmail($reactor, $update));
            }
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

    public static function sprintUpdate($sprint, User $author, $update): void
    {
        $participants = $sprint->participants()
            ->where('users.id', '!=', $author->id)
            ->get();

        foreach ($participants as $participant) {
            if ($participant->wantsSprintUpdateNotifications()) {
                $participant->notify(new SprintUpdateEmail($author, $sprint, $update));
            }
        }
    }

    public static function sprintCompleted($sprint): void
    {
        $participants = $sprint->participants()->get();

        foreach ($participants as $participant) {
            if ($participant->wantsSprintCompletionNotifications()) {
                $participant->notify(new SprintCompletedEmail($sprint));
            }
        }
    }
}
