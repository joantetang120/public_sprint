<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class GrantAdminAccess extends Command
{
    protected $signature = 'admin:grant {email}';
    protected $description = 'Grant admin access to a user by email';

    public function handle(): void
    {
        $email = $this->argument('email');
        $user  = User::where('email', $email)->first();

        if (!$user) {
            $this->error("No user found with email: {$email}");
            return;
        }

        $user->update(['is_admin' => true]);
        $this->info("Admin access granted to {$user->name} ({$user->email})");
    }
}
