<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    /**
     * Display the password reset view.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'email' => $request->email,
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset using a 6-digit verification code.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'code' => 'required|digits:6',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->first();

        if (! $record) {
            return back()->withErrors([
                'code' => 'No verification code was found for this email.',
            ]);
        }

        if (Carbon::parse($record->created_at)->lt(now()->subMinutes(15))) {
            DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();

            return back()->withErrors([
                'code' => 'This verification code has expired. Request a new one.',
            ]);
        }

        if (! Hash::check($validated['code'], $record->token)) {
            return back()->withErrors([
                'code' => 'The verification code is invalid.',
            ]);
        }

        $user = \App\Models\User::where('email', $validated['email'])->firstOrFail();

        $user->forceFill([
            'password' => Hash::make($validated['password']),
            'remember_token' => Str::random(60),
        ])->save();

        DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();

        return redirect()->route('login')->with('status', 'Your password has been reset successfully.');
    }
}
