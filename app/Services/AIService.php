<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIService
{
    private $apiKey;
    private $baseUrl = 'https://api.openai.com/v1';

    public function __construct()
    {
        $this->apiKey = config('services.openai.api_key');
    }

    /**
     * Generate a professional sprint summary using OpenAI
     */
    public function generateSprintSummary($sprint, $userParticipation, $updates, $style = 'professional')
    {
        if (!$this->apiKey) {
            Log::warning('OpenAI API key not configured');
            return $this->generateFallbackSummary($sprint, $userParticipation, $updates);
        }

        try {
            $prompt = $this->buildPrompt($sprint, $userParticipation, $updates, $style);
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post($this->baseUrl . '/chat/completions', [
                'model' => 'gpt-4o-mini',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $this->getSystemPrompt($style)
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'temperature' => 0.7,
                'max_tokens' => 500,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['choices'][0]['message']['content'] ?? $this->generateFallbackSummary($sprint, $userParticipation, $updates);
            }

            Log::error('OpenAI API error', ['response' => $response->body()]);
            return $this->generateFallbackSummary($sprint, $userParticipation, $updates);

        } catch (\Exception $e) {
            Log::error('AI Summary generation failed', ['error' => $e->getMessage()]);
            return $this->generateFallbackSummary($sprint, $userParticipation, $updates);
        }
    }

    private function getSystemPrompt($style)
    {
        $prompts = [
            'professional' => "You are a professional content writer specializing in LinkedIn posts. Create engaging, achievement-focused summaries that highlight accomplishments and learnings. Use professional language, include relevant emojis sparingly, and end with appropriate hashtags. Keep it concise (200-300 words) and inspiring.",
            
            'casual' => "You are a friendly content creator who writes in a conversational, authentic tone. Create relatable summaries that feel personal and genuine. Use casual language, emojis, and make it feel like a story someone would share with friends. Keep it engaging and real.",
            
            'technical' => "You are a technical writer who focuses on specific achievements, metrics, and technical learnings. Create detailed, data-driven summaries that highlight technical challenges overcome and skills developed. Use precise language and focus on concrete outcomes."
        ];

        return $prompts[$style] ?? $prompts['professional'];
    }

    private function buildPrompt($sprint, $userParticipation, $updates, $style)
    {
        $rank = $userParticipation->pivot->rank ?? 'N/A';
        $score = $userParticipation->pivot->score ?? 0;
        $updatesCount = $updates->count();
        $reactionsReceived = $userParticipation->pivot->reactions_received ?? 0;
        $badges = json_decode($userParticipation->pivot->badges ?? '[]', true);

        // Extract key themes from updates
        $updateContents = $updates->pluck('content')->take(10)->join("\n\n");
        
        $badgesList = '';
        if (!empty($badges)) {
            $badgeNames = array_map(function($badge) {
                return ucwords(str_replace('_', ' ', $badge));
            }, $badges);
            $badgesList = implode(', ', $badgeNames);
        }

        return "Write a {$style} summary for a completed sprint with these details:

Sprint Title: {$sprint->title}
Duration: {$sprint->duration_days} days
My Rank: #{$rank}
Updates Posted: {$updatesCount}
Points Earned: {$score}
Reactions Received: {$reactionsReceived}
Badges Earned: {$badgesList}

Sample of my updates:
{$updateContents}

Create an engaging summary that:
1. Celebrates the completion
2. Highlights key achievements and metrics
3. Shares 2-3 meaningful learnings or insights
4. Mentions the community/accountability aspect
5. Ends with relevant hashtags (#BuildInPublic #PublicSprint)

Make it authentic and inspiring, suitable for sharing on LinkedIn or Twitter.";
    }

    private function generateFallbackSummary($sprint, $userParticipation, $updates)
    {
        $rank = $userParticipation->pivot->rank ?? 'N/A';
        $score = $userParticipation->pivot->score ?? 0;
        $updatesCount = $updates->count();
        $badges = json_decode($userParticipation->pivot->badges ?? '[]', true);

        $badgeText = '';
        if (!empty($badges)) {
            $badgeNames = array_map(function($badge) {
                return ucwords(str_replace('_', ' ', $badge));
            }, $badges);
            $badgeText = "\n\n🏆 Achievements: " . implode(', ', $badgeNames);
        }

        return "🎉 Just completed a {$sprint->duration_days}-day sprint: \"{$sprint->title}\"!\n\n" .
               "📊 My Results:\n" .
               "• Ranked #{$rank} among participants\n" .
               "• Posted {$updatesCount} updates\n" .
               "• Earned {$score} points\n" .
               "{$badgeText}\n\n" .
               "Building in public has been an incredible journey. Each day brought new challenges and learnings. " .
               "The accountability and community support made all the difference.\n\n" .
               "Key takeaways:\n" .
               "✅ Consistency beats perfection\n" .
               "✅ Community accountability drives progress\n" .
               "✅ Sharing the journey creates connections\n\n" .
               "#BuildInPublic #PublicSprint #ProductivityChallenge";
    }
}
