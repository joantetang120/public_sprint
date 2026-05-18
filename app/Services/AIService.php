<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class AIService
{
    public function generateSprintSummary($sprint, $userParticipation, $updates, $style = 'professional'): string
    {
        $updates = $updates->sortBy('day_number')->values();

        $gallery = $this->buildGallery($updates);
        $resources = $this->collectResources($updates);
        $metrics = $this->buildMetrics($sprint, $userParticipation, $updates, $gallery, $resources);
        $timeline = $this->buildTimeline($updates);
        $accomplishments = $this->buildAccomplishments($metrics, $timeline, $resources);
        $lessons = $this->buildLessons($sprint, $metrics, $resources, $gallery);
        $headline = $this->buildHeadline($sprint, $metrics, $style);
        $summary = $this->buildSummary($sprint, $metrics, $accomplishments, $style);
        $hashtags = $this->buildHashtags($style);

        $report = [
            'version' => 'sprint-report-v2',
            'style' => $style,
            'generated_at' => now()->toIso8601String(),
            'headline' => $headline,
            'subheadline' => $this->buildSubheadline($sprint, $metrics),
            'preview' => $summary,
            'summary' => $summary,
            'metrics' => $metrics,
            'accomplishments' => $accomplishments,
            'timeline' => $timeline,
            'lessons' => $lessons,
            'resources' => $resources,
            'gallery' => $gallery,
            'hashtags' => $hashtags,
            'formats' => [
                'linkedin' => $this->buildLinkedInPost($headline, $summary, $metrics, $accomplishments, $hashtags),
                'portfolio' => $this->buildPortfolioCopy($headline, $summary, $metrics, $timeline, $lessons, $resources),
                'caption' => $this->buildShortCaption($headline, $metrics),
            ],
        ];

        return json_encode($report, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    private function buildHeadline($sprint, array $metrics, string $style): string
    {
        $lead = match ($style) {
            'casual' => 'Wrapped up',
            'technical' => 'Completed',
            default => 'Finished',
        };

        return $lead . ' a ' . $sprint->duration_days . '-day sprint: ' . $sprint->title;
    }

    private function buildSubheadline($sprint, array $metrics): string
    {
        return implode(' | ', [
            $metrics['updates_posted'] . ' updates',
            $metrics['score'] . ' points',
            $metrics['reactions_received'] . ' reactions',
            'Rank ' . $metrics['rank_label'],
        ]);
    }

    private function buildSummary($sprint, array $metrics, array $accomplishments, string $style): string
    {
        $opening = match ($style) {
            'casual' => 'This sprint turned into a strong build log with clear momentum from start to finish.',
            'technical' => 'This sprint produced a documented record of execution, iteration, and visible output.',
            default => 'This sprint closed with a clear record of progress, shipped work, and steady accountability.',
        };

        $middle = 'Across ' . $metrics['updates_posted'] . ' updates, the journey captured ' .
            $metrics['images_count'] . ' visual snapshots and ' . $metrics['resources_count'] . ' linked resources.';

        $ending = 'The strongest themes were ' . Str::lower($accomplishments[0]) . ' and ' . Str::lower($accomplishments[1]) . '.';

        return implode(' ', [$opening, $middle, $ending]);
    }

    private function buildMetrics($sprint, $userParticipation, Collection $updates, array $gallery, array $resources): array
    {
        $rank = $userParticipation->pivot->rank;
        $score = (float) ($userParticipation->pivot->score ?? 0);
        $badges = $this->normalizeBadges($userParticipation->pivot->badges ?? []);

        return [
            'duration_days' => (int) $sprint->duration_days,
            'updates_posted' => (int) $updates->count(),
            'reactions_received' => (int) ($userParticipation->pivot->reactions_received ?? 0),
            'comments_made' => (int) ($userParticipation->pivot->comments_made ?? 0),
            'score' => $this->formatNumber($score),
            'score_value' => $score,
            'rank' => $rank ? (int) $rank : null,
            'rank_label' => $rank ? '#' . $rank : 'unranked',
            'images_count' => count($gallery),
            'resources_count' => count($resources),
            'badges' => $badges,
        ];
    }

    private function buildAccomplishments(array $metrics, array $timeline, array $resources): array
    {
        $items = [
            'Maintained a public record across ' . $metrics['updates_posted'] . ' sprint check-ins',
            'Finished with ' . $metrics['score'] . ' points and ' . $metrics['reactions_received'] . ' community reactions',
            $metrics['images_count'] > 0
                ? 'Captured the journey with ' . $metrics['images_count'] . ' progress images'
                : 'Kept the sprint focused on written progress and outcomes',
            count($resources) > 0
                ? 'Shared ' . count($resources) . ' supporting link' . (count($resources) === 1 ? '' : 's') . ' for demos or resources'
                : 'Wrapped the sprint without relying on external resource links',
        ];

        if (!empty($timeline)) {
            $items[] = 'Documented clear milestones from day ' . $timeline[0]['day_number'] . ' through day ' . $timeline[array_key_last($timeline)]['day_number'];
        }

        return array_slice(array_values(array_unique($items)), 0, 4);
    }

    private function buildLessons($sprint, array $metrics, array $resources, array $gallery): array
    {
        $lessons = [];

        if ($metrics['updates_posted'] >= max(2, (int) ceil($sprint->duration_days * 0.6))) {
            $lessons[] = 'Consistency over the full sprint mattered more than one big push.';
        } else {
            $lessons[] = 'Even a lighter sprint leaves a useful trail when each check-in captures the next move.';
        }

        $lessons[] = count($gallery) > 0
            ? 'Visual proof made the sprint easier to review and share.'
            : 'Written reflections still created a strong end-of-sprint narrative.';

        $lessons[] = count($resources) > 0
            ? 'Linking demos and references made the report more reusable outside the app.'
            : 'A tighter sprint can still read well when the core outcomes are clearly described.';

        return array_slice($lessons, 0, 3);
    }

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
                'title' => $this->timelineLabel($index, $milestones->count()),
                'day_number' => (int) $update->day_number,
                'summary' => $this->truncateSentence($update->content, 140),
                'image_count' => count($this->normalizeArrayField($update->images)) + ($update->image ? 1 : 0),
                'link_count' => count($this->normalizeArrayField($update->links)),
            ];
        })->all();
    }

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
                    'url' => $path,
                    'day_number' => (int) $update->day_number,
                    'caption' => 'Day ' . $update->day_number . ': ' . $this->truncateSentence($update->content, 90),
                    'position' => $index + 1,
                ];
            }
        }

        return array_slice($gallery, 0, 9);
    }

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

    private function buildLinkedInPost(string $headline, string $summary, array $metrics, array $accomplishments, array $hashtags): string
    {
        $bullets = collect($accomplishments)
            ->take(3)
            ->map(fn ($item) => '- ' . $item)
            ->implode("\n");

        return $headline . "\n\n" .
            $summary . "\n\n" .
            "What stood out:\n" .
            $bullets . "\n\n" .
            "Sprint metrics:\n" .
            '- ' . $metrics['updates_posted'] . " updates logged\n" .
            '- ' . $metrics['score'] . " points earned\n" .
            '- ' . $metrics['reactions_received'] . " reactions received\n" .
            '- Finished ' . $metrics['rank_label'] . "\n\n" .
            implode(' ', $hashtags);
    }

    private function buildPortfolioCopy(string $headline, string $summary, array $metrics, array $timeline, array $lessons, array $resources): string
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

        return $headline . "\n\n" .
            "Overview\n" .
            $summary . "\n\n" .
            "Metrics\n" .
            '- Duration: ' . $metrics['duration_days'] . " days\n" .
            '- Updates posted: ' . $metrics['updates_posted'] . "\n" .
            '- Score: ' . $metrics['score'] . "\n" .
            '- Reactions received: ' . $metrics['reactions_received'] . "\n" .
            '- Rank: ' . $metrics['rank_label'] . "\n\n" .
            "Timeline\n" .
            $timelineText . "\n\n" .
            "Lessons\n" .
            $lessonsText . "\n\n" .
            "Resources\n" .
            $resourcesText;
    }

    private function buildShortCaption(string $headline, array $metrics): string
    {
        return $headline . ' | ' .
            $metrics['updates_posted'] . ' updates, ' .
            $metrics['score'] . ' points, ' .
            $metrics['reactions_received'] . ' reactions.';
    }

    private function buildHashtags(string $style): array
    {
        return match ($style) {
            'casual' => ['#BuildInPublic', '#PublicSprint', '#ProgressLog', '#CreativeMomentum'],
            'technical' => ['#BuildInPublic', '#PublicSprint', '#DevLog', '#EngineeringProgress'],
            default => ['#BuildInPublic', '#PublicSprint', '#SprintReport', '#GrowthThroughConsistency'],
        };
    }

    private function normalizeBadges($badges): array
    {
        $decoded = is_string($badges) ? json_decode($badges, true) : $badges;
        $decoded = is_array($decoded) ? $decoded : [];

        return array_values(array_map(function ($badge) {
            return [
                'key' => $badge,
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
        if ($index === 0) {
            return 'Kickoff';
        }

        if ($index === $count - 1) {
            return 'Finish';
        }

        return 'Milestone ' . $index;
    }

    private function truncateSentence(?string $text, int $limit): string
    {
        return Str::of((string) $text)
            ->squish()
            ->limit($limit, '...')
            ->toString();
    }

    private function formatNumber(float $value): string
    {
        return fmod($value, 1.0) === 0.0
            ? number_format($value, 0, '.', '')
            : number_format($value, 1, '.', '');
    }
}
