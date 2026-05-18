<?php

namespace App\Services;

use App\Models\Comment;
use App\Models\Reaction;
use App\Models\Update;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EngagementService
{
    public static function recordPublishedUpdate(Update $update): void
    {
        self::adjustParticipantStats(
            $update->sprint_id,
            $update->user_id,
            ['updates_posted' => 1],
            2
        );
    }

    public static function recordCommentCreated(Comment $comment): void
    {
        $comment->loadMissing('sprintUpdate.sprint');

        $comment->sprintUpdate->increment('comments_count');

        if ($comment->parent_id) {
            Comment::whereKey($comment->parent_id)->increment('replies_count');
        }

        self::adjustParticipantStats(
            $comment->sprintUpdate->sprint_id,
            $comment->user_id,
            ['comments_made' => 1],
            0.5
        );
    }

    public static function deleteCommentThread(Comment $comment): void
    {
        DB::transaction(function () use ($comment) {
            $comment->loadMissing('sprintUpdate.sprint');

            $threadComments = self::collectCommentThread($comment);
            $removedCount = $threadComments->count();

            if ($removedCount === 0) {
                return;
            }

            self::decrementCounter('updates', $comment->update_id, 'comments_count', $removedCount);

            if ($comment->parent_id) {
                self::decrementCounter('comments', $comment->parent_id, 'replies_count', 1);
            }

            $threadComments
                ->groupBy('user_id')
                ->each(function (Collection $userComments, int $userId) use ($comment) {
                    $count = $userComments->count();

                    self::adjustParticipantStats(
                        $comment->sprintUpdate->sprint_id,
                        $userId,
                        ['comments_made' => -$count],
                        -0.5 * $count
                    );
                });

            $comment->delete();
        });
    }

    public static function recordReactionCreated(Update $update): void
    {
        $update->loadMissing('sprint', 'user');

        $update->increment('reactions_count');

        self::adjustParticipantStats(
            $update->sprint_id,
            $update->user_id,
            ['reactions_received' => 1],
            1
        );

        self::incrementUserCounter($update->user_id, 'total_likes', 1);
    }

    public static function deleteReaction(Reaction $reaction): void
    {
        DB::transaction(function () use ($reaction) {
            $reaction->loadMissing('postUpdate.sprint', 'postUpdate.user');

            $update = $reaction->postUpdate;

            if (!$update) {
                $reaction->delete();
                return;
            }

            self::decrementCounter('updates', $update->id, 'reactions_count', 1);

            self::adjustParticipantStats(
                $update->sprint_id,
                $update->user_id,
                ['reactions_received' => -1],
                -1
            );

            self::decrementUserCounter($update->user_id, 'total_likes', 1);

            $reaction->delete();
        });
    }

    public static function deleteUpdate(Update $update): void
    {
        DB::transaction(function () use ($update) {
            $update->loadMissing('sprint', 'user');

            $reactionsCount = Reaction::where('update_id', $update->id)->count();
            $commentCountsByUser = Comment::query()
                ->where('update_id', $update->id)
                ->selectRaw('user_id, COUNT(*) as total')
                ->groupBy('user_id')
                ->pluck('total', 'user_id');

            if (!$update->is_draft) {
                self::decrementCounter('sprints', $update->sprint_id, 'updates_count', 1);

                self::adjustParticipantStats(
                    $update->sprint_id,
                    $update->user_id,
                    ['updates_posted' => -1],
                    -2
                );
            }

            if ($reactionsCount > 0) {
                self::adjustParticipantStats(
                    $update->sprint_id,
                    $update->user_id,
                    ['reactions_received' => -$reactionsCount],
                    -1 * $reactionsCount
                );

                self::decrementUserCounter($update->user_id, 'total_likes', $reactionsCount);
            }

            foreach ($commentCountsByUser as $userId => $count) {
                self::adjustParticipantStats(
                    $update->sprint_id,
                    (int) $userId,
                    ['comments_made' => -$count],
                    -0.5 * $count
                );
            }

            self::deleteUpdateMedia($update);

            $update->delete();
        });
    }

    public static function deleteUserData(User $user): void
    {
        DB::transaction(function () use ($user) {
            self::reconcileFollowCounters($user);

            $externalUserComments = Comment::query()
                ->where('user_id', $user->id)
                ->whereHas('sprintUpdate', fn ($query) => $query->where('user_id', '!=', $user->id))
                ->get(['id', 'parent_id']);

            $externalCommentIds = $externalUserComments->pluck('id');

            $rootCommentIds = $externalUserComments
                ->filter(fn (Comment $comment) => !$comment->parent_id || !$externalCommentIds->contains($comment->parent_id))
                ->pluck('id');

            Comment::whereIn('id', $rootCommentIds)
                ->get()
                ->each(fn (Comment $comment) => self::deleteCommentThread($comment));

            Reaction::query()
                ->where('user_id', $user->id)
                ->whereHas('postUpdate', fn ($query) => $query->where('user_id', '!=', $user->id))
                ->get()
                ->each(fn (Reaction $reaction) => self::deleteReaction($reaction));

            Update::where('user_id', $user->id)
                ->get()
                ->each(fn (Update $update) => self::deleteUpdate($update));

            $user->sprints()->detach();

            DB::table('follows')
                ->where('follower_id', $user->id)
                ->orWhere('following_id', $user->id)
                ->delete();

            DB::table('notifications')
                ->where('notifiable_type', User::class)
                ->where('notifiable_id', $user->id)
                ->delete();

            Comment::where('user_id', $user->id)->delete();
            Reaction::where('user_id', $user->id)->delete();
        });
    }

    private static function collectCommentThread(Comment $rootComment): Collection
    {
        $threadComments = collect([$rootComment]);
        $pendingIds = [$rootComment->id];

        while (!empty($pendingIds)) {
            $children = Comment::query()
                ->whereIn('parent_id', $pendingIds)
                ->get();

            if ($children->isEmpty()) {
                break;
            }

            $threadComments = $threadComments->concat($children);
            $pendingIds = $children->pluck('id')->all();
        }

        return $threadComments->unique('id')->values();
    }

    private static function adjustParticipantStats(int $sprintId, int $userId, array $counterDeltas = [], float $scoreDelta = 0): void
    {
        $query = DB::table('sprint_participants')
            ->where('sprint_id', $sprintId)
            ->where('user_id', $userId);

        if (!$query->exists()) {
            return;
        }

        $updates = [];

        foreach ($counterDeltas as $column => $delta) {
            if ($delta === 0) {
                continue;
            }

            $updates[$column] = $delta > 0
                ? DB::raw($column . ' + ' . $delta)
                : self::safeDecrementExpression($column, abs($delta));
        }

        if ($scoreDelta !== 0.0) {
            $updates['score'] = $scoreDelta > 0
                ? DB::raw('score + ' . $scoreDelta)
                : self::safeDecrementExpression('score', abs($scoreDelta));
        }

        if (!empty($updates)) {
            $query->update($updates);
        }
    }

    private static function reconcileFollowCounters(User $user): void
    {
        $followingIds = DB::table('follows')
            ->where('follower_id', $user->id)
            ->pluck('following_id');

        foreach ($followingIds as $followingId) {
            self::decrementUserCounter((int) $followingId, 'followers_count', 1);
        }

        $followerIds = DB::table('follows')
            ->where('following_id', $user->id)
            ->pluck('follower_id');

        foreach ($followerIds as $followerId) {
            self::decrementUserCounter((int) $followerId, 'following_count', 1);
        }
    }

    private static function incrementUserCounter(int $userId, string $column, int $amount): void
    {
        DB::table('users')
            ->where('id', $userId)
            ->update([$column => DB::raw($column . ' + ' . $amount)]);
    }

    private static function decrementUserCounter(int $userId, string $column, int $amount): void
    {
        DB::table('users')
            ->where('id', $userId)
            ->update([$column => self::safeDecrementExpression($column, $amount)]);
    }

    private static function decrementCounter(string $table, int $id, string $column, int $amount): void
    {
        DB::table($table)
            ->where('id', $id)
            ->update([$column => self::safeDecrementExpression($column, $amount)]);
    }

    private static function safeDecrementExpression(string $column, int|float $amount)
    {
        return DB::raw("CASE WHEN {$column} >= {$amount} THEN {$column} - {$amount} ELSE 0 END");
    }

    private static function deleteUpdateMedia(Update $update): void
    {
        if (!$update->image) {
            return;
        }

        if (str_starts_with($update->image, 'http')) {
            Storage::disk('cloudinary')->delete($update->image);
            return;
        }

        Storage::disk('public')->delete($update->image);
    }
}
