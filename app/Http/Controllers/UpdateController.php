<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use App\Models\Update;
use App\Models\Reaction;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UpdateController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Get only the logged-in user's recent updates
        $updates = Update::with(['user', 'sprint'])
            ->where('user_id', $user->id)
            ->where('is_draft', false)
            ->latest()
            ->take(10)
            ->get();

        // Get user stats
        $stats = [
            'active_sprints' => $user->sprints()
                ->where('status', 'active')
                ->count(),
            'current_streak' => $user->current_streak ?? 0,
            'total_likes' => $user->total_likes ?? 0,
            'updates_posted' => Update::where('user_id', $user->id)
                ->where('is_draft', false)
                ->whereMonth('created_at', now()->month)
                ->count(),
        ];

        // Get completed sprints with stats (all of them for My Summaries section)
        $completedSprints = $user->sprints()
            ->with(['participants' => function($query) {
                $query->withPivot(['updates_posted', 'reactions_received', 'comments_made', 'score', 'rank', 'badges', 'ai_summary']);
            }])
            ->where('status', 'completed')
            ->latest('ends_at')
            ->get()
            ->map(function ($sprint) use ($user) {
                $completionStats = $sprint->getCompletionStats();
                
                // Get user participation from the already loaded relationship
                $userParticipation = $sprint->participants->firstWhere('id', $user->id);
                
                return [
                    'sprint' => $sprint,
                    'stats' => $completionStats,
                    'user_rank' => $userParticipation->pivot->rank ?? null,
                    'user_score' => $userParticipation->pivot->score ?? 0,
                    'user_badges' => $userParticipation->pivot->badges ? json_decode($userParticipation->pivot->badges, true) : [],
                    'ai_summary' => $userParticipation->pivot->ai_summary ?? null,
                ];
            });

        return Inertia::render('PublicSprint/Dashboard', [
            'updates' => $updates,
            'stats' => $stats,
            'completedSprints' => $completedSprints,
        ]);
    }

    public function create(Sprint $sprint)
    {
        // Check if user is participant
        if (!$sprint->participants()->where('user_id', auth()->id())->exists()) {
            return redirect()->route('sprints.show', $sprint->id)
                ->with('error', 'You must be a participant to post updates.');
        }

        // TEMPORARILY DISABLED FOR TESTING
        // // Check if sprint has started
        // if ($sprint->status === 'upcoming' || now()->isBefore($sprint->starts_at)) {
        //     return redirect()->route('sprints.show', $sprint->id)
        //         ->with('error', 'You can only post updates after the sprint has started.');
        // }

        // // Check if sprint has ended
        // if ($sprint->status === 'completed' || now()->isAfter($sprint->ends_at)) {
        //     return redirect()->route('sprints.show', $sprint->id)
        //         ->with('error', 'This sprint has ended. You can no longer post updates.');
        // }

        // Calculate current day
        $daysPassed = now()->diffInDays($sprint->starts_at) + 1;
        $sprint->current_day = (int) max(1, min($daysPassed, $sprint->duration_days));

        return Inertia::render('Update/Create', [
            'sprint' => $sprint->load('creator'),
        ]);
    }

    public function store(Request $request, Sprint $sprint)
    {
        // TEMPORARILY DISABLED FOR TESTING - Allow anyone to post
        // // Check if user is participant
        // if (!$sprint->participants()->where('user_id', auth()->id())->exists()) {
        //     return back()->withErrors(['error' => 'You must be a participant to post updates.']);
        // }

        // TEMPORARILY DISABLED FOR TESTING
        // // Check if sprint has started
        // if ($sprint->status === 'upcoming' || now()->isBefore($sprint->starts_at)) {
        //     return back()->withErrors(['error' => 'You can only post updates after the sprint has started.']);
        // }

        // // Check if sprint has ended
        // if ($sprint->status === 'completed' || now()->isAfter($sprint->ends_at)) {
        //     return back()->withErrors(['error' => 'This sprint has ended. You can no longer post updates.']);
        // }

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'images' => 'nullable|array',
            'images.*' => 'image|max:5120', // 5MB each
            'links' => 'nullable|array',
            'links.*' => 'url|max:500',
            'day_number' => 'required|integer|min:1',
            'is_draft' => 'boolean',
        ]);

        // TEMPORARILY DISABLED FOR TESTING - Allow multiple updates per day
        // // Check if update for this day already exists
        // $existingUpdate = Update::where('sprint_id', $sprint->id)
        //     ->where('user_id', auth()->id())
        //     ->where('day_number', $validated['day_number'])
        //     ->first();

        // if ($existingUpdate) {
        //     return back()->withErrors(['error' => 'You already posted an update for this day.']);
        // }

        $imagePath = null;
        $imageUrls = [];
        
        // Handle multiple images
        if ($request->hasFile('images')) {
            $disk = config('filesystems.disks.cloudinary.cloud_name') ? 'cloudinary' : 'public';
            $images = $request->file('images');
            
            \Log::info('Processing images', [
                'count' => count($images),
                'disk' => $disk,
                'has_cloudinary' => !empty(config('filesystems.disks.cloudinary.cloud_name')),
            ]);
            
            // Ensure directory exists for local storage
            if ($disk === 'public') {
                $directory = storage_path('app/public/updates');
                if (!file_exists($directory)) {
                    mkdir($directory, 0755, true);
                    \Log::info('Created directory', ['path' => $directory]);
                }
            }
            
            // Store all images
            foreach ($images as $index => $image) {
                $path = $image->store('updates', $disk);
                
                // Get the full URL from Cloudinary if using cloudinary disk
                if ($disk === 'cloudinary') {
                    $url = \Storage::disk('cloudinary')->url($path);
                    \Log::info('Cloudinary upload', [
                        'index' => $index,
                        'path' => $path,
                        'url' => $url,
                    ]);
                    $imageUrls[] = $url;
                    
                    // Keep first image in old 'image' field for backwards compatibility
                    if ($index === 0) {
                        $imagePath = $url;
                    }
                } else {
                    $imageUrls[] = $path;
                    
                    // Keep first image in old 'image' field for backwards compatibility
                    if ($index === 0) {
                        $imagePath = $path;
                    }
                    
                    $fullPath = storage_path('app/public/' . $path);
                    \Log::info('Local upload', [
                        'index' => $index,
                        'path' => $path,
                        'full_path' => $fullPath,
                        'exists' => file_exists($fullPath),
                    ]);
                }
            }
        }

        try {
            $update = Update::create([
                'sprint_id' => $sprint->id,
                'user_id' => auth()->id(),
                'day_number' => $validated['day_number'],
                'content' => $validated['content'],
                'image' => $imagePath,
                'images' => !empty($imageUrls) ? $imageUrls : null,
                'links' => $validated['links'] ?? null,
                'is_draft' => $validated['is_draft'] ?? false,
            ]);

            \Log::info('Update created successfully', ['update_id' => $update->id]);

            if (!$update->is_draft) {
                // Update sprint stats
                $sprint->increment('updates_count');

                // Update participant stats (only if user is participant)
                if ($sprint->participants()->where('user_id', auth()->id())->exists()) {
                    $sprint->participants()->updateExistingPivot(auth()->id(), [
                        'updates_posted' => \DB::raw('updates_posted + 1'),
                        'score' => \DB::raw('score + 2'), // 2 points per update
                    ]);
                }

                // Update user stats
                auth()->user()->update([
                    'last_update_at' => now(),
                ]);

                // Check and update streak
                $this->updateUserStreak();

                NotificationService::sprintUpdate($sprint, auth()->user(), $update);
            }

            return redirect()->route('sprints.show', $sprint->id)
                ->with('success', $update->is_draft ? 'Draft saved!' : 'Update posted! 🎉');
        } catch (\Exception $e) {
            \Log::error('Failed to create update', [
                'error' => $e->getMessage(),
                'sprint_id' => $sprint->id,
                'user_id' => auth()->id(),
            ]);
            return back()->withErrors(['error' => 'Failed to save update: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, Update $update)
    {
        if ($update->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
            'image' => 'nullable|image|max:5120',
            'is_draft' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($update->image) {
                Storage::disk('cloudinary')->delete($update->image);
            }
            $validated['image'] = $request->file('image')->store('updates', 'cloudinary');
        }

        $update->update($validated);

        return back()->with('success', 'Update edited successfully!');
    }

    public function destroy(Update $update)
    {
        if ($update->user_id !== auth()->id()) {
            abort(403);
        }

        // Delete image if exists
        if ($update->image) {
            Storage::disk('cloudinary')->delete($update->image);
        }

        // Update stats if not draft
        if (!$update->is_draft) {
            $update->sprint->decrement('updates_count');
            $update->sprint->participants()->updateExistingPivot(auth()->id(), [
                'updates_posted' => \DB::raw('updates_posted - 1'),
                'score' => \DB::raw('score - 2'),
            ]);
        }

        $update->delete();

        return back()->with('success', 'Update deleted.');
    }

    private function updateUserStreak()
    {
        $user = auth()->user();
        $lastUpdate = $user->last_update_at;

        if (!$lastUpdate) {
            // First update ever
            $user->update([
                'current_streak' => 1,
                'longest_streak' => 1,
            ]);
            return;
        }

        $daysSinceLastUpdate = now()->diffInDays($lastUpdate);

        if ($daysSinceLastUpdate === 1) {
            // Consecutive day
            $user->increment('current_streak');
            if ($user->current_streak > $user->longest_streak) {
                $user->update(['longest_streak' => $user->current_streak]);
            }
        } elseif ($daysSinceLastUpdate > 1) {
            // Streak broken
            $user->update(['current_streak' => 1]);
        }
        // Same day = no change
    }

    public function toggleReaction(Update $update)
    {
        $user = auth()->user();
        
        // Check if user already reacted
        $existingReaction = Reaction::where('update_id', $update->id)
            ->where('user_id', $user->id)
            ->where('type', 'heart')
            ->first();

        if ($existingReaction) {
            // Unlike - remove reaction
            $existingReaction->delete();
            
            // Update stats
            $update->sprint->participants()->updateExistingPivot($update->user_id, [
                'reactions_received' => \DB::raw('GREATEST(reactions_received - 1, 0)'),
                'score' => \DB::raw('GREATEST(score - 1, 0)'),
            ]);
            
            // Update user total likes
            if ($update->user->total_likes > 0) {
                $update->user->decrement('total_likes');
            }
            
            $message = 'Reaction removed';
        } else {
            // Like - add reaction
            Reaction::create([
                'update_id' => $update->id,
                'user_id' => $user->id,
                'type' => 'heart',
            ]);
            
            // Update stats
            $update->sprint->participants()->updateExistingPivot($update->user_id, [
                'reactions_received' => \DB::raw('reactions_received + 1'),
                'score' => \DB::raw('score + 1'),
            ]);
            
            // Update user total likes
            $update->user->increment('total_likes');
            
            // Create notification
            NotificationService::newReaction($update->user, auth()->user(), $update);
            
            $message = 'Reaction added';
        }

        // Return back to reload the page with updated data
        return back();
    }
}
