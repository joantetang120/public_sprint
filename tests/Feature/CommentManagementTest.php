<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\Sprint;
use App\Models\Update;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommentManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_edit_comment_within_three_minutes(): void
    {
        [$owner, $commenter, $update] = $this->makeFixture();

        $comment = Comment::create([
            'update_id' => $update->id,
            'user_id' => $commenter->id,
            'content' => 'Original comment',
        ]);

        $response = $this->actingAs($commenter)
            ->from('/sprints/test')
            ->put(route('comments.update', $comment), [
                'content' => 'Edited comment',
            ]);

        $response->assertRedirect('/sprints/test');
        $this->assertDatabaseHas('comments', [
            'id' => $comment->id,
            'content' => 'Edited comment',
        ]);
    }

    public function test_owner_cannot_edit_comment_after_three_minutes(): void
    {
        [$owner, $commenter, $update] = $this->makeFixture();

        $comment = Comment::create([
            'update_id' => $update->id,
            'user_id' => $commenter->id,
            'content' => 'Locked comment',
        ]);

        $comment->forceFill([
            'created_at' => now()->subMinutes(4),
            'updated_at' => now()->subMinutes(4),
        ])->saveQuietly();

        $response = $this->actingAs($commenter)->put(route('comments.update', $comment), [
            'content' => 'Should not change',
        ]);

        $response->assertForbidden();
        $this->assertDatabaseHas('comments', [
            'id' => $comment->id,
            'content' => 'Locked comment',
        ]);
    }

    public function test_owner_cannot_delete_root_comment_that_has_replies(): void
    {
        [$owner, $commenter, $update] = $this->makeFixture();

        $comment = Comment::create([
            'update_id' => $update->id,
            'user_id' => $commenter->id,
            'content' => 'Parent comment',
            'replies_count' => 1,
        ]);

        Comment::create([
            'update_id' => $update->id,
            'user_id' => $owner->id,
            'parent_id' => $comment->id,
            'content' => 'Reply comment',
        ]);

        $response = $this->actingAs($commenter)->delete(route('comments.destroy', $comment));

        $response->assertForbidden();
        $this->assertDatabaseHas('comments', ['id' => $comment->id]);
    }

    public function test_owner_can_delete_reply_even_after_three_minutes(): void
    {
        [$owner, $commenter, $update] = $this->makeFixture();

        $comment = Comment::create([
            'update_id' => $update->id,
            'user_id' => $owner->id,
            'content' => 'Parent comment',
            'replies_count' => 1,
        ]);

        $reply = Comment::create([
            'update_id' => $update->id,
            'user_id' => $commenter->id,
            'parent_id' => $comment->id,
            'content' => 'Reply comment',
        ]);

        $reply->forceFill([
            'created_at' => now()->subMinutes(10),
            'updated_at' => now()->subMinutes(10),
        ])->saveQuietly();

        $response = $this->actingAs($commenter)
            ->from('/sprints/test')
            ->delete(route('comments.destroy', $reply));

        $response->assertRedirect('/sprints/test');
        $this->assertDatabaseMissing('comments', ['id' => $reply->id]);
        $this->assertDatabaseHas('comments', ['id' => $comment->id]);
    }

    private function makeFixture(): array
    {
        $owner = User::factory()->create();
        $commenter = User::factory()->create();

        $sprint = Sprint::create([
            'user_id' => $owner->id,
            'title' => 'Comment Management Sprint',
            'description' => 'Sprint for comment management tests',
            'duration_days' => 7,
            'is_private' => false,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDays(6),
            'status' => 'active',
        ]);

        $update = Update::create([
            'sprint_id' => $sprint->id,
            'user_id' => $owner->id,
            'day_number' => 1,
            'content' => 'Sprint update',
            'is_draft' => false,
        ]);

        return [$owner, $commenter, $update];
    }
}
