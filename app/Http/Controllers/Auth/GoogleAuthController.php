<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as GoogleUser;
use Throwable;

class GoogleAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        if (! config('services.google.client_id') || ! config('services.google.client_secret')) {
            return redirect()->route('login')->withErrors([
                'google' => 'Google sign-in is not configured yet. Add your Google client secret to finish setup.',
            ]);
        }

        return Socialite::driver('google')
            ->scopes(['openid', 'profile', 'email'])
            ->redirect();
    }

    public function callback(): RedirectResponse
    {
        try {
            /** @var GoogleUser $googleUser */
            $googleUser = Socialite::driver('google')->user();
        } catch (Throwable $exception) {
            Log::warning('Google OAuth callback failed.', [
                'message' => $exception->getMessage(),
            ]);

            return redirect()->route('login')->withErrors([
                'google' => 'Google sign-in could not be completed. Please try again.',
            ]);
        }

        if (! $googleUser->getEmail()) {
            return redirect()->route('login')->withErrors([
                'google' => 'Google did not return an email address for this account.',
            ]);
        }

        $user = $this->resolveUser($googleUser);

        Auth::login($user);
        request()->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    private function resolveUser(GoogleUser $googleUser): User
    {
        $googleId = (string) $googleUser->getId();
        $email = Str::lower($googleUser->getEmail());

        $user = User::query()
            ->where('google_id', $googleId)
            ->orWhere('email', $email)
            ->first();

        if ($user) {
            if ($user->google_id !== $googleId) {
                $user->google_id = $googleId;
            }

            if (! $user->email_verified_at) {
                $user->email_verified_at = now();
            }

            $user->save();

            return $user;
        }

        $displayName = $googleUser->getName()
            ?: $googleUser->getNickname()
            ?: Str::headline(Str::before($email, '@'));

        $user = User::create([
            'name' => $displayName,
            'email' => $email,
            'password' => Hash::make(Str::random(40)),
            'google_id' => $googleId,
        ]);

        $user->forceFill([
            'email_verified_at' => now(),
        ])->save();

        return $user;
    }
}
