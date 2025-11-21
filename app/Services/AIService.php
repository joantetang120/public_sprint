<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIService
{
    private $hfApiKey;
    private $openaiApiKey;
    private $hfBaseUrl = 'https://api-inference.huggingface.co/models';
    private $openaiBaseUrl = 'https://api.openai.com/v1';

    public function __construct()
    {
        $this->hfApiKey = config('services.huggingface.api_key');
        $this->openaiApiKey = config('services.openai.api_key');
    }

    /**
     * Generate a professional sprint summary
     */
    public function generateSprintSummary($sprint, $userParticipation, $updates, $style = 'professional')
    {
        // Use enhanced template-based summary (reliable and fast)
        return $this->generateEnhancedSummary($sprint, $userParticipation, $updates, $style);
    }

    /**
     * Generate summary using Hugging Face models
     */
    private function generateWithHuggingFace($sprint, $userParticipation, $updates, $style)
    {
        // Use distilbart for fast, quality summaries
        $model = 'sshleifer/distilbart-cnn-12-6';
        
        // Prepare the content to summarize
        $content = $this->prepareContentForSummarization($sprint, $userParticipation, $updates, $style);
        
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->hfApiKey,
            'Content-Type' => 'application/json',
        ])->timeout(60)->post('https://api-inference.huggingface.co/models/' . $model, [
            'inputs' => $content,
            'parameters' => [
                'max_length' => 300,
                'min_length' => 100,
                'do_sample' => false,
            ],
        ]);

        if ($response->successful()) {
            $data = $response->json();
            
            // Hugging Face returns array with summary_text
            if (isset($data[0]['summary_text'])) {
                $aiSummary = $data[0]['summary_text'];
                return $this->formatSummary($aiSummary, $sprint, $userParticipation, $updates, $style);
            }
        }

        Log::error('Hugging Face API error', ['response' => $response->body()]);
        return null;
    }

    /**
     * Prepare content for AI summarization
     */
    private function prepareContentForSummarization($sprint, $userParticipation, $updates, $style)
    {
        $rank = $userParticipation->pivot->rank ?? 'N/A';
        $score = $userParticipation->pivot->score ?? 0;
        $updatesCount = $updates->count();
        $reactionsReceived = $userParticipation->pivot->reactions_received ?? 0;
        $badges = json_decode($userParticipation->pivot->badges ?? '[]', true);

        // Get update contents
        $updateTexts = $updates->pluck('content')->take(10)->filter()->toArray();
        $combinedUpdates = implode(' ', $updateTexts);

        // Limit to 1024 tokens (roughly 4000 characters)
        $combinedUpdates = substr($combinedUpdates, 0, 4000);

        $badgesList = '';
        if (!empty($badges)) {
            $badgeNames = array_map(function($badge) {
                return ucwords(str_replace('_', ' ', $badge));
            }, $badges);
            $badgesList = implode(', ', $badgeNames);
        }

        // Create a narrative for the AI to summarize
        $content = "Sprint Journey: {$sprint->title}. ";
        $content .= "Duration: {$sprint->duration_days} days. ";
        $content .= "Achievement: Ranked #{$rank} with {$score} points. ";
        $content .= "Posted {$updatesCount} updates and received {$reactionsReceived} reactions. ";
        
        if ($badgesList) {
            $content .= "Earned badges: {$badgesList}. ";
        }

        $content .= "Daily progress updates: {$combinedUpdates}";

        return $content;
    }

    /**
     * Format the AI summary with proper structure
     */
    private function formatSummary($aiSummary, $sprint, $userParticipation, $updates, $style)
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
            $badgeText = "\n🏆 Achievements: " . implode(', ', $badgeNames);
        }

        $emoji = $style === 'professional' ? '🎉' : ($style === 'casual' ? '🚀' : '💻');

        return "{$emoji} Just completed a {$sprint->duration_days}-day sprint: \"{$sprint->title}\"!\n\n" .
               "{$aiSummary}\n\n" .
               "📊 Results:\n" .
               "• Ranked #{$rank}\n" .
               "• {$updatesCount} updates posted\n" .
               "• {$score} points earned" .
               "{$badgeText}\n\n" .
               $this->getHashtags($style);
    }

    /**
     * Get hashtags based on style
     */
    private function getHashtags($style)
    {
        $hashtags = [
            'professional' => '#BuildInPublic #PublicSprint #ProductivityChallenge #ProfessionalDevelopment',
            'casual' => '#BuildInPublic #PublicSprint #CodingJourney #DevLife',
            'technical' => '#BuildInPublic #PublicSprint #TechChallenge #SoftwareDevelopment'
        ];

        return $hashtags[$style] ?? $hashtags['professional'];
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

    /**
     * Generate enhanced summary with actual update analysis
     */
    private function generateEnhancedSummary($sprint, $userParticipation, $updates, $style = 'professional')
    {
        $rank = $userParticipation->pivot->rank ?? 'N/A';
        $score = $userParticipation->pivot->score ?? 0;
        $updatesCount = $updates->count();
        $reactionsReceived = $userParticipation->pivot->reactions_received ?? 0;
        $badges = json_decode($userParticipation->pivot->badges ?? '[]', true);

        // Analyze updates for key themes
        $updateTexts = $updates->pluck('content')->take(10)->filter()->toArray();
        $hasProgress = $this->detectTheme($updateTexts, ['progress', 'completed', 'finished', 'built', 'shipped', 'done', 'achieved']);
        $hasChallenges = $this->detectTheme($updateTexts, ['challenge', 'difficult', 'struggle', 'problem', 'issue', 'bug', 'error']);
        $hasLearning = $this->detectTheme($updateTexts, ['learned', 'discovered', 'realized', 'understanding', 'insight', 'knowledge', 'experience']);
        
        // Extract images and links from updates
        $images = [];
        $links = [];
        
        foreach ($updates as $update) {
            // Get images from JSON field
            if ($update->images) {
                $updateImages = is_string($update->images) ? json_decode($update->images, true) : $update->images;
                if (is_array($updateImages)) {
                    $images = array_merge($images, $updateImages);
                }
            }
            // Also get single image if exists
            if ($update->image) {
                $images[] = $update->image;
            }
            
            // Get links from JSON field
            if ($update->links) {
                $updateLinks = is_string($update->links) ? json_decode($update->links, true) : $update->links;
                if (is_array($updateLinks)) {
                    $links = array_merge($links, $updateLinks);
                }
            }
        }
        
        // Also extract links from content
        $contentLinks = $this->extractLinksFromContent($updates);
        $links = array_merge($links, $contentLinks);
        
        // Remove duplicates and limit
        $images = array_unique(array_filter($images));
        $links = array_unique(array_filter($links));

        $badgeText = '';
        if (!empty($badges)) {
            $badgeNames = array_map(function($badge) {
                return ucwords(str_replace('_', ' ', $badge));
            }, $badges);
            $badgeText = "\n🏆 Achievements: " . implode(', ', $badgeNames);
        }

        // Generate style-specific content
        $narrative = $this->generateNarrative($style, $sprint, $hasProgress, $hasChallenges, $hasLearning, $updatesCount);
        $emoji = $style === 'professional' ? '🎉' : ($style === 'casual' ? '🚀' : '💻');
        
        // Build journey highlights from actual updates
        $journeyHighlights = $this->buildJourneyHighlights($updates, $style);

        $summary = "{$emoji} Just completed a {$sprint->duration_days}-day sprint: \"{$sprint->title}\"!\n\n" .
               "{$narrative}\n\n";
        
        // Add journey highlights if available
        if (!empty($journeyHighlights)) {
            $summary .= "📝 Journey Highlights:\n{$journeyHighlights}\n\n";
        }
        
        $summary .= "📊 Results:\n" .
               "• Ranked #{$rank}" . ($rank <= 3 ? ' 🏅' : '') . "\n" .
               "• {$updatesCount} updates posted\n" .
               "• {$score} points earned\n" .
               "• {$reactionsReceived} reactions received" .
               "{$badgeText}\n\n" .
               $this->getKeyTakeaways($style, $hasProgress, $hasChallenges, $hasLearning) . "\n\n";
        
        // Add links if available
        if (!empty($links)) {
            $summary .= "🔗 Resources:\n" . implode("\n", array_slice($links, 0, 3)) . "\n\n";
        }
        
        $summary .= $this->getHashtags($style);
        
        // Store images metadata separately (will be used in frontend)
        $summary .= "\n\n[IMAGES:" . implode(',', $images) . "]";
        
        return $summary;
    }

    /**
     * Detect themes in update content
     */
    private function detectTheme($texts, $keywords)
    {
        $combinedText = strtolower(implode(' ', $texts));
        foreach ($keywords as $keyword) {
            if (strpos($combinedText, $keyword) !== false) {
                return true;
            }
        }
        return false;
    }

    /**
     * Generate style-specific narrative
     */
    private function generateNarrative($style, $sprint, $hasProgress, $hasChallenges, $hasLearning, $updatesCount)
    {
        if ($style === 'professional') {
            $narrative = "Thrilled to share the completion of this {$sprint->duration_days}-day journey. ";
            if ($hasProgress) {
                $narrative .= "Made significant progress through consistent daily updates and community engagement. ";
            }
            if ($hasChallenges) {
                $narrative .= "Overcame various challenges through persistence and community support. ";
            }
            if ($hasLearning) {
                $narrative .= "Gained valuable insights and practical experience throughout the process. ";
            }
            $narrative .= "Building in public created accountability and fostered meaningful connections.";
            return $narrative;
        } elseif ($style === 'casual') {
            $narrative = "What a ride! 🎢 ";
            if ($hasProgress) {
                $narrative .= "Shipped updates almost every day and the progress was real. ";
            }
            if ($hasChallenges) {
                $narrative .= "Hit some bumps along the way, but that's part of the journey, right? ";
            }
            if ($hasLearning) {
                $narrative .= "Learned SO much - way more than I expected! ";
            }
            $narrative .= "The community support kept me going. Building in public is the way! 💪";
            return $narrative;
        } else { // technical
            $narrative = "Completed {$sprint->duration_days}-day development sprint with {$updatesCount} documented updates. ";
            if ($hasProgress) {
                $narrative .= "Achieved measurable progress through iterative development and continuous deployment. ";
            }
            if ($hasChallenges) {
                $narrative .= "Resolved technical challenges through systematic debugging and community collaboration. ";
            }
            if ($hasLearning) {
                $narrative .= "Acquired new technical skills and deepened understanding of core concepts. ";
            }
            $narrative .= "Public accountability significantly improved consistency and output quality.";
            return $narrative;
        }
    }

    /**
     * Generate style-specific key takeaways
     */
    private function getKeyTakeaways($style, $hasProgress, $hasChallenges, $hasLearning)
    {
        if ($style === 'professional') {
            return "Key takeaways:\n" .
                   "✅ Consistency and accountability drive results\n" .
                   "✅ Community support accelerates growth\n" .
                   "✅ Public building creates valuable connections";
        } elseif ($style === 'casual') {
            return "What I learned:\n" .
                   "✨ Show up every day, even when it's hard\n" .
                   "✨ Your community has your back\n" .
                   "✨ Sharing the journey > hiding until perfect";
        } else { // technical
            return "Technical insights:\n" .
                   "⚡ Daily commits maintain momentum\n" .
                   "⚡ Peer review improves code quality\n" .
                   "⚡ Documentation through updates aids knowledge retention";
        }
    }

    /**
     * Extract links from update content
     */
    private function extractLinksFromContent($updates)
    {
        $links = [];
        $pattern = '/(https?:\/\/[^\s]+)/i';
        
        foreach ($updates as $update) {
            if (preg_match_all($pattern, $update->content, $matches)) {
                $links = array_merge($links, $matches[0]);
            }
        }
        
        return array_unique($links);
    }
    
    /**
     * Build journey highlights from actual updates
     */
    private function buildJourneyHighlights($updates, $style)
    {
        if ($updates->count() === 0) {
            return '';
        }
        
        // Get key updates (first, middle, last, and high-engagement ones)
        $keyUpdates = [];
        
        // First update
        if ($updates->count() > 0) {
            $keyUpdates[] = $updates->first();
        }
        
        // Middle update
        if ($updates->count() > 2) {
            $keyUpdates[] = $updates[floor($updates->count() / 2)];
        }
        
        // Last update
        if ($updates->count() > 1) {
            $keyUpdates[] = $updates->last();
        }
        
        // Build highlights text
        $highlights = [];
        foreach ($keyUpdates as $index => $update) {
            $content = substr($update->content, 0, 100);
            if (strlen($update->content) > 100) {
                $content .= '...';
            }
            
            $day = $index === 0 ? 'Day 1' : ($index === count($keyUpdates) - 1 ? 'Final Day' : 'Mid-Sprint');
            $highlights[] = "• {$day}: {$content}";
        }
        
        return implode("\n", array_slice($highlights, 0, 3));
    }

    private function generateFallbackSummary($sprint, $userParticipation, $updates, $style = 'professional')
    {
        return $this->generateEnhancedSummary($sprint, $userParticipation, $updates, $style);
    }
}
