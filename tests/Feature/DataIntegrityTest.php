<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\Sprint;
use App\Models\Update;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class DataIntegrityTest extends TestCase
{
    use RefreshDatabase;

    public function test_reply_must_belong_to_the_same_update(): void
    {
        [$owner, $commenter, $sprint] = $this->makeSprintFixture();
        $otherUpdateOwner = User::factory()->create();

        $sprint->participants()->attach($otherUpdateOwner->id, ['joined_at' => now()]);

        $firstUpdate = Update::create([
            'sprint_id' => $sprint->id,
            'user_id' => $owner->id,
            'day_number' => 1,
            'content' => 'First update',
            'is_draft' => false,
        ]);

        $secondUpdate = Update::create([
            'sprint_id' => $sprint->id,
            'user_id' => $otherUpdateOwner->id,
            'day_number' => 2,
            'content' => 'Second update',
            'is_draft' => false,
        ]);

        $comment = Comment::create([
            'update_id' => $firstUpdate->id,
            'user_id' => $commenter->id,
            'content' => 'Original comment',
        ]);

        $response = $this->actingAs($commenter)->post(route('comments.store', $secondUpdate), [
            'content' => 'Invalid reply',
            'parent_id' => $comment->id,
        ]);

        $response->assertSessionHasErrors('parent_id');
        $this->assertDatabaseCount('comments', 1);
    }

    public function test_reactions_count_is_updated_when_reacting_and_unreacting(): void
    {
        Notification::fake();

        [$owner, $reactor, $sprint] = $this->makeSprintFixture();
        $update = Update::create([
            'sprint_id' => $sprint->id,
            'user_id' => $owner->id,
            'day_number' => 1,
            'content' => 'Progress update',
            'is_draft' => false,
        ]);

        $this->actingAs($reactor)->post(route('updates.react', $update));

        $this->assertSame(1, $update->fresh()->reactions_count);
        $this->assertSame(1, $owner->fresh()->total_likes);

        $this->actingAs($reactor)->post(route('updates.react', $update));

        $this->assertSame(0, $update->fresh()->reactions_count);
        $this->assertSame(0, $owner->fresh()->total_likes);
    }

    public function test_deleting_an_update_reconciles_related_counters(): void
    {
        Notification::fake();

        [$owner, $reactor, $sprint] = $this->makeSprintFixture();
        $commenter = User::factory()->create();

        $sprint->participants()->attach($commenter->id, ['joined_at' => now()]);

        $this->actingAs($owner)->post(route('updates.store', $sprint), [
            'content' => 'Owner update',
            'day_number' => 1,
            'is_draft' => false,
        ]);

        $update = Update::latest('id')->firstOrFail();

        $this->actingAs($reactor)->post(route('updates.react', $update));
        $this->actingAs($commenter)->post(route('comments.store', $update), [
            'content' => 'Nice work',
        ]);

        $this->assertSame(1, $update->fresh()->reactions_count);
        $this->assertSame(1, $update->fresh()->comments_count);

        $this->actingAs($owner)->delete(route('updates.destroy', $update));

        $this->assertDatabaseMissing('updates', ['id' => $update->id]);
        $this->assertDatabaseCount('reactions', 0);
        $this->assertDatabaseCount('comments', 0);
        $this->assertSame(0, $owner->fresh()->total_likes);
        $this->assertSame(0, $sprint->fresh()->updates_count);

        $ownerPivot = DB::table('sprint_participants')
            ->where('sprint_id', $sprint->id)
            ->where('user_id', $owner->id)
            ->first();

        $commenterPivot = DB::table('sprint_participants')
            ->where('sprint_id', $sprint->id)
            ->where('user_id', $commenter->id)
            ->first();

        $this->assertSame(0, $ownerPivot->updates_posted);
        $this->assertSame(0, $ownerPivot->reactions_received);
        $this->assertSame(0, $commenterPivot->comments_made);
    }

    public function test_comment_points_are_stored_as_half_points(): void
    {
        Notification::fake();

        [$owner, $commenter, $sprint] = $this->makeSprintFixture();
        $update = Update::create([
            'sprint_id' => $sprint->id,
            'user_id' => $owner->id,
            'day_number' => 1,
            'content' => 'Progress update',
            'is_draft' => false,
        ]);

        $this->actingAs($commenter)->post(route('comments.store', $update), [
            'content' => 'Helpful comment',
        ]);

        $commenterPivot = DB::table('sprint_participants')
            ->where('sprint_id', $sprint->id)
            ->where('user_id', $commenter->id)
            ->first();

        $commenterSprint = $commenter->fresh()->sprints()->whereKey($sprint->id)->firstOrFail();

        $this->assertEquals(0.5, (float) $commenterPivot->score);
        $this->assertSame(0.5, $commenterSprint->pivot->score);
    }

    public function test_deleting_an_account_reconciles_counters_on_other_users_content(): void
    {
        Notification::fake();

        [$owner, $deleter, $sprint] = $this->makeSprintFixture();
        $update = Update::create([
            'sprint_id' => $sprint->id,
            'user_id' => $owner->id,
            'day_number' => 1,
            'content' => 'Owner update',
            'is_draft' => false,
        ]);

        $this->actingAs($deleter)->post(route('updates.react', $update));
        $this->actingAs($deleter)->post(route('comments.store', $update), [
            'content' => 'I am commenting here',
        ]);
        $this->actingAs($deleter)->post(route('users.follow', $owner));

        $this->assertSame(1, $update->fresh()->reactions_count);
        $this->assertSame(1, $update->fresh()->comments_count);
        $this->assertSame(1, $owner->fresh()->followers_count);
        $this->assertSame(1, $owner->fresh()->total_likes);

        $response = $this->actingAs($deleter)
            ->from('/settings')
            ->post(route('settings.delete'), [
            'password' => 'password',
        ]);

        $response->assertRedirect('/');
        $response->assertSessionHasNoErrors();

        $this->assertDatabaseMissing('users', ['id' => $deleter->id]);
        $this->assertSame(0, $update->fresh()->reactions_count);
        $this->assertSame(0, $update->fresh()->comments_count);
        $this->assertSame(0, $owner->fresh()->followers_count);
        $this->assertSame(0, $owner->fresh()->total_likes);

        $ownerPivot = DB::table('sprint_participants')
            ->where('sprint_id', $sprint->id)
            ->where('user_id', $owner->id)
            ->first();

        $this->assertSame(0, $ownerPivot->reactions_received);
        $this->assertDatabaseCount('reactions', 0);
        $this->assertDatabaseCount('comments', 0);
    }

    private function makeSprintFixture(): array
    {
        $owner = User::factory()->create();
        $participant = User::factory()->create();

        $sprint = Sprint::create([
            'user_id' => $owner->id,
            'title' => 'Consistency Sprint',
            'description' => 'Testing denormalized counters',
            'duration_days' => 7,
            'is_private' => false,
            'starts_at' => now()->subDays(1),
            'ends_at' => now()->addDays(6),
            'status' => 'active',
        ]);

        $sprint->participants()->attach($owner->id, ['joined_at' => now()]);
        $sprint->participants()->attach($participant->id, ['joined_at' => now()]);

        return [$owner, $participant, $sprint];
    }
}
