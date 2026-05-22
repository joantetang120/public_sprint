<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class SettingsPasswordChangeTest extends TestCase
{
    use RefreshDatabase;

    public function test_regular_user_can_change_password_with_current_password(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('settings.account'), [
            'name' => $user->name,
            'email' => $user->email,
            'bio' => $user->bio,
            'current_password' => 'password',
            'new_password' => 'new-password-123',
            'new_password_confirmation' => 'new-password-123',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
        $this->assertTrue(Hash::check('new-password-123', $user->fresh()->password));
    }

    public function test_regular_user_must_provide_current_password_to_change_password(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->from(route('settings.index'))->post(route('settings.account'), [
            'name' => $user->name,
            'email' => $user->email,
            'bio' => $user->bio,
            'new_password' => 'new-password-123',
            'new_password_confirmation' => 'new-password-123',
        ]);

        $response->assertRedirect(route('settings.index'));
        $response->assertSessionHasErrors('current_password');
    }

    public function test_google_user_can_set_password_without_current_password(): void
    {
        $user = User::factory()->create([
            'google_id' => 'google-123',
        ]);

        $response = $this->actingAs($user)->post(route('settings.account'), [
            'name' => $user->name,
            'email' => $user->email,
            'bio' => $user->bio,
            'new_password' => 'new-password-123',
            'new_password_confirmation' => 'new-password-123',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
        $this->assertTrue(Hash::check('new-password-123', $user->fresh()->password));
    }
}
