<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Update;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Update $update)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = Comment::create([
            'update_id' => $update->id,
            'user_id' => auth()->id(),
            'parent_id' => $validated['parent_id'] ?? null,
            'content' => $validated['content'],
        ]);

        // Update counts
        $update->increment('comments_count');

        if (isset($validated['parent_id']) && $validated['parent_id']) {
            Comment::find($validated['parent_id'])->increment('replies_count');
        }

        // Update participant stats
        $update->sprint->participants()->updateExistingPivot(auth()->id(), [
            'comments_made' => \DB::raw('comments_made + 1'),
            'score' => \DB::raw('score + 0.5'),
        ]);

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

        $update = $comment->sprintUpdate;

        // Update counts
        $update->decrement('comments_count');

        if ($comment->parent_id) {
            Comment::find($comment->parent_id)->decrement('replies_count');
        }

        // Update participant stats
        $update->sprint->participants()->updateExistingPivot(auth()->id(), [
            'comments_made' => \DB::raw('comments_made - 1'),
            'score' => \DB::raw('score - 0.5'),
        ]);

        $comment->delete();

        return back()->with('success', 'Comment deleted.');
    }
}
