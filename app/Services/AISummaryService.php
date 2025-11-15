<?php

namespace App\Services;

use App\Models\Sprint;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AISummaryService
{
    public function generateSprintSummary(Sprint $sprint, int $userId): ?string
    {
        // Get all updates from the user for this sprint
        $updates = $sprint->updates()
            ->where('user_id', $userId)
            ->where('is_draft', false)
            ->orderBy('day_number')
            ->get();

        if ($updates->isEmpty()) {
            return null;
        }

        // Combine all updates into one text
        $combinedText = $updates->map(function ($update) {
            return "Day {$update->day_number}: {$update->content}";
        })->implode("\n\n");

        // Try HuggingFace first, then OpenRouter
        $summary = $this->tryHuggingFace($combinedText) ?? $this->tryOpenRouter($combinedText);

        return $summary;
    }

    private function tryHuggingFace(string $text): ?string
    {
        $apiKey = config('services.huggingface.api_key');

        if (!$apiKey) {
            return null;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$apiKey}",
            ])->timeout(30)->post('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', [
                'inputs' => $text,
                'parameters' => [
                    'max_length' => 150,
                    'min_length' => 50,
                    'do_sample' => false,
                ],
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data[0]['summary_text'] ?? null;
            }
        } catch (\Exception $e) {
            Log::error('HuggingFace API error: ' . $e->getMessage());
        }

        return null;
    }

    private function tryOpenRouter(string $text): ?string
    {
        $apiKey = config('services.openrouter.api_key');

        if (!$apiKey) {
            return null;
        }

        try {
            $prompt = "Summarize this builder's sprint journey in 150 words, focusing on their challenges, wins, and progress:\n\n{$text}";

            $response = Http::withHeaders([
                'Authorization' => "Bearer {$apiKey}",
                'HTTP-Referer' => config('app.url'),
                'X-Title' => 'PublicSprint',
            ])->timeout(30)->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => 'meta-llama/llama-3.2-3b-instruct:free',
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['choices'][0]['message']['content'] ?? null;
            }
        } catch (\Exception $e) {
            Log::error('OpenRouter API error: ' . $e->getMessage());
        }

        return null;
    }

    public function generateFallbackSummary(Sprint $sprint, int $userId): string
    {
        $updates = $sprint->updates()
            ->where('user_id', $userId)
            ->where('is_draft', false)
            ->count();

        $reactions = $sprint->participants()
            ->where('user_id', $userId)
            ->first()
            ->pivot
            ->reactions_received ?? 0;

        return "Completed {$updates} updates during this {$sprint->duration_days}-day sprint, receiving {$reactions} reactions from the community. Great work on building in public!";
    }
}
