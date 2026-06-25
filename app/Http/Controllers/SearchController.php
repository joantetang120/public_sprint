<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = trim((string) $request->string('q'));

        $sprints = collect();
        $users = collect();

        if ($query !== '') {
            $sprints = Sprint::query()
                ->with(['creator', 'tags'])
                ->public()
                ->where(function ($builder) use ($query) {
                    $builder->where('title', 'like', "%{$query}%")
                        ->orWhere('description', 'like', "%{$query}%")
                        ->orWhereHas('creator', function ($creatorQuery) use ($query) {
                            $creatorQuery->where('name', 'like', "%{$query}%");
                        })
                        ->orWhereHas('tags', function ($tagQuery) use ($query) {
                            $tagQuery->where('name', 'like', "%{$query}%");
                        });
                })
                ->orderByDesc('participants_count')
                ->orderByDesc('updates_count')
                ->latest()
                ->take(12)
                ->get();

            $users = User::query()
                ->where('profile_public', true)
                ->where(function ($builder) use ($query) {
                    $builder->where('name', 'like', "%{$query}%")
                        ->orWhere('bio', 'like', "%{$query}%")
                        ->orWhere('location', 'like', "%{$query}%");
                })
                ->withCount('followers', 'createdSprints')
                ->latest()
                ->take(12)
                ->get([
                    'id',
                    'ulid',
                    'name',
                    'avatar',
                    'bio',
                    'location',
                    'website',
                    'show_stats',
                    'followers_count',
                    'total_likes',
                    'created_at',
                ]);
        }

        return Inertia::render('Search/Index', [
            'query' => $query,
            'results' => [
                'sprints' => $sprints,
                'users' => $users,
                'counts' => [
                    'sprints' => $sprints->count(),
                    'users' => $users->count(),
                ],
            ],
        ]);
    }
}
