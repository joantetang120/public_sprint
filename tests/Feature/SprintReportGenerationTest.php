<?php

namespace Tests\Feature;

use App\Models\Sprint;
use App\Models\Update;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class SprintReportGenerationTest extends TestCase
{
    use RefreshDatabase;

    public function test_completed_sprint_generates_structured_report_payload(): void
    {
        $user = User::factory()->create();

        $sprint = Sprint::create([
            'user_id' => $user->id,
            'title' => 'Launch the portfolio refresh',
            'description' => 'A sprint to ship the next public portfolio version.',
            'duration_days' => 7,
            'is_private' => false,
            'starts_at' => now()->subDays(8),
            'ends_at' => now()->subDay(),
            'status' => 'completed',
        ]);

        $sprint->participants()->attach($user->id, [
            'joined_at' => now()->subDays(8),
            'updates_posted' => 3,
            'reactions_received' => 5,
            'comments_made' => 2,
            'score' => 8.5,
            'rank' => 1,
            'badges' => json_encode(['top_contributor', 'consistent_builder']),
        ]);

        Update::create([
            'sprint_id' => $sprint->id,
            'user_id' => $user->id,
            'day_number' => 1,
            'content' => 'Mapped the portfolio sections and shared the initial concept.',
            'images' => ['updates/mockup-one.png'],
            'links' => ['https://example.com/design-brief'],
            'is_draft' => false,
        ]);

        Update::create([
            'sprint_id' => $sprint->id,
            'user_id' => $user->id,
            'day_number' => 4,
            'content' => 'Refined the case study layout and documented what changed.',
            'image' => 'updates/mockup-two.png',
            'is_draft' => false,
        ]);

        Update::create([
            'sprint_id' => $sprint->id,
            'user_id' => $user->id,
            'day_number' => 7,
            'content' => 'Shipped the refresh and published the final demo at https://example.com/final-demo.',
            'is_draft' => false,
        ]);

        $response = $this->actingAs($user)
            ->from(route('sprints.show', $sprint))
            ->post(route('sprints.generate-summary', $sprint), [
                'style' => 'professional',
            ]);

        $response->assertRedirect(route('sprints.show', $sprint));

        $saved = DB::table('sprint_participants')
            ->where('sprint_id', $sprint->id)
            ->where('user_id', $user->id)
            ->value('ai_summary');

        $this->assertNotNull($saved);

        $report = json_decode($saved, true);

        $this->assertSame('sprint-report-v2', $report['version']);
        $this->assertSame('professional', $report['style']);
        $this->assertSame('Launch the portfolio refresh', $sprint->title);
        $this->assertSame(3, $report['metrics']['updates_posted']);
        $this->assertSame('8.5', $report['metrics']['score']);
        $this->assertSame('#1', $report['metrics']['rank_label']);
        $this->assertCount(2, $report['gallery']);
        $this->assertCount(2, $report['resources']);
        $this->assertNotEmpty($report['timeline']);
        $this->assertNotEmpty($report['formats']['linkedin']);
        $this->assertNotEmpty($report['formats']['portfolio']);
        $this->assertNotEmpty($report['formats']['caption']);
    }
}
