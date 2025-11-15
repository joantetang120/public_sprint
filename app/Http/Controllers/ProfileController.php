<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display a user's public profile.
     */
    public function show(User $user): Response
    {
        $user->load(['sprints' => function($query) {
            $query->withPivot('score', 'updates_posted', 'reactions_received')
                  ->orderByPivot('created_at', 'desc')
                  ->take(10);
        }]);

        $stats = [
            'sprints_completed' => $user->sprints_completed ?? 0,
            'current_streak' => $user->current_streak ?? 0,
            'longest_streak' => $user->longest_streak ?? 0,
            'total_likes' => $user->total_likes ?? 0,
            'followers_count' => $user->followers_count ?? 0,
            'following_count' => $user->following_count ?? 0,
            'total_sprints' => $user->sprints()->count(),
        ];

        $isFollowing = false;
        if (auth()->check()) {
            $isFollowing = auth()->user()->following()->where('following_id', $user->id)->exists();
        }

        // Get followers and following lists
        $followers = $user->followers()->get();
        $followingUsers = $user->following()->get();

        return Inertia::render('Profile/Show', [
            'profile' => $user,
            'stats' => $stats,
            'isFollowing' => $isFollowing,
            'isOwnProfile' => auth()->check() && auth()->id() === $user->id,
            'followers' => $followers,
            'followingUsers' => $followingUsers,
        ]);
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/EditNew', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's full profile with images.
     */
    public function updateFull(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $request->user()->id,
            'bio' => 'nullable|string|max:500',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'avatar' => 'nullable|image|max:2048',
            'cover_image' => 'nullable|image|max:5120', // 5MB for cover
        ]);

        $user = $request->user();

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            // Delete old cover
            if ($user->cover_image && Storage::disk('public')->exists($user->cover_image)) {
                Storage::disk('public')->delete($user->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }

        // Update user
        $user->update($validated);

        return redirect()->route('users.show', $user->id)->with('success', 'Profile updated successfully!');
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Upload avatar.
     */
    public function uploadAvatar(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => 'required|image|max:2048', // 2MB max
        ]);

        $user = $request->user();

        // Delete old avatar if exists
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Store new avatar
        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return back()->with('success', 'Avatar updated successfully!');
    }

    /**
     * Follow a user.
     */
    public function follow(User $user): RedirectResponse
    {
        if (auth()->id() === $user->id) {
            return back()->with('error', 'You cannot follow yourself.');
        }

        $follower = auth()->user();

        if (!$follower->following()->where('following_id', $user->id)->exists()) {
            $follower->following()->attach($user->id);
            $follower->increment('following_count');
            $user->increment('followers_count');
            
            // Create notification
            NotificationService::newFollower($user, $follower);
        }

        return back();
    }

    /**
     * Unfollow a user.
     */
    public function unfollow(User $user): RedirectResponse
    {
        $follower = auth()->user();

        if ($follower->following()->where('following_id', $user->id)->exists()) {
            $follower->following()->detach($user->id);
            $follower->decrement('following_count');
            $user->decrement('followers_count');
        }

        return back();
    }
}
