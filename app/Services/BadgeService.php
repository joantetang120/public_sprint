<?php

namespace App\Services;

use App\Models\Sprint;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class BadgeService
{
    /**
     * Calculate and award badges for all participants in a sprint
     */
    public static function calculateBadges(Sprint $sprint): void
    {
        $participants = $sprint->participants()
            ->withPivot(['updates_posted', 'reactions_received', 'comments_made', 'score'])
            ->get();

        if ($participants->isEmpty()) {
            return;
        }

        // Calculate thresholds
        $topScore = $participants->max('pivot.score');
        $topUpdates = $participants->max('pivot.updates_posted');
        $topReactions = $participants->max('pivot.reactions_received');
        $topComments = $participants->max('pivot.comments_made');

        foreach ($participants as $participant) {
            $badges = [];
            $score = $participant->pivot->score ?? 0;
            $updates = $participant->pivot->updates_posted ?? 0;
            $reactions = $participant->pivot->reactions_received ?? 0;
            $comments = $participant->pivot->comments_made ?? 0;

            // Top Contributor Badge (Top 10% by score)
            if ($topScore > 0 && $score >= ($topScore * 0.9)) {
                $badges[] = 'top_contributor';
            }

            // Daily Streak Badge (Posted updates for at least 70% of days)
            $requiredUpdates = ceil($sprint->duration_days * 0.7);
            if ($updates >= $requiredUpdates) {
                $badges[] = 'daily_streak';
            }

            // Most Helpful Badge (High engagement through comments and reactions)
            $engagementScore = ($reactions * 2) + ($comments * 3);
            $topEngagement = ($topReactions * 2) + ($topComments * 3);
            if ($topEngagement > 0 && $engagementScore >= ($topEngagement * 0.8)) {
                $badges[] = 'most_helpful';
            }

            // Early Bird Badge (Joined within first 24 hours of sprint creation)
            $joinedAt = $participant->pivot->joined_at;
            $sprintCreatedAt = $sprint->created_at;
            if ($joinedAt && $sprintCreatedAt) {
                $joinedAtCarbon = \Carbon\Carbon::parse($joinedAt);
                $hoursDiff = $joinedAtCarbon->diffInHours($sprintCreatedAt);
                if ($hoursDiff <= 24) {
                    $badges[] = 'early_bird';
                }
            }

            // Consistent Builder Badge (Posted updates on consecutive days)
            if ($updates >= 5 && $updates >= ($sprint->duration_days * 0.5)) {
                $badges[] = 'consistent_builder';
            }

            // Update badges in database
            $sprint->participants()->updateExistingPivot($participant->id, [
                'badges' => json_encode($badges),
            ]);
        }
    }

    /**
     * Calculate and update rankings for all participants in a sprint
     */
    public static function updateRankings(Sprint $sprint): void
    {
        $participants = DB::table('sprint_participants')
            ->where('sprint_id', $sprint->id)
            ->orderByDesc('score')
            ->get();

        $rank = 1;
        $previousScore = null;
        $sameRankCount = 0;

        foreach ($participants as $index => $participant) {
            // Handle tied scores
            if ($previousScore !== null && $participant->score < $previousScore) {
                $rank = $index + 1;
                $sameRankCount = 0;
            } elseif ($previousScore !== null && $participant->score === $previousScore) {
                $sameRankCount++;
            }

            DB::table('sprint_participants')
                ->where('sprint_id', $sprint->id)
                ->where('user_id', $participant->user_id)
                ->update(['rank' => $rank]);

            $previousScore = $participant->score;
        }
    }

    /**
     * Get badge display information
     */
    public static function getBadgeInfo(string $badgeKey): array
    {
        $badges = [
            'top_contributor' => [
                'name' => 'Top Contributor',
                'description' => 'Among the top 10% performers',
                'icon' => 'star',
                'color' => 'purple',
            ],
            'daily_streak' => [
                'name' => 'Daily Streak',
                'description' => 'Posted updates consistently',
                'icon' => 'flame',
                'color' => 'orange',
            ],
            'most_helpful' => [
                'name' => 'Most Helpful',
                'description' => 'High engagement with community',
                'icon' => 'heart',
                'color' => 'blue',
            ],
            'early_bird' => [
                'name' => 'Early Bird',
                'description' => 'Joined within first 24 hours',
                'icon' => 'zap',
                'color' => 'yellow',
            ],
            'consistent_builder' => [
                'name' => 'Consistent Builder',
                'description' => 'Regular updates throughout sprint',
                'icon' => 'target',
                'color' => 'green',
            ],
        ];

        return $badges[$badgeKey] ?? [
            'name' => 'Unknown Badge',
            'description' => '',
            'icon' => 'award',
            'color' => 'gray',
        ];
    }
}
