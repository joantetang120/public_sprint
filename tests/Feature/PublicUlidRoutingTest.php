<?php

namespace Tests\Feature;

use App\Models\Sprint;
use App\Models\Update;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicUlidRoutingTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_routes_generate_ulids_for_users_and_sprints(): void
    {
        $user = User::factory()->create();
        $sprint = Sprint::create([
            'user_id' => $user->id,
            'title' => 'ULID Sprint',
            'description' => 'Testing public route keys.',
            'duration_days' => 7,
            'is_private' => false,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDays(6),
            'status' => 'active',
        ]);

        $this->assertStringEndsWith('/users/' . $user->ulid, route('users.show', $user));
        $this->assertStringEndsWith('/sprints/' . $sprint->ulid, route('sprints.show', $sprint));
    }

    public function test_user_and_sprint_routes_bind_by_ulid_and_keep_legacy_numeric_links_working(): void
    {
        $owner = User::factory()->create();
        $viewer = User::factory()->create();

        $sprint = Sprint::create([
            'user_id' => $owner->id,
            'title' => 'Public Route Sprint',
            'description' => 'A sprint for ULID bindings.',
            'duration_days' => 7,
            'is_private' => false,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDays(6),
            'status' => 'active',
        ]);

        $sprint->participants()->attach($owner->id, ['joined_at' => now()]);

        $this->actingAs($viewer)->get('/users/' . $owner->ulid)->assertOk();
        $this->actingAs($viewer)->get('/users/' . $owner->id)->assertOk();
        $this->actingAs($viewer)->get('/sprints/' . $sprint->ulid)->assertOk();
        $this->actingAs($viewer)->get('/sprints/' . $sprint->id)->assertOk();
    }

    public function test_update_routes_accept_ulids(): void
    {
        $owner = User::factory()->create();
        $commenter = User::factory()->create();

        $sprint = Sprint::create([
            'user_id' => $owner->id,
            'title' => 'Update ULID Sprint',
            'description' => 'A sprint for update bindings.',
            'duration_days' => 7,
            'is_private' => false,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDays(6),
            'status' => 'active',
        ]);

        $sprint->participants()->attach($owner->id, ['joined_at' => now()]);
        $sprint->participants()->attach($commenter->id, ['joined_at' => now()]);

        $update = Update::create([
            'sprint_id' => $sprint->id,
            'user_id' => $owner->id,
            'day_number' => 1,
            'content' => 'First update',
            'is_draft' => false,
        ]);

        $response = $this->actingAs($commenter)->post('/updates/' . $update->ulid . '/comments', [
            'content' => 'Nice progress',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('comments', [
            'update_id' => $update->id,
            'user_id' => $commenter->id,
            'content' => 'Nice progress',
        ]);
    }
}
