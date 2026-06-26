<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $totalUsers    = User::count();
        $newToday      = User::whereDate('created_at', today())->count();
        $newThisWeek   = User::where('created_at', '>=', now()->subDays(7))->count();
        $totalSprints  = DB::table('sprints')->count();
        $activeSprints = DB::table('sprints')->where('status', 'active')->count();
        $updatesToday  = DB::table('updates')->whereDate('created_at', today())->count();
        $totalUpdates  = DB::table('updates')->count();

        // Online = users with a session updated in the last 10 minutes
        $onlineCount = DB::table('sessions')
            ->where('last_activity', '>=', now()->subMinutes(10)->timestamp)
            ->whereNotNull('user_id')
            ->distinct('user_id')
            ->count('user_id');

        // Signups per day last 14 days
        $signupTrend = User::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->where('created_at', '>=', now()->subDays(14))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Recent 10 activity logs
        $recentActivity = ActivityLog::with('user:id,name,avatar,ulid')
            ->latest('created_at')
            ->limit(20)
            ->get();

        // Top 5 most active users (by updates)
        $topUsers = User::withCount('updates')
            ->orderByDesc('updates_count')
            ->limit(5)
            ->get(['id', 'ulid', 'name', 'email', 'avatar', 'created_at']);

        return Inertia::render('Admin/Dashboard', compact(
            'totalUsers', 'newToday', 'newThisWeek',
            'totalSprints', 'activeSprints',
            'updatesToday', 'totalUpdates',
            'onlineCount', 'signupTrend',
            'recentActivity', 'topUsers'
        ));
    }

    public function users(Request $request)
    {
        $query = User::withCount(['updates', 'createdSprints'])
            ->orderByDesc('created_at');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('name', 'like', "%$s%")->orWhere('email', 'like', "%$s%"));
        }

        if ($request->filter === 'admin') {
            $query->where('is_admin', true);
        } elseif ($request->filter === 'suspended') {
            $query->where('is_suspended', true);
        }

        $users = $query->paginate(25)->withQueryString();

        return Inertia::render('Admin/Users', ['users' => $users, 'filters' => ['search' => $request->search, 'filter' => $request->filter]]);
    }

    public function sprints(Request $request)
    {
        $query = DB::table('sprints')
            ->join('users', 'sprints.user_id', '=', 'users.id')
            ->select(
                'sprints.id', 'sprints.ulid', 'sprints.title',
                'sprints.is_private', 'sprints.status',
                'sprints.starts_at', 'sprints.ends_at',
                'sprints.created_at',
                'users.name as owner_name', 'users.email as owner_email',
                'users.avatar as owner_avatar', 'users.ulid as owner_ulid'
            )
            ->orderByDesc('sprints.created_at');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('sprints.title', 'like', "%$s%")->orWhere('users.name', 'like', "%$s%"));
        }

        if ($request->filter === 'public') {
            $query->where('sprints.is_private', false);
        } elseif ($request->filter === 'private') {
            $query->where('sprints.is_private', true);
        } elseif ($request->filter === 'active') {
            $query->where('sprints.status', 'active');
        }

        $sprints = $query->paginate(25)->withQueryString();

        // Attach update counts
        $ids = collect($sprints->items())->pluck('id');
        $updateCounts = DB::table('updates')->whereIn('sprint_id', $ids)
            ->select('sprint_id', DB::raw('count(*) as count'))
            ->groupBy('sprint_id')
            ->pluck('count', 'sprint_id');

        $sprintsWithCounts = collect($sprints->items())->map(function ($s) use ($updateCounts) {
            $s->updates_count = $updateCounts[$s->id] ?? 0;
            return $s;
        });

        return Inertia::render('Admin/Sprints', [
            'sprints' => array_merge($sprints->toArray(), ['data' => $sprintsWithCounts]),
            'filters' => ['search' => $request->search, 'filter' => $request->filter],
        ]);
    }

    public function activity(Request $request)
    {
        $query = ActivityLog::with('user:id,name,avatar,ulid')->latest('created_at');

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        $logs = $query->paginate(50)->withQueryString();

        return Inertia::render('Admin/Activity', [
            'logs'    => $logs,
            'filters' => ['user_id' => $request->user_id, 'action' => $request->action],
        ]);
    }

    public function suspendUser(User $user)
    {
        if ($user->is_admin) {
            return back()->with('error', 'Cannot suspend an admin.');
        }
        $user->update(['is_suspended' => !$user->is_suspended]);
        return back()->with('success', $user->is_suspended ? 'User suspended.' : 'User unsuspended.');
    }

    public function deleteUser(User $user)
    {
        if ($user->is_admin) {
            return back()->with('error', 'Cannot delete an admin.');
        }
        $user->delete();
        return back()->with('success', 'User deleted.');
    }

    public function deleteSprint(Request $request, $id)
    {
        DB::table('sprints')->where('id', $id)->delete();
        return back()->with('success', 'Sprint deleted.');
    }
}
