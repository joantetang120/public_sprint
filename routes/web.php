<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SprintController;
use App\Http\Controllers\SprintInvitationController;
use App\Http\Controllers\SummaryShareController;
use App\Http\Controllers\UpdateController;
use App\Http\Controllers\LanguageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('PublicSprint/Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});


Route::get('/discover', [SprintController::class, 'discover'])->name('discover');
Route::get('/search', [SearchController::class, 'index'])->name('search.index');
Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('notifications.unread');
Route::post('/language', [LanguageController::class, 'update'])->name('language.update');

// Serve update images
Route::get('/storage/updates/{filename}', function ($filename) {
    $path = storage_path('app/public/updates/' . $filename);
    
    \Log::info('Image request', [
        'filename' => $filename,
        'path' => $path,
        'exists' => file_exists($path),
        'storage_path' => storage_path('app/public/updates/'),
    ]);
    
    if (!file_exists($path)) {
        // Try to list what files exist
        $files = glob(storage_path('app/public/updates/*'));
        \Log::error('Image not found', [
            'requested' => $filename,
            'available_files' => $files,
        ]);
        abort(404, 'Image not found: ' . $filename);
    }
    
    return response()->file($path);
})->where('filename', '.*');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard / Feed
    Route::get('/dashboard', [UpdateController::class, 'index'])->name('dashboard');
    
    // Sprints - IMPORTANT: Specific routes BEFORE dynamic {sprint} route
    Route::get('/sprints', [SprintController::class, 'index'])->name('sprints.index');
    Route::get('/sprints/create', [SprintController::class, 'create'])->name('sprints.create');
    Route::post('/sprints', [SprintController::class, 'store'])->name('sprints.store');
    Route::get('/sprints/{sprint}/edit', [SprintController::class, 'edit'])->name('sprints.edit');
    Route::put('/sprints/{sprint}', [SprintController::class, 'update'])->name('sprints.update');
    Route::delete('/sprints/{sprint}', [SprintController::class, 'destroy'])->name('sprints.destroy');
    Route::post('/sprints/{sprint}/join', [SprintController::class, 'join'])->name('sprints.join');
    Route::post('/sprints/{sprint}/leave', [SprintController::class, 'leave'])->name('sprints.leave');
    Route::get('/sprints/{sprint}/leaderboard', [SprintController::class, 'leaderboard'])->name('sprints.leaderboard');
    Route::post('/sprints/{sprint}/generate-summary', [SprintController::class, 'generateSummary'])->name('sprints.generate-summary');
    Route::get('/sprints/{sprint}/report', [SprintController::class, 'report'])->name('sprints.report');
    Route::get('/invite/{code}', [SprintController::class, 'joinViaInvite'])->name('sprints.invite');
    Route::post('/sprints/{sprint}/invitations', [SprintInvitationController::class, 'store'])->name('sprints.invitations.store');
    Route::post('/invitations/{invitation}/accept', [SprintInvitationController::class, 'accept'])->name('invitations.accept');
    Route::post('/invitations/{invitation}/decline', [SprintInvitationController::class, 'decline'])->name('invitations.decline');
    
    // Updates
    Route::get('/sprints/{sprint}/updates/create', [UpdateController::class, 'create'])->name('updates.create');
    Route::post('/sprints/{sprint}/updates', [UpdateController::class, 'store'])->name('updates.store');
    Route::put('/updates/{update}', [UpdateController::class, 'update'])->name('updates.update');
    Route::delete('/updates/{update}', [UpdateController::class, 'destroy'])->name('updates.destroy');
    Route::post('/updates/{update}/react', [UpdateController::class, 'toggleReaction'])->name('updates.react');
    
    // Comments
    Route::post('/updates/{update}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::put('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
    
    // Profile - Breeze routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/update-full', [ProfileController::class, 'updateFull'])->name('profile.update.full');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar'])->name('profile.avatar');
    
    // Follow/Unfollow
    Route::post('/users/{user}/follow', [ProfileController::class, 'follow'])->name('users.follow');
    Route::post('/users/{user}/unfollow', [ProfileController::class, 'unfollow'])->name('users.unfollow');
    
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.readAll');
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    
    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings/notifications', [SettingsController::class, 'updateNotifications'])->name('settings.notifications');
    Route::post('/settings/privacy', [SettingsController::class, 'updatePrivacy'])->name('settings.privacy');
    Route::post('/settings/preferences', [SettingsController::class, 'updatePreferences'])->name('settings.preferences');
    Route::post('/settings/account', [SettingsController::class, 'updateAccount'])->name('settings.account');
    Route::post('/settings/delete', [SettingsController::class, 'deleteAccount'])->name('settings.delete');
});

// Public sprint summary share page (no auth required)
Route::get('/share/{token}', [SummaryShareController::class, 'show'])->name('summary.share');

// Public profile view
Route::get('/users/{user}', [ProfileController::class, 'show'])->name('users.show');

// Public sprint view - MUST be after auth routes to avoid conflicts
Route::get('/sprints/{sprint}', [SprintController::class, 'show'])->name('sprints.show');

require __DIR__.'/auth.php';
