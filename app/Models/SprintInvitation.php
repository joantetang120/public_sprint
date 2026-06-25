<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SprintInvitation extends Model
{
    protected $fillable = ['sprint_id', 'invited_by_id', 'user_id', 'status'];

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }

    public function invitedBy()
    {
        return $this->belongsTo(User::class, 'invited_by_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
