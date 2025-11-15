<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use App\Models\SprintTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SprintController extends Controller
{
    public function index()
    {
        $sprints = Sprint::with(['creator', 'tags', 'participants'])
            ->where('user_id', auth()->id())
            ->orWhereHas('participants', function($query) {
                $query->where('user_id', auth()->id());
            })
            ->latest()
            ->paginate(12);

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

        // Get leaderboard
        $leaderboard = $sprint->participants()
            ->orderByDesc('sprint_participants.score')
            ->take(10)
            ->get();

        return Inertia::render('Sprint/Show', [
            'sprint' => $sprint,
            'isParticipant' => $isParticipant,
            'isCreator' => $isCreator,
            'leaderboard' => $leaderboard,
        ]);
    }

    public function create()
    {
        $tags = SprintTag::orderBy('name')->get();

        return Inertia::render('Sprint/Create', [
            'tags' => $tags,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'duration_days' => 'required|integer|in:3,7,14,21,30',
            'is_private' => 'boolean',
            'starts_at' => 'required|date|after:now',
            'tags' => 'array',
            'tags.*' => 'string|max:50',
        ]);

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
}
