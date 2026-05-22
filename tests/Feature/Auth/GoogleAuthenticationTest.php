<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Tests\TestCase;

class GoogleAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_google_redirect_route_is_available(): void
    {
        config()->set('services.google.client_id', 'test-client-id');
        config()->set('services.google.client_secret', 'test-client-secret');

        Socialite::fake('google');

        $response = $this->get(route('auth.google.redirect'));

        $response->assertRedirect('https://socialite.fake/google/authorize');
    }

    public function test_google_callback_creates_and_authenticates_a_new_user(): void
    {
        config()->set('services.google.client_id', 'test-client-id');
        config()->set('services.google.client_secret', 'test-client-secret');

        Socialite::fake('google', $this->fakeGoogleUser([
            'id' => 'google-user-123',
            'name' => 'Sprint Builder',
            'email' => 'builder@example.com',
        ]));

        $response = $this->get(route('auth.google.callback'));

        $this->assertAuthenticated();
        $response->assertRedirect(route('users.show', User::where('email', 'builder@example.com')->first()));
        $this->assertDatabaseHas('users', [
            'email' => 'builder@example.com',
            'google_id' => 'google-user-123',
        ]);
        $this->assertNotNull(User::where('email', 'builder@example.com')->value('email_verified_at'));
        $user = User::where('email', 'builder@example.com')->firstOrFail();
        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $user->id,
            'type' => 'welcome',
        ]);
        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $user->id,
            'type' => 'google_password_setup',
        ]);
    }

    public function test_google_callback_links_an_existing_email_account(): void
    {
        config()->set('services.google.client_id', 'test-client-id');
        config()->set('services.google.client_secret', 'test-client-secret');

        $user = User::factory()->unverified()->create([
            'email' => 'existing@example.com',
            'google_id' => null,
        ]);

        Socialite::fake('google', $this->fakeGoogleUser([
            'id' => 'google-user-999',
            'name' => 'Existing Builder',
            'email' => 'existing@example.com',
        ]));

        $response = $this->get(route('auth.google.callback'));

        $this->assertAuthenticatedAs($user->fresh());
        $response->assertRedirect(route('users.show', $user));
        $this->assertSame('google-user-999', $user->fresh()->google_id);
        $this->assertNotNull($user->fresh()->email_verified_at);
        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $user->id,
            'type' => 'welcome',
        ]);
        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $user->id,
            'type' => 'google_password_setup',
        ]);
    }

    public function test_google_redirect_shows_a_friendly_error_when_secret_is_missing(): void
    {
        config()->set('services.google.client_id', 'test-client-id');
        config()->set('services.google.client_secret', null);

        $response = $this->from(route('login'))->get(route('auth.google.redirect'));

        $response->assertRedirect(route('login'));
        $response->assertSessionHasErrors('google');
    }

    public function test_google_callback_ignores_notification_count_as_the_intended_destination(): void
    {
        config()->set('services.google.client_id', 'test-client-id');
        config()->set('services.google.client_secret', 'test-client-secret');

        Socialite::fake('google', $this->fakeGoogleUser([
            'id' => 'google-user-321',
            'name' => 'Intent Builder',
            'email' => 'intent@example.com',
        ]));

        $this->withSession([
            'url.intended' => route('notifications.unread'),
        ]);

        $response = $this->get(route('auth.google.callback'));

        $user = User::where('email', 'intent@example.com')->firstOrFail();

        $response->assertRedirect(route('users.show', $user));
    }

    public function test_google_notifications_are_not_duplicated_on_later_logins(): void
    {
        config()->set('services.google.client_id', 'test-client-id');
        config()->set('services.google.client_secret', 'test-client-secret');

        Socialite::fake('google', $this->fakeGoogleUser([
            'id' => 'google-user-654',
            'name' => 'Repeat Builder',
            'email' => 'repeat@example.com',
        ]));

        $this->get(route('auth.google.callback'));
        auth()->logout();
        $this->get(route('auth.google.callback'));

        $user = User::where('email', 'repeat@example.com')->firstOrFail();

        $this->assertSame(1, \DB::table('notifications')->where('notifiable_id', $user->id)->where('type', 'welcome')->count());
        $this->assertSame(1, \DB::table('notifications')->where('notifiable_id', $user->id)->where('type', 'google_password_setup')->count());
    }

    private function fakeGoogleUser(array $attributes): SocialiteUser
    {
        return (new SocialiteUser())->map($attributes)->setRaw($attributes);
    }
}
