<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class SprintParticipant extends Pivot
{
    protected $table = 'sprint_participants';

    protected $casts = [
        'joined_at' => 'datetime',
        'updates_posted' => 'integer',
        'reactions_received' => 'integer',
        'comments_made' => 'integer',
        'score' => 'float',
        'rank' => 'integer',
        'badges' => 'array',
    ];
}
