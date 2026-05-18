<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\EngagementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/Index', [
            'user' => auth()->user(),
        ]);
    }

    public function updateNotifications(Request $request)
    {
        $request->validate([
            'email_notifications' => 'boolean',
            'sprint_updates_notifications' => 'boolean',
            'comment_notifications' => 'boolean',
            'reaction_notifications' => 'boolean',
            'sprint_completion_notifications' => 'boolean',
        ]);

        $user = auth()->user();
        $user->forceFill([
            'email_notifications' => $request->boolean('email_notifications'),
            'sprint_updates_notifications' => $request->boolean('sprint_updates_notifications'),
            'comment_notifications' => $request->boolean('comment_notifications'),
            'reaction_notifications' => $request->boolean('reaction_notifications'),
            'sprint_completion_notifications' => $request->boolean('sprint_completion_notifications'),
        ])->save();

        return back()->with('success', 'Notification settings updated successfully!');
    }

    public function updatePrivacy(Request $request)
    {
        $request->validate([
            'profile_public' => 'boolean',
            'show_email' => 'boolean',
            'show_stats' => 'boolean',
        ]);

        $user = auth()->user();
        $user->forceFill([
            'profile_public' => $request->boolean('profile_public'),
            'show_email' => $request->boolean('show_email'),
            'show_stats' => $request->boolean('show_stats'),
        ])->save();

        return back()->with('success', 'Privacy settings updated successfully!');
    }

    public function updatePreferences(Request $request)
    {
        $validated = $request->validate([
            'theme' => 'required|in:light,dark,auto',
            'language' => 'required|in:en,fr',
        ]);

        auth()->user()->forceFill($validated)->save();

        return back()->with('success', 'Preferences updated successfully!');
    }

    public function updateAccount(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . auth()->id(),
            'bio' => 'nullable|string|max:500',
            'current_password' => 'nullable|required_with:new_password',
            'new_password' => ['nullable', 'confirmed', Password::min(8)],
        ]);

        $user = auth()->user();

        // Update basic info
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        if (isset($validated['bio'])) {
            $user->bio = $validated['bio'];
        }

        // Update password if provided
        if ($request->filled('current_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return back()->withErrors(['current_password' => 'Current password is incorrect.']);
            }
            $user->password = Hash::make($validated['new_password']);
        }

        $user->save();

        return back()->with('success', 'Account settings updated successfully!');
    }

    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => 'required',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->password, $user->password)) {
            return back()->withErrors(['password' => 'Password is incorrect.']);
        }

        DB::transaction(function () use ($user) {
            EngagementService::deleteUserData($user);
            User::whereKey($user->id)->delete();
        });

        auth()->logout();

        return redirect('/')->with('success', 'Your account has been deleted.');
    }
}
