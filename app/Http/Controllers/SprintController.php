<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use App\Models\SprintTag;
use App\Models\Update;
use App\Services\BadgeService;
use App\Services\AIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SprintController extends Controller
{
    public function index()
    {
        $sprints = Sprint::with(['creator', 'tags', 'participants'])
            ->where(function ($query) {
                $query->where('user_id', auth()->id())
                    ->orWhereHas('participants', function ($participantQuery) {
                        $participantQuery->where('user_id', auth()->id());
                    });
            })
            ->latest()
            ->paginate(12);

        $sprints->through(function (Sprint $sprint) {
            $sprint->setAttribute('can_manage_before_start', $sprint->canBeManagedBeforeStartBy(auth()->id()));

            return $sprint;
        });

        return Inertia::render('Sprint/Index', [
            'sprints' => $sprints,
        ]);
    }

    public function discover(Request $request)
    {
        // Update all sprint statuses first
        Sprint::whereIn('status', ['upcoming', 'active'])->get()->each->updateStatus();
        
        $query = Sprint::with(['creator', 'tags'])->public();

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }


        // Sorting
        $sort = $request->get('sort', 'trending');
        switch ($sort) {
            case 'recent':
                $query->latest();
                break;
            case 'popular':
                $query->orderBy('participants_count', 'desc');
                break;
            case 'ending_soon':
                $query->where('status', 'active')->orderBy('ends_at', 'asc');
                break;
            case 'trending':
            default:
                $query->trending();
                break;
        }

        $sprints = $query->paginate(12)->withQueryString();

        // Get counts for each status
        $statusCounts = [
            'all' => Sprint::public()->count(),
            'active' => Sprint::public()->where('status', 'active')->count(),
            'upcoming' => Sprint::public()->where('status', 'upcoming')->count(),
            'completed' => Sprint::public()->where('status', 'completed')->count(),
        ];

        // For initial load without filters, also get featured sections
        $featured = null;
        if (!$request->hasAny(['search', 'status', 'category', 'sort'])) {
            $featured = [
                'trending' => Sprint::with(['creator', 'tags'])
                    ->public()
                    ->trending()
                    ->take(6)
                    ->get(),
                'active' => Sprint::with(['creator', 'tags'])
                    ->public()
                    ->active()
                    ->orderBy('ends_at', 'asc')
                    ->take(6)
                    ->get(),
                'upcoming' => Sprint::with(['creator', 'tags'])
                    ->public()
                    ->where('status', 'upcoming')
                    ->orderBy('starts_at', 'asc')
                    ->take(6)
                    ->get(),
            ];
        }

        $tags = SprintTag::orderByDesc('usage_count')->take(10)->get();

        return Inertia::render('PublicSprint/DiscoverNew', [
            'sprints' => $sprints,
            'statusCounts' => $statusCounts,
            'featured' => $featured,
            'popularTags' => $tags,
            'filters' => [
                'search' => $request->search,
                'status' => $request->get('status', 'all'),
                'sort' => $request->get('sort', 'trending'),
            ],
        ]);
    }

    public function show(Sprint $sprint)
    {
        // Auto-update status if needed
        $sprint->updateStatus();
        
        $sprint->load([
            'creator', 
            'tags', 
            'participants', 
            'updates' => function($query) {
                $query->with([
                    'user',
                    'reactions',
                    'comments' => function($query) {
                        $query->with(['user', 'replies' => function($q) {
                            $q->with('user')->latest();
                        }])->whereNull('parent_id')
                          ->withCount('replies')
                          ->latest();
                    },
                    'comments.user',
                    'comments.replies',
                    'comments.replies.user'
                ]);
            },
            'updates.comments.replies.user'
        ]);

        // Check if user is participant
        $isParticipant = auth()->check() && $sprint->participants()->where('user_id', auth()->id())->exists();
        
        // Check if user is creator
        $isCreator = auth()->check() && $sprint->isCreator(auth()->id());

        // Update rankings and badges
        BadgeService::updateRankings($sprint);
        BadgeService::calculateBadges($sprint);

        // Get leaderboard with all data including ai_summary
        $leaderboard = $sprint->participants()
            ->withPivot(['updates_posted', 'reactions_received', 'comments_made', 'score', 'rank', 'badges', 'ai_summary'])
            ->orderByDesc('sprint_participants.score')
            ->get();

        // Get completion stats if sprint is completed
        $completionStats = null;
        if ($sprint->isCompleted()) {
            $completionStats = $sprint->getCompletionStats();
        }

        return Inertia::render('Sprint/Show', [
            'sprint' => $sprint,
            'isParticipant' => $isParticipant,
            'isCreator' => $isCreator,
            'leaderboard' => $leaderboard,
            'completionStats' => $completionStats,
        ]);
    }

    public function create()
    {
        $tags = SprintTag::orderBy('name')->get();

        return Inertia::render('Sprint/Create', [
            'tags' => $tags,
        ]);
    }

    public function edit(Sprint $sprint)
    {
        $this->ensureSprintCanBeManaged($sprint);

        $tags = SprintTag::orderBy('name')->get();
        $sprint->load('tags');

        return Inertia::render('Sprint/Edit', [
            'sprint' => $sprint,
            'tags' => $tags,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateSprint($request);

        DB::beginTransaction();
        try {
            $sprint = Sprint::create([
                'user_id' => auth()->id(),
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'duration_days' => $validated['duration_days'],
                'is_private' => $validated['is_private'] ?? false,
                'starts_at' => $validated['starts_at'],
                'ends_at' => now()->parse($validated['starts_at'])->addDays($validated['duration_days']),
                'status' => 'upcoming',
            ]);

            // Attach tags
            if (!empty($validated['tags'])) {
                $tagIds = [];
                foreach ($validated['tags'] as $tagName) {
                    $tag = SprintTag::firstOrCreate(
                        ['name' => $tagName],
                        ['slug' => \Str::slug($tagName)]
                    );
                    $tag->increment('usage_count');
                    $tagIds[] = $tag->id;
                }
                $sprint->tags()->attach($tagIds);
            }

            // Add creator as participant
            $sprint->participants()->attach(auth()->id(), [
                'joined_at' => now(),
            ]);

            DB::commit();

            return redirect()->route('sprints.show', $sprint)
                ->with('success', 'Sprint created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create sprint.']);
        }
    }

    public function update(Request $request, Sprint $sprint)
    {
        $this->ensureSprintCanBeManaged($sprint);
        $validated = $this->validateSprint($request);

        DB::beginTransaction();
        try {
            $sprint->update([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'duration_days' => $validated['duration_days'],
                'is_private' => $validated['is_private'] ?? false,
                'starts_at' => $validated['starts_at'],
                'ends_at' => now()->parse($validated['starts_at'])->addDays($validated['duration_days']),
            ]);

            $this->syncSprintTags($sprint, $validated['tags'] ?? []);

            DB::commit();

            return redirect()->route('sprints.index')
                ->with('success', 'Sprint updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Failed to update sprint.']);
        }
    }

    public function destroy(Sprint $sprint)
    {
        $this->ensureSprintCanBeManaged($sprint);

        DB::beginTransaction();
        try {
            $sprint->load('tags');

            foreach ($sprint->tags as $tag) {
                if ($tag->usage_count > 0) {
                    $tag->decrement('usage_count');
                }
            }

            $sprint->delete();

            DB::commit();

            return redirect()->route('sprints.index')
                ->with('success', 'Sprint deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Failed to delete sprint.']);
        }
    }

    public function join(Sprint $sprint)
    {
        if ($sprint->is_private && !$sprint->invite_code) {
            return back()->withErrors(['error' => 'This sprint is private.']);
        }

        if ($sprint->participants()->where('user_id', auth()->id())->exists()) {
            return back()->withErrors(['error' => 'You are already a participant.']);
        }

        $sprint->participants()->attach(auth()->id(), [
            'joined_at' => now(),
        ]);

        $sprint->increment('participants_count');

        return back()->with('success', 'You joined the sprint!');
    }

    public function leave(Sprint $sprint)
    {
        if (!$sprint->participants()->where('user_id', auth()->id())->exists()) {
            return back()->withErrors(['error' => 'You are not a participant.']);
        }

        if ($sprint->user_id === auth()->id()) {
            return back()->withErrors(['error' => 'Sprint creator cannot leave.']);
        }

        $sprint->participants()->detach(auth()->id());
        $sprint->decrement('participants_count');

        return redirect()->route('sprints.index')
            ->with('success', 'You left the sprint.');
    }

    public function leaderboard(Sprint $sprint)
    {
        $leaderboard = DB::table('sprint_participants')
            ->join('users', 'sprint_participants.user_id', '=', 'users.id')
            ->where('sprint_participants.sprint_id', $sprint->id)
            ->select(
                'users.*',
                'sprint_participants.updates_posted',
                'sprint_participants.reactions_received',
                'sprint_participants.comments_made',
                'sprint_participants.score',
                'sprint_participants.rank',
                'sprint_participants.badges'
            )
            ->orderByDesc('sprint_participants.score')
            ->get();

        return response()->json($leaderboard);
    }

    public function generateSummary(Request $request, Sprint $sprint, AIService $aiService)
    {
        // Check if user is participant
        if (!$sprint->participants()->where('user_id', auth()->id())->exists()) {
            return back()->with('error', 'You must be a participant to generate a summary.');
        }

        // Check if sprint is completed
        if ($sprint->computed_status !== 'completed') {
            return back()->with('error', 'Summary can only be generated for completed sprints.');
        }

        // Validate style
        $style = $request->input('style', 'professional');
        if (!in_array($style, ['professional', 'casual', 'technical'])) {
            $style = 'professional';
        }

        // Get user's participation data
        $userParticipation = $sprint->participants()
            ->where('user_id', auth()->id())
            ->first();

        $updates = Update::where('sprint_id', $sprint->id)
            ->where('user_id', auth()->id())
            ->where('is_draft', false)
            ->get();

        // Generate structured sprint report
        $summary = $aiService->generateSprintSummary($sprint, $userParticipation, $updates, $style);

        // Log for debugging
        \Log::info('Sprint report generated', [
            'sprint_id' => $sprint->id,
            'user_id' => auth()->id(),
            'style' => $style,
            'summary_length' => strlen($summary)
        ]);

        // Check if participation exists
        $participation = DB::table('sprint_participants')
            ->where('sprint_id', $sprint->id)
            ->where('user_id', auth()->id())
            ->first();

        \Log::info('Participation found', ['participation' => $participation]);

        // Save summary to user's sprint participation - force update with timestamp
        $updated = DB::table('sprint_participants')
            ->where('sprint_id', $sprint->id)
            ->where('user_id', auth()->id())
            ->update([
                'ai_summary' => $summary,
                'updated_at' => now()
            ]);

        \Log::info('Summary saved', [
            'rows_updated' => $updated,
            'sprint_id' => $sprint->id,
            'user_id' => auth()->id(),
            'summary_preview' => substr($summary, 0, 100)
        ]);

        return redirect()->back()->with('success', 'Sprint report generated successfully!');
    }

    private function validateSprint(Request $request): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'duration_days' => 'required|integer|in:3,7,14,21,30',
            'is_private' => 'boolean',
            'starts_at' => 'required|date|after:now',
            'tags' => 'array',
            'tags.*' => 'string|max:50',
        ]);
    }

    private function ensureSprintCanBeManaged(Sprint $sprint): void
    {
        abort_unless(
            $sprint->canBeManagedBeforeStartBy(auth()->id()),
            403,
            'This sprint can no longer be edited or deleted.'
        );
    }

    private function syncSprintTags(Sprint $sprint, array $tagNames): void
    {
        $sprint->loadMissing('tags');

        $currentTagIds = $sprint->tags->pluck('id');
        $newTagIds = collect($tagNames)
            ->filter()
            ->unique()
            ->map(function ($tagName) {
                $tag = SprintTag::firstOrCreate(
                    ['name' => $tagName],
                    ['slug' => \Str::slug($tagName)]
                );

                return $tag->id;
            })
            ->values();

        $tagIdsToDetach = $currentTagIds->diff($newTagIds);
        $tagIdsToAttach = $newTagIds->diff($currentTagIds);

        if ($tagIdsToDetach->isNotEmpty()) {
            SprintTag::whereIn('id', $tagIdsToDetach)->get()->each(function (SprintTag $tag) {
                if ($tag->usage_count > 0) {
                    $tag->decrement('usage_count');
                }
            });
        }

        if ($tagIdsToAttach->isNotEmpty()) {
            SprintTag::whereIn('id', $tagIdsToAttach)->increment('usage_count');
        }

        $sprint->tags()->sync($newTagIds->all());
    }
}
