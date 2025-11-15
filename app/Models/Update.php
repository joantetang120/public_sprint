<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Update extends Model
{
    use HasFactory;

    protected $fillable = [
        'sprint_id',
        'user_id',
        'day_number',
        'content',
        'image',
        'images',
        'links',
        'is_draft',
        'reactions_count',
        'comments_count',
    ];

    protected $casts = [
        'is_draft' => 'boolean',
        'images' => 'array',
        'links' => 'array',
    ];

    protected $with = ['user', 'sprint'];

    public function sprint(): BelongsTo
    {
        return $this->belongsTo(Sprint::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reactions(): HasMany
    {
        return $this->hasMany(Reaction::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function scopePublished($query)
    {
        return $query->where('is_draft', false);
    }

    public function hasReactionFrom(User $user, string $type): bool
    {
        return $this->reactions()
            ->where('user_id', $user->id)
            ->where('type', $type)
            ->exists();
    }
}
