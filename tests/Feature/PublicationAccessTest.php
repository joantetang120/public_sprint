<?php

namespace Tests\Feature;

use App\Models\Sprint;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicationAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_publication_form_is_blocked_before_sprint_starts(): void
    {
        [$user, $sprint] = $this->makeUpcomingSprintParticipantFixture();

        $response = $this->actingAs($user)
            ->get(route('updates.create', $sprint));

        $response->assertRedirect(route('sprints.show', $sprint));
        $response->assertSessionHas('error', 'You can only publish after the sprint has started.');
    }

    public function test_publication_submit_is_blocked_before_sprint_starts(): void
    {
        [$user, $sprint] = $this->makeUpcomingSprintParticipantFixture();

        $response = $this->actingAs($user)
            ->from(route('sprints.show', $sprint))
            ->post(route('updates.store', $sprint), [
                'content' => 'Trying to publish too early.',
                'day_number' => 1,
            ]);

        $response->assertRedirect(route('sprints.show', $sprint));
        $response->assertSessionHasErrors('error');
    }

    private function makeUpcomingSprintParticipantFixture(): array
    {
        $user = User::factory()->create();

        $sprint = Sprint::create([
            'user_id' => $user->id,
            'title' => 'Upcoming Sprint',
            'description' => 'Testing pre-start publication guard.',
            'duration_days' => 7,
            'is_private' => false,
            'starts_at' => now()->addDays(2),
            'ends_at' => now()->addDays(9),
            'status' => 'upcoming',
            'participants_count' => 1,
            'updates_count' => 0,
        ]);

        $sprint->participants()->attach($user->id, ['joined_at' => now()]);

        return [$user, $sprint];
    }
}
