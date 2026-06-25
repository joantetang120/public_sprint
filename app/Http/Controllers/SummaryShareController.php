<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Sprint;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SummaryShareController extends Controller
{
    public function show(string $token)
    {
        $row = DB::table('sprint_participants')
            ->where('share_token', $token)
            ->first();

        if (!$row || !$row->ai_summary) {
            abort(404);
        }

        $sprint = Sprint::with(['creator', 'tags'])->find($row->sprint_id);
        $user   = User::select(['id', 'name', 'avatar', 'bio'])->find($row->user_id);

        if (!$sprint || !$user) {
            abort(404);
        }

        return Inertia::render('Sprint/PublicSummary', [
            'sprint'     => $sprint,
            'user'       => $user,
            'aiSummary'  => $row->ai_summary,
            'shareToken' => $token,
            'metrics'    => [
                'updates_posted'     => $row->updates_posted,
                'reactions_received' => $row->reactions_received,
                'score'              => $row->score,
                'rank'               => $row->rank,
            ],
        ]);
    }
}
