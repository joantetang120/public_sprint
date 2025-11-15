<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Sprint extends Model
{
    use HasFactory;

    protected $fillable = [
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
            ->withPivot(['joined_at', 'updates_posted', 'reactions_received', 'comments_made', 'score', 'rank', 'badges'])
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
            return $this->update(['status' => $newStatus]);
        }
        return false;
    }
}
