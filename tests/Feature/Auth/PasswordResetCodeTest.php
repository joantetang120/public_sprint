<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Notifications\PasswordResetCodeNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PasswordResetCodeTest extends TestCase
{
    use RefreshDatabase;

    public function test_forgot_password_sends_a_six_digit_code(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'builder@example.com',
        ]);

        $response = $this->post(route('password.email'), [
            'email' => $user->email,
        ]);

        $response->assertRedirect(route('password.reset', ['email' => $user->email]));

        $this->assertDatabaseHas('password_reset_tokens', [
            'email' => $user->email,
        ]);

        Notification::assertSentTo($user, PasswordResetCodeNotification::class);
    }

    public function test_user_can_reset_password_with_valid_code(): void
    {
        $user = User::factory()->create([
            'email' => 'builder@example.com',
        ]);

        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => Hash::make('123456'),
            'created_at' => now(),
        ]);

        $response = $this->post(route('password.store'), [
            'email' => $user->email,
            'code' => '123456',
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ]);

        $response->assertRedirect(route('login'));
        $this->assertTrue(Hash::check('new-password-123', $user->fresh()->password));
        $this->assertDatabaseMissing('password_reset_tokens', [
            'email' => $user->email,
        ]);
    }

    public function test_expired_code_can_not_be_used(): void
    {
        $user = User::factory()->create([
            'email' => 'builder@example.com',
        ]);

        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => Hash::make('123456'),
            'created_at' => now()->subMinutes(16),
        ]);

        $response = $this->from(route('password.reset', ['email' => $user->email]))
            ->post(route('password.store'), [
                'email' => $user->email,
                'code' => '123456',
                'password' => 'new-password-123',
                'password_confirmation' => 'new-password-123',
            ]);

        $response->assertRedirect(route('password.reset', ['email' => $user->email]));
        $response->assertSessionHasErrors('code');
    }
}
