<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LanguagePreferenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_requests_default_to_english_locale(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('PublicSprint/Welcome')
            ->where('locale.current', 'en')
        );
    }

    public function test_guest_can_switch_language_in_session(): void
    {
        $response = $this->from('/')->post(route('language.update'), [
            'language' => 'fr',
        ]);

        $response->assertRedirect('/');
        $response->assertSessionHasNoErrors();
        $response->assertSessionHas('locale', 'fr');

        $followUp = $this->withSession(['locale' => 'fr'])->get('/');

        $followUp->assertOk();
        $followUp->assertInertia(fn ($page) => $page->where('locale.current', 'fr'));
    }

    public function test_authenticated_language_switch_updates_user_preference(): void
    {
        $user = User::factory()->create([
            'language' => 'en',
        ]);

        $response = $this->actingAs($user)->from('/dashboard')->post(route('language.update'), [
            'language' => 'fr',
        ]);

        $response->assertRedirect('/dashboard');
        $response->assertSessionHasNoErrors();
        $response->assertSessionHas('locale', 'fr');

        $user->refresh();

        $this->assertSame('fr', $user->language);
    }
}
