<?php

namespace App\Models;

use Illuminate\Notifications\DatabaseNotification;

class Notification extends DatabaseNotification
{
    // Use Laravel's built-in notification system
    // This extends the existing notifications table
    
    public function getActorAttribute()
    {
        if (isset($this->data['actor_id'])) {
            return User::find($this->data['actor_id']);
        }
        return null;
    }

    public function getMessageAttribute()
    {
        return $this->data['message'] ?? '';
    }

    public function getIsReadAttribute()
    {
        return $this->read_at !== null;
    }
}
