<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'cover_image',
        'bio',
        'location',
        'website',
        'sprints_completed',
        'current_streak',
        'longest_streak',
        'total_likes',
        'followers_count',
        'following_count',
        'last_update_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_update_at' => 'datetime',
        ];
    }

    public function createdSprints(): HasMany
    {
        return $this->hasMany(Sprint::class);
    }

    public function sprints(): BelongsToMany
    {
        return $this->belongsToMany(Sprint::class, 'sprint_participants')
            ->withPivot(['joined_at', 'updates_posted', 'reactions_received', 'comments_made', 'score', 'rank', 'badges'])
            ->withTimestamps();
    }

    public function updates(): HasMany
    {
        return $this->hasMany(Update::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function reactions(): HasMany
    {
        return $this->hasMany(Reaction::class);
    }

    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows', 'following_id', 'follower_id')
            ->withTimestamps();
    }

    public function following(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'following_id')
            ->withTimestamps();
    }

    public function isFollowing(User $user): bool
    {
        return $this->following()->where('following_id', $user->id)->exists();
    }

    public function follow(User $user): void
    {
        if (!$this->isFollowing($user)) {
            $this->following()->attach($user->id);
            $user->increment('followers_count');
            $this->increment('following_count');
        }
    }

    public function unfollow(User $user): void
    {
        if ($this->isFollowing($user)) {
            $this->following()->detach($user->id);
            $user->decrement('followers_count');
            $this->decrement('following_count');
        }
    }

    public function notifications()
    {
        return $this->morphMany(\Illuminate\Notifications\DatabaseNotification::class, 'notifiable')->orderBy('created_at', 'desc');
    }
}
