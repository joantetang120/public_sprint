<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use App\Models\SprintInvitation;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class SprintInvitationController extends Controller
{
    /**
     * Creator sends invitations to one or more friends.
     */
    public function store(Request $request, Sprint $sprint)
    {
        $request->validate([
            'user_ids'   => 'required|array|min:1|max:20',
            'user_ids.*' => 'integer|exists:users,id',
        ]);

        if (!$sprint->isCreator(auth()->id())) {
            return back()->withErrors(['error' => 'Only the sprint creator can send invitations.']);
        }

        if (!$sprint->is_private) {
            return back()->withErrors(['error' => 'Invitations are only for private sprints.']);
        }

        $inviter      = auth()->user();
        $existingIds  = $sprint->participants()->pluck('user_id')->toArray();
        $sent         = 0;

        foreach ($request->user_ids as $userId) {
            // Skip if already participant or already invited
            if (in_array($userId, $existingIds)) continue;
            if (SprintInvitation::where('sprint_id', $sprint->id)->where('user_id', $userId)->exists()) continue;

            $invitation = SprintInvitation::create([
                'sprint_id'     => $sprint->id,
                'invited_by_id' => $inviter->id,
                'user_id'       => $userId,
                'status'        => 'pending',
            ]);

            $invitee = User::find($userId);
            if ($invitee) {
                NotificationService::sprintInvitation($invitee, $sprint, $inviter, $invitation->id);
            }

            $sent++;
        }

        return back()->with('success', $sent > 0
            ? "Invitation" . ($sent > 1 ? 's' : '') . " sent to {$sent} " . ($sent > 1 ? 'people' : 'person') . "."
            : 'No new invitations sent.'
        );
    }

    /**
     * Invited user accepts the invitation and joins the sprint.
     */
    public function accept(SprintInvitation $invitation)
    {
        if ($invitation->user_id !== auth()->id()) {
            abort(403);
        }

        if ($invitation->status !== 'pending') {
            return back()->withErrors(['error' => 'This invitation has already been responded to.']);
        }

        $sprint = $invitation->sprint;

        if (!$sprint->participants()->where('user_id', auth()->id())->exists()) {
            $sprint->participants()->attach(auth()->id(), ['joined_at' => now()]);
            $sprint->increment('participants_count');
        }

        $invitation->update(['status' => 'accepted']);

        return redirect()->route('sprints.show', $sprint)
            ->with('success', 'You joined the sprint!');
    }

    /**
     * Invited user declines the invitation.
     */
    public function decline(SprintInvitation $invitation)
    {
        if ($invitation->user_id !== auth()->id()) {
            abort(403);
        }

        if ($invitation->status !== 'pending') {
            return back()->withErrors(['error' => 'This invitation has already been responded to.']);
        }

        $invitation->update(['status' => 'declined']);

        return back()->with('info', 'Invitation declined.');
    }
}
