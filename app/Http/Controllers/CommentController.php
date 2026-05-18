<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Update;
use App\Services\EngagementService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CommentController extends Controller
{
    public function store(Request $request, Update $update)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'parent_id' => [
                'nullable',
                Rule::exists('comments', 'id')->where(fn ($query) => $query->where('update_id', $update->id)),
            ],
        ]);

        $comment = Comment::create([
            'update_id' => $update->id,
            'user_id' => auth()->id(),
            'parent_id' => $validated['parent_id'] ?? null,
            'content' => $validated['content'],
        ]);

        EngagementService::recordCommentCreated($comment);

        // Create notification
        NotificationService::newComment($update->user, auth()->user(), $update, $comment);

        return back()->with('success', 'Comment posted!');
    }

    public function update(Request $request, Comment $comment)
    {
        if ($comment->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment->update($validated);

        return back()->with('success', 'Comment updated!');
    }

    public function destroy(Comment $comment)
    {
        if ($comment->user_id !== auth()->id()) {
            abort(403);
        }

        EngagementService::deleteCommentThread($comment);

        return back()->with('success', 'Comment deleted.');
    }
}
