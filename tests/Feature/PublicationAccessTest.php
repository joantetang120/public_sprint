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

    public function test_publication_form_uses_calendar_day_number_for_active_sprint(): void
    {
        [$user, $sprint] = $this->makeActiveSprintParticipantFixture(
            now()->subDays(2)->setTime(23, 30),
            now()->addDays(27)
        );

        $response = $this->actingAs($user)->get(route('updates.create', $sprint));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Update/Create')
            ->where('sprint.current_day', 3)
        );
    }

    public function test_publication_store_saves_the_real_calendar_day_even_if_front_sends_day_one(): void
    {
        [$user, $sprint] = $this->makeActiveSprintParticipantFixture(
            now()->subDays(2)->setTime(23, 30),
            now()->addDays(27)
        );

        $response = $this->actingAs($user)
            ->post(route('updates.store', $sprint), [
                'content' => 'Posting on the third calendar day.',
                'day_number' => 1,
            ]);

        $response->assertRedirect(route('sprints.show', $sprint));
        $this->assertDatabaseHas('updates', [
            'sprint_id' => $sprint->id,
            'user_id' => $user->id,
            'day_number' => 3,
            'content' => 'Posting on the third calendar day.',
        ]);
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

    private function makeActiveSprintParticipantFixture($startsAt, $endsAt): array
    {
        $user = User::factory()->create();

        $sprint = Sprint::create([
            'user_id' => $user->id,
            'title' => 'Active Sprint',
            'description' => 'Testing active sprint day numbering.',
            'duration_days' => 30,
            'is_private' => false,
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'status' => 'active',
            'participants_count' => 1,
            'updates_count' => 0,
        ]);

        $sprint->participants()->attach($user->id, ['joined_at' => now()]);

        return [$user, $sprint];
    }
}
