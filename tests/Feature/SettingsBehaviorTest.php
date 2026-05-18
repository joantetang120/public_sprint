<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\Sprint;
use App\Models\Update;
use App\Models\User;
use App\Notifications\CommentActivityEmail;
use App\Notifications\ReactionActivityEmail;
use App\Notifications\SprintCompletedEmail;
use App\Notifications\SprintUpdateEmail;
use App\Services\NotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class SettingsBehaviorTest extends TestCase
{
    use RefreshDatabase;

    public function test_notification_settings_are_persisted(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('settings.notifications'), [
            'email_notifications' => false,
            'sprint_updates_notifications' => false,
            'comment_notifications' => false,
            'reaction_notifications' => true,
            'sprint_completion_notifications' => false,
        ]);

        $response->assertSessionHasNoErrors();

        $user->refresh();

        $this->assertFalse($user->email_notifications);
        $this->assertFalse($user->sprint_updates_notifications);
        $this->assertFalse($user->comment_notifications);
        $this->assertTrue($user->reaction_notifications);
        $this->assertFalse($user->sprint_completion_notifications);
    }

    public function test_privacy_settings_are_persisted(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('settings.privacy'), [
            'profile_public' => false,
            'show_email' => false,
            'show_stats' => false,
        ]);

        $response->assertSessionHasNoErrors();

        $user->refresh();

        $this->assertFalse($user->profile_public);
        $this->assertFalse($user->show_email);
        $this->assertFalse($user->show_stats);
    }

    public function test_private_profiles_are_blocked_server_side(): void
    {
        $viewer = User::factory()->create();
        $owner = User::factory()->create([
            'profile_public' => false,
            'bio' => 'Hidden bio',
        ]);

        $response = $this->actingAs($viewer)->get(route('users.show', $owner));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Profile/Show')
            ->where('profile.profile_public', false)
            ->where('profile.name', $owner->name)
            ->where('profile.bio', null)
            ->where('followers', [])
            ->where('followingUsers', [])
        );
    }

    public function test_hidden_email_is_not_exposed_to_other_users(): void
    {
        $viewer = User::factory()->create();
        $owner = User::factory()->create([
            'show_email' => false,
        ]);

        $response = $this->actingAs($viewer)->get(route('users.show', $owner));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->where('profile.email', null));
    }

    public function test_hidden_stats_are_not_exposed_to_other_users(): void
    {
        $viewer = User::factory()->create();
        $owner = User::factory()->create([
            'show_stats' => false,
            'followers_count' => 12,
            'following_count' => 7,
            'total_likes' => 33,
            'current_streak' => 5,
        ]);

        $response = $this->actingAs($viewer)->get(route('users.show', $owner));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('profile.show_stats', false)
            ->where('stats.followers_count', 0)
            ->where('stats.following_count', 0)
            ->where('stats.total_likes', 0)
            ->where('followers', [])
            ->where('followingUsers', [])
        );
    }

    public function test_comment_email_respects_user_settings(): void
    {
        Notification::fake();

        [$owner, $commenter, $sprint, $update] = $this->makeSprintFixture();
        $comment = Comment::create([
            'update_id' => $update->id,
            'user_id' => $commenter->id,
            'content' => 'Nice progress!',
        ]);

        $owner->forceFill([
            'email_notifications' => true,
            'comment_notifications' => true,
        ])->save();

        NotificationService::newComment($owner, $commenter, $update, $comment);
        Notification::assertSentTo($owner, CommentActivityEmail::class);

        Notification::fake();

        $owner->forceFill([
            'email_notifications' => true,
            'comment_notifications' => false,
        ])->save();

        NotificationService::newComment($owner, $commenter, $update, $comment);
        Notification::assertNotSentTo($owner, CommentActivityEmail::class);
    }

    public function test_reaction_email_respects_user_settings(): void
    {
        Notification::fake();

        [$owner, $reactor, $sprint, $update] = $this->makeSprintFixture();

        $owner->forceFill([
            'email_notifications' => true,
            'reaction_notifications' => true,
        ])->save();

        NotificationService::newReaction($owner, $reactor, $update);
        Notification::assertSentTo($owner, ReactionActivityEmail::class);

        Notification::fake();

        $owner->forceFill([
            'email_notifications' => false,
            'reaction_notifications' => true,
        ])->save();

        NotificationService::newReaction($owner, $reactor, $update);
        Notification::assertNotSentTo($owner, ReactionActivityEmail::class);
    }

    public function test_sprint_update_email_respects_user_settings(): void
    {
        Notification::fake();

        [$owner, $actor, $sprint, $update] = $this->makeSprintFixture();
        $participant = User::factory()->create([
            'email_notifications' => true,
            'sprint_updates_notifications' => true,
        ]);

        $sprint->participants()->attach($participant->id, ['joined_at' => now()]);

        NotificationService::sprintUpdate($sprint, $actor, $update);
        Notification::assertSentTo($participant, SprintUpdateEmail::class);

        Notification::fake();

        $participant->forceFill([
            'email_notifications' => true,
            'sprint_updates_notifications' => false,
        ])->save();

        NotificationService::sprintUpdate($sprint, $actor, $update);
        Notification::assertNotSentTo($participant, SprintUpdateEmail::class);
    }

    public function test_sprint_completion_email_respects_user_settings(): void
    {
        Notification::fake();

        [$owner, $actor, $sprint] = $this->makeSprintFixture(withUpdate: false);
        $participant = User::factory()->create([
            'email_notifications' => true,
            'sprint_completion_notifications' => true,
        ]);

        $sprint->participants()->attach($participant->id, ['joined_at' => now()]);

        NotificationService::sprintCompleted($sprint);
        Notification::assertSentTo($participant, SprintCompletedEmail::class);

        Notification::fake();

        $participant->forceFill([
            'email_notifications' => true,
            'sprint_completion_notifications' => false,
        ])->save();

        NotificationService::sprintCompleted($sprint);
        Notification::assertNotSentTo($participant, SprintCompletedEmail::class);
    }

    public function test_posting_an_update_notifies_only_participants_who_enabled_sprint_update_emails(): void
    {
        Notification::fake();

        [$owner, $author, $sprint] = $this->makeSprintFixture(withUpdate: false);
        $optedInParticipant = User::factory()->create([
            'email_notifications' => true,
            'sprint_updates_notifications' => true,
        ]);
        $optedOutParticipant = User::factory()->create([
            'email_notifications' => true,
            'sprint_updates_notifications' => false,
        ]);

        $sprint->participants()->attach($optedInParticipant->id, ['joined_at' => now()]);
        $sprint->participants()->attach($optedOutParticipant->id, ['joined_at' => now()]);

        $response = $this->actingAs($author)->post(route('updates.store', $sprint), [
            'content' => 'Progress update for the sprint',
            'day_number' => 2,
            'is_draft' => false,
        ]);

        $response->assertRedirect(route('sprints.show', $sprint));
        Notification::assertSentTo($optedInParticipant, SprintUpdateEmail::class);
        Notification::assertNotSentTo($optedOutParticipant, SprintUpdateEmail::class);
        Notification::assertNotSentTo($author, SprintUpdateEmail::class);
    }

    public function test_completing_a_sprint_notifies_only_participants_who_enabled_completion_emails(): void
    {
        Notification::fake();

        [$owner, $actor, $sprint] = $this->makeSprintFixture(withUpdate: false);
        $optedInParticipant = User::factory()->create([
            'email_notifications' => true,
            'sprint_completion_notifications' => true,
        ]);
        $optedOutParticipant = User::factory()->create([
            'email_notifications' => true,
            'sprint_completion_notifications' => false,
        ]);

        $sprint->participants()->attach($optedInParticipant->id, ['joined_at' => now()]);
        $sprint->participants()->attach($optedOutParticipant->id, ['joined_at' => now()]);
        $this->travelTo($sprint->ends_at->copy()->addMinute());

        try {
            $this->assertTrue($sprint->updateStatus());
            $this->assertSame('completed', $sprint->fresh()->status);

            Notification::assertSentTo($optedInParticipant, SprintCompletedEmail::class);
            Notification::assertNotSentTo($optedOutParticipant, SprintCompletedEmail::class);
        } finally {
            $this->travelBack();
        }
    }

    private function makeSprintFixture(bool $withUpdate = true): array
    {
        $owner = User::factory()->create();
        $actor = User::factory()->create();

        $sprint = Sprint::create([
            'user_id' => $owner->id,
            'title' => 'Test Sprint',
            'description' => 'Testing settings',
            'duration_days' => 7,
            'is_private' => false,
            'starts_at' => now()->subDays(2),
            'ends_at' => now()->addDays(5),
            'status' => 'active',
        ]);

        $sprint->participants()->attach($owner->id, ['joined_at' => now()]);
        $sprint->participants()->attach($actor->id, ['joined_at' => now()]);

        $update = null;

        if ($withUpdate) {
            $update = Update::create([
                'sprint_id' => $sprint->id,
                'user_id' => $owner->id,
                'day_number' => 1,
                'content' => 'Today I made solid progress on the project.',
                'is_draft' => false,
            ]);
        }

        return [$owner, $actor, $sprint, $update];
    }
}
