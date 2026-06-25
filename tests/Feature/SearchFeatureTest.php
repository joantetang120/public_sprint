<?php

namespace Tests\Feature;

use App\Models\Sprint;
use App\Models\SprintTag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_returns_public_sprints_by_title_tag_and_creator(): void
    {
        $creator = User::factory()->create(['name' => 'Alice Builder']);
        $otherCreator = User::factory()->create(['name' => 'Private Owner']);

        $publicSprint = Sprint::create([
            'user_id' => $creator->id,
            'title' => 'Design Sprint',
            'description' => 'Ship a fresh interface',
            'duration_days' => 7,
            'is_private' => false,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDays(6),
            'status' => 'active',
        ]);

        $privateSprint = Sprint::create([
            'user_id' => $otherCreator->id,
            'title' => 'Secret Sprint',
            'description' => 'This should stay hidden',
            'duration_days' => 7,
            'is_private' => true,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDays(6),
            'status' => 'active',
        ]);

        $tag = SprintTag::create(['name' => 'branding']);
        $publicSprint->tags()->attach($tag);

        $this->get(route('search.index', ['q' => 'Design']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Search/Index')
                ->where('results.counts.sprints', 1)
                ->where('results.sprints.0.title', 'Design Sprint')
            );

        $this->get(route('search.index', ['q' => 'branding']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('results.sprints.0.title', 'Design Sprint')
            );

        $this->get(route('search.index', ['q' => 'Alice']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('results.sprints.0.title', 'Design Sprint')
            );

        $this->get(route('search.index', ['q' => 'Secret']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('results.counts.sprints', 0)
            );
    }

    public function test_search_returns_only_visible_users(): void
    {
        User::factory()->create([
            'name' => 'Visible John',
            'profile_public' => true,
            'bio' => 'Public product designer',
            'location' => 'Lagos',
        ]);

        User::factory()->create([
            'name' => 'Hidden John',
            'profile_public' => false,
            'bio' => 'Should stay hidden',
            'location' => 'Douala',
        ]);

        $this->get(route('search.index', ['q' => 'John']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Search/Index')
                ->where('results.counts.users', 1)
                ->where('results.users.0.name', 'Visible John')
            );
    }
}
