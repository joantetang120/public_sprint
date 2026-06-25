<?php

namespace App\Models;

use App\Models\Concerns\HasPublicUlid;
use App\Services\NotificationService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Sprint extends Model
{
    use HasFactory, HasPublicUlid;

    protected $fillable = [
        'ulid',
        'user_id',
        'title',
        'description',
        'category',
        'duration_days',
        'is_private',
        'invite_code',
        'starts_at',
        'ends_at',
        'status',
        'ai_summary',
        'participants_count',
        'updates_count',
    ];

    protected $casts = [
        'is_private' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    protected $appends = ['computed_status'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($sprint) {
            if ($sprint->is_private && !$sprint->invite_code) {
                $sprint->invite_code = Str::random(12);
            }
            
            // Set initial status based on start date
            $sprint->status = $sprint->calculateStatus();
        });

        static::saving(function ($sprint) {
            // Auto-update status when dates change
            if ($sprint->isDirty(['starts_at', 'ends_at'])) {
                $sprint->status = $sprint->calculateStatus();
            }
        });
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'sprint_participants')
            ->using(SprintParticipant::class)
            ->withPivot(['joined_at', 'updates_posted', 'reactions_received', 'comments_made', 'score', 'rank', 'badges', 'ai_summary', 'share_token'])
            ->withTimestamps();
    }

    public function updates(): HasMany
    {
        return $this->hasMany(Update::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(SprintTag::class, 'sprint_tag_pivot');
    }

    public function scopePublic($query)
    {
        return $query->where('is_private', false);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeTrending($query)
    {
        return $query->where('status', 'active')
            ->orderByDesc('participants_count')
            ->orderByDesc('updates_count');
    }

    public function getProgressPercentageAttribute(): float
    {
        $totalDays = $this->duration_days;
        $daysPassed = now()->diffInDays($this->starts_at);
        
        if ($daysPassed <= 0) return 0;
        if ($daysPassed >= $totalDays) return 100;
        
        return round(($daysPassed / $totalDays) * 100, 2);
    }

    public function getDaysRemainingAttribute(): int
    {
        return max(0, now()->diffInDays($this->ends_at, false));
    }

    /**
     * Check if the given user is the creator of this sprint
     */
    public function isCreator($userId): bool
    {
        return $this->user_id == $userId;
    }

    /**
     * Check if the current authenticated user is the creator
     */
    public function isCreatedByCurrentUser(): bool
    {
        return auth()->check() && $this->isCreator(auth()->id());
    }

    public function hasOnlyCreatorParticipant(): bool
    {
        return (int) $this->participants_count <= 1;
    }

    public function canBeManagedBeforeStartBy($userId): bool
    {
        return $this->isCreator($userId)
            && $this->hasOnlyCreatorParticipant()
            && now()->isBefore($this->starts_at);
    }

    /**
     * Calculate status based on dates
     */
    public function calculateStatus(): string
    {
        $now = now();
        
        if ($now->isBefore($this->starts_at)) {
            return 'upcoming';
        } elseif ($now->isAfter($this->ends_at)) {
            return 'completed';
        } else {
            return 'active';
        }
    }

    /**
     * Get the computed status based on dates
     */
    public function getComputedStatusAttribute(): string
    {
        return $this->calculateStatus();
    }

    /**
     * Update status in database if needed
     */
    public function updateStatus(): bool
    {
        $newStatus = $this->calculateStatus();
        if ($this->status !== $newStatus) {
            $wasCompleted = $this->status === 'completed';
            $updated = $this->update(['status' => $newStatus]);

            if ($updated && !$wasCompleted && $newStatus === 'completed') {
                NotificationService::sprintCompleted($this);
            }

            return $updated;
        }
        return false;
    }

    /**
     * Get completion statistics for the sprint
     */
    public function getCompletionStats(): array
    {
        $participants = $this->participants()
            ->withPivot(['updates_posted', 'reactions_received', 'comments_made', 'score', 'badges'])
            ->get();

        $totalUpdates = $this->updates()->count();
        $totalParticipants = $participants->count();
        $activeParticipants = $participants->filter(fn($p) => ($p->pivot->updates_posted ?? 0) > 0)->count();
        
        $topContributor = $participants->sortByDesc('pivot.score')->first();
        $mostActive = $participants->sortByDesc('pivot.updates_posted')->first();
        $mostEngaged = $participants->sortByDesc('pivot.reactions_received')->first();

        return [
            'total_updates' => $totalUpdates,
            'total_participants' => $totalParticipants,
            'active_participants' => $activeParticipants,
            'completion_rate' => $totalParticipants > 0 ? round(($activeParticipants / $totalParticipants) * 100, 1) : 0,
            'avg_updates_per_participant' => $activeParticipants > 0 ? round($totalUpdates / $activeParticipants, 1) : 0,
            'top_contributor' => $topContributor,
            'most_active' => $mostActive,
            'most_engaged' => $mostEngaged,
            'total_reactions' => $participants->sum('pivot.reactions_received'),
            'total_comments' => $participants->sum('pivot.comments_made'),
        ];
    }

    /**
     * Check if sprint is completed
     */
    public function isCompleted(): bool
    {
        return $this->computed_status === 'completed';
    }
}
