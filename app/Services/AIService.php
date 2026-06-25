<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class AIService
{
    public function generateSprintSummary($sprint, $userParticipation, $updates, $style = 'professional'): string
    {
        $updates = $updates->sortBy('day_number')->values();

        $gallery    = $this->buildGallery($updates);
        $resources  = $this->collectResources($updates);
        $streak     = $this->computeStreak($updates, $sprint);
        $metrics    = $this->buildMetrics($sprint, $userParticipation, $updates, $gallery, $resources, $streak);
        $timeline   = $this->buildTimeline($updates);
        $accomplishments = $this->buildAccomplishments($metrics, $timeline, $resources, $streak);
        $lessons    = $this->buildLessons($sprint, $metrics, $resources, $gallery, $streak);
        $headline   = $this->buildHeadline($sprint, $metrics, $style, $streak);
        $summary    = $this->buildSummary($sprint, $metrics, $accomplishments, $style, $streak);
        $hashtags   = $this->buildHashtags($style);

        $report = [
            'version'       => 'sprint-report-v2',
            'style'         => $style,
            'generated_at'  => now()->toIso8601String(),
            'headline'      => $headline,
            'subheadline'   => $this->buildSubheadline($sprint, $metrics, $streak),
            'preview'       => $summary,
            'summary'       => $summary,
            'metrics'       => $metrics,
            'accomplishments' => $accomplishments,
            'timeline'      => $timeline,
            'lessons'       => $lessons,
            'resources'     => $resources,
            'gallery'       => $gallery,
            'hashtags'      => $hashtags,
            'formats'       => [
                'linkedin'  => $this->buildLinkedInPost($headline, $summary, $metrics, $accomplishments, $hashtags, $streak, $style),
                'twitter'   => $this->buildTwitterPost($sprint, $metrics, $streak, $hashtags),
                'portfolio' => $this->buildPortfolioCopy($headline, $summary, $metrics, $timeline, $lessons, $resources, $streak),
                'caption'   => $this->buildShortCaption($headline, $metrics, $streak),
            ],
        ];

        return json_encode($report, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    // ─── Streak ──────────────────────────────────────────────────────────────

    private function computeStreak(Collection $updates, $sprint): array
    {
        $duration    = (int) $sprint->duration_days;
        $posted      = $updates->pluck('day_number')->map(fn ($d) => (int) $d)->unique()->sort()->values()->all();
        $totalPosted = count($posted);
        $perfectDays = range(1, $duration);
        $isPerfect   = $totalPosted === $duration && count(array_diff($perfectDays, $posted)) === 0;

        // Longest consecutive run
        $maxRun = 0;
        $run    = 0;
        $prev   = null;
        foreach ($posted as $day) {
            if ($prev !== null && $day === $prev + 1) {
                $run++;
            } else {
                $run = 1;
            }
            $maxRun = max($maxRun, $run);
            $prev   = $day;
        }

        $rate = $duration > 0 ? round(($totalPosted / $duration) * 100) : 0;

        return [
            'is_perfect'   => $isPerfect,
            'posted_days'  => $posted,
            'total_posted' => $totalPosted,
            'max_run'      => $maxRun,
            'rate'         => $rate,          // percentage 0–100
        ];
    }

    // ─── Headline ─────────────────────────────────────────────────────────────

    private function buildHeadline($sprint, array $metrics, string $style, array $streak): string
    {
        $days  = $sprint->duration_days;
        $title = $sprint->title;

        if ($streak['is_perfect']) {
            return match ($style) {
                'casual'    => "Hit every single day — {$days}-day sprint done: {$title}",
                'technical' => "Full-coverage sprint: {$days}/{$days} days logged — {$title}",
                default     => "Completed {$days} for {$days}: {$title}",
            };
        }

        if ($metrics['rank'] === 1) {
            return match ($style) {
                'casual'    => "Finished #1 — {$days}-day sprint wrapped: {$title}",
                'technical' => "Ranked #1 after {$days}-day execution sprint: {$title}",
                default     => "Finished #1 in the {$days}-day sprint: {$title}",
            };
        }

        if ($streak['rate'] >= 70) {
            return match ($style) {
                'casual'    => "Wrapped up a strong {$days}-day sprint: {$title}",
                'technical' => "Completed {$days}-day sprint at {$streak['rate']}% consistency: {$title}",
                default     => "Finished a {$days}-day sprint: {$title}",
            };
        }

        return match ($style) {
            'casual'    => "Wrapped up my {$days}-day sprint: {$title}",
            'technical' => "Completed {$days}-day sprint: {$title}",
            default     => "Finished a {$days}-day sprint: {$title}",
        };
    }

    // ─── Subheadline ──────────────────────────────────────────────────────────

    private function buildSubheadline($sprint, array $metrics, array $streak): string
    {
        $parts = [
            $metrics['updates_posted'] . '/' . $sprint->duration_days . ' days',
            $metrics['score'] . ' pts',
            $metrics['reactions_received'] . ' reactions',
            'Rank ' . $metrics['rank_label'],
        ];

        if ($streak['is_perfect']) {
            $parts[] = '100% consistent';
        } elseif ($streak['rate'] >= 50) {
            $parts[] = $streak['rate'] . '% consistency';
        }

        return implode(' · ', $parts);
    }

    // ─── Summary body ─────────────────────────────────────────────────────────

    private function buildSummary($sprint, array $metrics, array $accomplishments, string $style, array $streak): string
    {
        $days    = $sprint->duration_days;
        $updates = $metrics['updates_posted'];

        // Opening — vary by style and achievement
        if ($streak['is_perfect']) {
            $opening = match ($style) {
                'casual'    => "Every single day checked off — this sprint went the full {$days} days without a miss.",
                'technical' => "This sprint achieved full-day coverage: {$updates} updates across all {$days} sprint days.",
                default     => "This sprint closed with a perfect consistency record — {$updates} updates logged across all {$days} days.",
            };
        } elseif ($metrics['rank'] === 1) {
            $opening = match ($style) {
                'casual'    => "This one ended at the top of the leaderboard — a strong run from start to finish.",
                'technical' => "This sprint produced the highest score in the leaderboard across {$updates} logged updates.",
                default     => "This sprint closed at rank #1 with {$updates} public updates and a steady pace throughout.",
            };
        } else {
            $opening = match ($style) {
                'casual'    => "This sprint turned into a solid build log with clear momentum from start to finish.",
                'technical' => "This sprint produced a documented record of execution, iteration, and visible output.",
                default     => "This sprint closed with a clear record of progress, shipped work, and steady accountability.",
            };
        }

        // Middle — specific data
        $middle = "Across {$updates} updates" . ($metrics['images_count'] > 0 ? ", the journey captured {$metrics['images_count']} visual snapshots" : '') .
            ($metrics['resources_count'] > 0 ? " and {$metrics['resources_count']} linked resources" : '') . '.';

        // Ending — top accomplishment
        $ending = 'The strongest themes were ' . Str::lower($accomplishments[0]) . ' and ' . Str::lower($accomplishments[1]) . '.';

        return implode(' ', [$opening, $middle, $ending]);
    }

    // ─── Metrics ──────────────────────────────────────────────────────────────

    private function buildMetrics($sprint, $userParticipation, Collection $updates, array $gallery, array $resources, array $streak): array
    {
        $rank    = $userParticipation->pivot->rank;
        $score   = (float) ($userParticipation->pivot->score ?? 0);
        $badges  = $this->normalizeBadges($userParticipation->pivot->badges ?? []);

        return [
            'duration_days'       => (int) $sprint->duration_days,
            'updates_posted'      => (int) $updates->count(),
            'reactions_received'  => (int) ($userParticipation->pivot->reactions_received ?? 0),
            'comments_made'       => (int) ($userParticipation->pivot->comments_made ?? 0),
            'score'               => $this->formatNumber($score),
            'score_value'         => $score,
            'rank'                => $rank ? (int) $rank : null,
            'rank_label'          => $rank ? '#' . $rank : 'unranked',
            'images_count'        => count($gallery),
            'resources_count'     => count($resources),
            'badges'              => $badges,
            'consistency_rate'    => $streak['rate'],
            'longest_run'         => $streak['max_run'],
            'is_perfect'          => $streak['is_perfect'],
        ];
    }

    // ─── Accomplishments ──────────────────────────────────────────────────────

    private function buildAccomplishments(array $metrics, array $timeline, array $resources, array $streak): array
    {
        $items = [];

        // Perfect streak — highlight first
        if ($streak['is_perfect']) {
            $items[] = 'Showed up every single day — ' . $metrics['duration_days'] . ' for ' . $metrics['duration_days'] . ' consistency';
        } elseif ($streak['max_run'] >= 3) {
            $items[] = 'Kept a ' . $streak['max_run'] . '-day consecutive posting streak during the sprint';
        }

        // Rank highlight
        if ($metrics['rank'] === 1) {
            $items[] = 'Finished #1 on the sprint leaderboard with ' . $metrics['score'] . ' points';
        } elseif ($metrics['rank'] !== null && $metrics['rank'] <= 3) {
            $items[] = 'Placed ' . $metrics['rank_label'] . ' on the leaderboard with ' . $metrics['score'] . ' points';
        }

        // Always-present items
        $items[] = 'Maintained a public record across ' . $metrics['updates_posted'] . ' sprint check-ins';
        $items[] = 'Earned ' . $metrics['reactions_received'] . ' community reactions across all updates';

        $items[] = $metrics['images_count'] > 0
            ? 'Captured the journey with ' . $metrics['images_count'] . ' progress image' . ($metrics['images_count'] > 1 ? 's' : '')
            : 'Kept the sprint focused on written progress and outcomes';

        if (count($resources) > 0) {
            $items[] = 'Linked ' . count($resources) . ' resource' . (count($resources) === 1 ? '' : 's') . ' for demos or references';
        }

        if (!empty($timeline)) {
            $first = $timeline[0]['day_number'];
            $last  = $timeline[array_key_last($timeline)]['day_number'];
            $items[] = 'Documented clear milestones from day ' . $first . ' through day ' . $last;
        }

        return array_slice(array_values(array_unique($items)), 0, 4);
    }

    // ─── Lessons ──────────────────────────────────────────────────────────────

    private function buildLessons($sprint, array $metrics, array $resources, array $gallery, array $streak): array
    {
        $lessons = [];

        if ($streak['is_perfect']) {
            $lessons[] = 'Posting every day — even a short update — proved that showing up beats size of output.';
        } elseif ($streak['rate'] >= 70) {
            $lessons[] = 'Consistency over the full sprint mattered more than one big push at the end.';
        } else {
            $lessons[] = 'Even a lighter cadence leaves a useful trail when each check-in captures the next move.';
        }

        if ($metrics['reactions_received'] > 10) {
            $lessons[] = 'Public accountability triggered real engagement — the community responded to regular updates.';
        } elseif (count($gallery) > 0) {
            $lessons[] = 'Visual proof made the sprint easier to review and share with an audience.';
        } else {
            $lessons[] = 'Written reflections still created a strong end-of-sprint narrative without images.';
        }

        if ($metrics['rank'] !== null && $metrics['rank'] <= 3) {
            $lessons[] = 'Sustained effort across the sprint, not just early momentum, is what drove the final rank.';
        } elseif (count($resources) > 0) {
            $lessons[] = 'Linking demos and references made the report more reusable outside the app.';
        } else {
            $lessons[] = 'A focused sprint can still read well when the core outcomes are clearly described.';
        }

        return array_slice($lessons, 0, 3);
    }

    // ─── Timeline ─────────────────────────────────────────────────────────────

    private function buildTimeline(Collection $updates): array
    {
        if ($updates->isEmpty()) {
            return [];
        }

        $milestones = collect([
            $updates->first(),
            $updates->count() > 2 ? $updates->get((int) floor(($updates->count() - 1) / 2)) : null,
            $updates->count() > 3 ? $updates->get((int) floor(($updates->count() - 1) * 0.75)) : null,
            $updates->last(),
        ])
            ->filter()
            ->unique('id')
            ->values();

        return $milestones->map(function ($update, $index) use ($milestones) {
            return [
                'title'       => $this->timelineLabel($index, $milestones->count()),
                'day_number'  => (int) $update->day_number,
                'summary'     => $this->truncateSentence($update->content, 160),
                'image_count' => count($this->normalizeArrayField($update->images)) + ($update->image ? 1 : 0),
                'link_count'  => count($this->normalizeArrayField($update->links)),
            ];
        })->all();
    }

    // ─── Gallery ──────────────────────────────────────────────────────────────

    private function buildGallery(Collection $updates): array
    {
        $gallery = [];

        foreach ($updates as $update) {
            $paths = $this->normalizeArrayField($update->images);

            if ($update->image) {
                $paths[] = $update->image;
            }

            foreach (array_values(array_unique(array_filter($paths))) as $index => $path) {
                $gallery[] = [
                    'url'        => $path,
                    'day_number' => (int) $update->day_number,
                    'caption'    => 'Day ' . $update->day_number . ': ' . $this->truncateSentence($update->content, 90),
                    'position'   => $index + 1,
                ];
            }
        }

        return array_slice($gallery, 0, 9);
    }

    // ─── Resources ────────────────────────────────────────────────────────────

    private function collectResources(Collection $updates): array
    {
        $resources = [];

        foreach ($updates as $update) {
            foreach ($this->normalizeArrayField($update->links) as $link) {
                $resources[] = $link;
            }

            preg_match_all('/https?:\/\/[^\s]+/i', (string) $update->content, $matches);
            foreach ($matches[0] ?? [] as $link) {
                $resources[] = rtrim($link, '.,)');
            }
        }

        return array_slice(array_values(array_unique(array_filter($resources))), 0, 6);
    }

    // ─── Export formats ───────────────────────────────────────────────────────

    private function buildLinkedInPost(string $headline, string $summary, array $metrics, array $accomplishments, array $hashtags, array $streak, string $style): string
    {
        // Opening hook — personal, specific
        if ($streak['is_perfect']) {
            $hook = "I showed up every single day.\n\n" . $headline;
        } elseif ($metrics['rank'] === 1) {
            $hook = "Finished #1. Here's what that sprint looked like.\n\n" . $headline;
        } else {
            $hook = $headline;
        }

        $bullets = collect($accomplishments)
            ->take(3)
            ->map(fn ($item) => '→ ' . $item)
            ->implode("\n");

        $metricsBlock =
            '📊 Sprint metrics' . "\n" .
            '• ' . $metrics['updates_posted'] . ' public updates' . "\n" .
            '• ' . $metrics['score'] . ' points earned' . "\n" .
            '• ' . $metrics['reactions_received'] . ' reactions from the community' . "\n" .
            '• Finished ' . $metrics['rank_label'];

        if ($streak['is_perfect']) {
            $metricsBlock .= "\n" . '• 100% consistency — ' . $metrics['duration_days'] . ' for ' . $metrics['duration_days'] . ' days';
        } elseif ($streak['rate'] >= 50) {
            $metricsBlock .= "\n" . '• ' . $streak['rate'] . '% daily consistency';
        }

        $closing = match ($style) {
            'casual'    => "Building in public keeps me honest. Every check-in counts.",
            'technical' => "The log is the deliverable — public accountability compresses execution.",
            default     => "Public sprints create the accountability that solo work often lacks.",
        };

        return $hook . "\n\n" .
            $summary . "\n\n" .
            "What stood out:\n" .
            $bullets . "\n\n" .
            $metricsBlock . "\n\n" .
            $closing . "\n\n" .
            implode(' ', $hashtags);
    }

    private function buildTwitterPost($sprint, array $metrics, array $streak, array $hashtags): string
    {
        $days  = $sprint->duration_days;
        $title = Str::limit($sprint->title, 40);

        $lines = ["Just wrapped my {$days}-day sprint 🏁", '', "\u{201C}{$title}\u{201D}", ''];

        if ($streak['is_perfect']) {
            $lines[] = "✅ {$days}/{$days} days — perfect consistency";
        } else {
            $lines[] = "✅ {$metrics['updates_posted']}/{$days} days logged";
        }

        $lines[] = "🔥 {$metrics['reactions_received']} reactions";

        if ($metrics['rank'] !== null) {
            $lines[] = "🏆 Ranked {$metrics['rank_label']}";
        }

        $lines[] = '';
        $lines[] = implode(' ', array_slice($hashtags, 0, 2));

        $tweet = implode("\n", $lines);

        // Twitter hard limit is 280 chars — trim if needed
        if (mb_strlen($tweet) > 275) {
            $tweet = mb_substr($tweet, 0, 272) . '...';
        }

        return $tweet;
    }

    private function buildPortfolioCopy(string $headline, string $summary, array $metrics, array $timeline, array $lessons, array $resources, array $streak): string
    {
        $timelineText = collect($timeline)
            ->map(fn ($item) => '- Day ' . $item['day_number'] . ' (' . $item['title'] . '): ' . $item['summary'])
            ->implode("\n");

        $lessonsText = collect($lessons)
            ->map(fn ($item) => '- ' . $item)
            ->implode("\n");

        $resourcesText = empty($resources)
            ? '- No external resources were attached during this sprint.'
            : collect($resources)->map(fn ($item) => '- ' . $item)->implode("\n");

        $consistencyLine = $streak['is_perfect']
            ? '- Consistency: 100% (' . $metrics['duration_days'] . '/' . $metrics['duration_days'] . ' days)'
            : '- Consistency: ' . $streak['rate'] . '% (' . $metrics['updates_posted'] . '/' . $metrics['duration_days'] . ' days)';

        return $headline . "\n\n" .
            "Overview\n" .
            $summary . "\n\n" .
            "Metrics\n" .
            '- Duration: ' . $metrics['duration_days'] . " days\n" .
            '- Updates posted: ' . $metrics['updates_posted'] . "\n" .
            '- Score: ' . $metrics['score'] . "\n" .
            '- Reactions received: ' . $metrics['reactions_received'] . "\n" .
            '- Rank: ' . $metrics['rank_label'] . "\n" .
            $consistencyLine . "\n\n" .
            "Timeline\n" .
            $timelineText . "\n\n" .
            "Lessons\n" .
            $lessonsText . "\n\n" .
            "Resources\n" .
            $resourcesText;
    }

    private function buildShortCaption(string $headline, array $metrics, array $streak): string
    {
        $extra = $streak['is_perfect'] ? ', 100% consistent' : '';
        return $headline . ' | ' .
            $metrics['updates_posted'] . ' updates, ' .
            $metrics['score'] . ' points, ' .
            $metrics['reactions_received'] . ' reactions' .
            $extra . '.';
    }

    // ─── Hashtags ─────────────────────────────────────────────────────────────

    private function buildHashtags(string $style): array
    {
        return match ($style) {
            'casual'    => ['#BuildInPublic', '#PublicSprint', '#ProgressLog', '#CreativeMomentum'],
            'technical' => ['#BuildInPublic', '#PublicSprint', '#DevLog', '#EngineeringProgress'],
            default     => ['#BuildInPublic', '#PublicSprint', '#SprintReport', '#GrowthThroughConsistency'],
        };
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private function normalizeBadges($badges): array
    {
        $decoded = is_string($badges) ? json_decode($badges, true) : $badges;
        $decoded = is_array($decoded) ? $decoded : [];

        return array_values(array_map(function ($badge) {
            return [
                'key'   => $badge,
                'label' => Str::title(str_replace('_', ' ', $badge)),
            ];
        }, $decoded));
    }

    private function normalizeArrayField($value): array
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : [];
        }

        return is_array($value) ? $value : [];
    }

    private function timelineLabel(int $index, int $count): string
    {
        if ($index === 0) return 'Kickoff';
        if ($index === $count - 1) return 'Finish';
        return 'Milestone ' . $index;
    }

    private function truncateSentence(?string $text, int $limit): string
    {
        return Str::of((string) $text)->squish()->limit($limit, '...')->toString();
    }

    private function formatNumber(float $value): string
    {
        return fmod($value, 1.0) === 0.0
            ? number_format($value, 0, '.', '')
            : number_format($value, 1, '.', '');
    }
}
