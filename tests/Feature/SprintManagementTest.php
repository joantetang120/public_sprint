<?php

namespace Tests\Feature;

use App\Models\Sprint;
use App\Models\SprintTag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class SprintManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_creator_can_view_edit_page_for_editable_sprint(): void
    {
        $owner = User::factory()->create();
        $sprint = $this->createEditableSprint($owner);

        $this->actingAs($owner)
            ->get(route('sprints.edit', $sprint))
            ->assertOk();
    }

    public function test_creator_can_update_editable_sprint(): void
    {
        $owner = User::factory()->create();
        $oldTag = SprintTag::create(['name' => 'old-tag', 'slug' => 'old-tag', 'usage_count' => 1]);
        $sprint = $this->createEditableSprint($owner);
        $sprint->tags()->attach($oldTag);

        $newStartDate = now()->addDays(5)->toDateString();

        $response = $this->actingAs($owner)
            ->put(route('sprints.update', $sprint), [
                'title' => 'Edited Sprint',
                'description' => 'A much clearer sprint direction.',
                'duration_days' => 14,
                'is_private' => true,
                'starts_at' => $newStartDate,
                'tags' => ['edited', 'focused'],
            ]);

        $response->assertSessionHasNoErrors()
            ->assertRedirect(route('sprints.index'));

        $sprint->refresh();

        $this->assertSame('Edited Sprint', $sprint->title);
        $this->assertSame('A much clearer sprint direction.', $sprint->description);
        $this->assertSame(14, $sprint->duration_days);
        $this->assertTrue($sprint->is_private);
        $this->assertTrue($sprint->starts_at->isSameDay(Carbon::parse($newStartDate)));
        $this->assertTrue($sprint->ends_at->isSameDay(Carbon::parse($newStartDate)->addDays(14)));
        $this->assertSame(['edited', 'focused'], $sprint->tags()->orderBy('name')->pluck('name')->all());
        $this->assertSame(0, $oldTag->fresh()->usage_count);
    }

    public function test_creator_can_delete_editable_sprint(): void
    {
        $owner = User::factory()->create();
        $sprint = $this->createEditableSprint($owner);

        $response = $this->actingAs($owner)
            ->delete(route('sprints.destroy', $sprint));

        $response->assertSessionHasNoErrors()
            ->assertRedirect(route('sprints.index'));

        $this->assertNull($sprint->fresh());
    }

    public function test_sprint_cannot_be_managed_once_another_participant_has_joined(): void
    {
        $owner = User::factory()->create();
        $guest = User::factory()->create();
        $sprint = $this->createEditableSprint($owner);

        $sprint->participants()->attach($guest->id, ['joined_at' => now()]);
        $sprint->update(['participants_count' => 2]);

        $this->actingAs($owner)
            ->get(route('sprints.edit', $sprint))
            ->assertForbidden();

        $this->actingAs($owner)
            ->put(route('sprints.update', $sprint), [
                'title' => 'Blocked',
                'description' => 'Blocked',
                'duration_days' => 7,
                'is_private' => false,
                'starts_at' => now()->addDays(4)->toDateString(),
                'tags' => [],
            ])
            ->assertForbidden();

        $this->actingAs($owner)
            ->delete(route('sprints.destroy', $sprint))
            ->assertForbidden();
    }

    public function test_sprint_cannot_be_managed_after_it_has_started(): void
    {
        $owner = User::factory()->create();
        $sprint = $this->createEditableSprint($owner, [
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDays(6),
            'status' => 'active',
        ]);

        $this->actingAs($owner)
            ->get(route('sprints.edit', $sprint))
            ->assertForbidden();

        $this->actingAs($owner)
            ->put(route('sprints.update', $sprint), [
                'title' => 'Blocked',
                'description' => 'Blocked',
                'duration_days' => 7,
                'is_private' => false,
                'starts_at' => now()->addDays(4)->toDateString(),
                'tags' => [],
            ])
            ->assertForbidden();

        $this->actingAs($owner)
            ->delete(route('sprints.destroy', $sprint))
            ->assertForbidden();
    }

    private function createEditableSprint(User $owner, array $attributes = []): Sprint
    {
        $sprint = Sprint::create(array_merge([
            'user_id' => $owner->id,
            'title' => 'Launch Sprint',
            'description' => 'Default description',
            'duration_days' => 7,
            'is_private' => false,
            'starts_at' => now()->addDays(3),
            'ends_at' => now()->addDays(10),
            'status' => 'upcoming',
            'participants_count' => 1,
            'updates_count' => 0,
        ], $attributes));

        $sprint->participants()->attach($owner->id, ['joined_at' => now()]);

        return $sprint;
    }
}
