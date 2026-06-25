<?php

use Illuminate\Support\Facades\Broadcast;

// Public sprint channel — no auth required (sprints are viewable by all)
Broadcast::channel('sprint.{sprintId}', function ($user) {
    return true;
});
