<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/profile');

        $response->assertOk();
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_full_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create([
            'bio' => 'Old bio',
            'location' => 'Old location',
            'website' => 'https://old.example.com',
        ]);

        $response = $this
            ->actingAs($user)
            ->post(route('profile.update.full'), [
                'name' => 'Updated Builder',
                'email' => 'updated@example.com',
                'bio' => 'Shipping better work in public every week.',
                'location' => 'Lagos, Nigeria',
                'website' => 'https://new.example.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('users.show', $user));

        $user->refresh();

        $this->assertSame('Updated Builder', $user->name);
        $this->assertSame('updated@example.com', $user->email);
        $this->assertSame('Shipping better work in public every week.', $user->bio);
        $this->assertSame('Lagos, Nigeria', $user->location);
        $this->assertSame('https://new.example.com', $user->website);
        $this->assertNull($user->email_verified_at);
    }

    public function test_existing_profile_images_are_preserved_when_not_reuploaded(): void
    {
        $user = User::factory()->create([
            'avatar' => 'avatars/existing-avatar.jpg',
            'cover_image' => 'covers/existing-cover.jpg',
            'bio' => 'Before edit',
        ]);

        $response = $this
            ->actingAs($user)
            ->post(route('profile.update.full'), [
                'name' => 'Still Has Images',
                'email' => $user->email,
                'bio' => 'Updated bio only',
                'location' => 'Lagos',
                'website' => 'https://example.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('users.show', $user));

        $user->refresh();

        $this->assertSame('avatars/existing-avatar.jpg', $user->avatar);
        $this->assertSame('covers/existing-cover.jpg', $user->cover_image);
        $this->assertSame('Updated bio only', $user->bio);
        $this->assertSame('Lagos', $user->location);
        $this->assertSame('https://example.com', $user->website);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete('/profile', [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->delete('/profile', [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect('/profile');

        $this->assertNotNull($user->fresh());
    }
}
