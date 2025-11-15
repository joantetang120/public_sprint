<?php

namespace App\Console\Commands;

use App\Models\Sprint;
use Illuminate\Console\Command;

class UpdateSprintStatuses extends Command
{
    protected $signature = 'sprints:update-statuses';
    protected $description = 'Update sprint statuses based on their start and end dates';

    public function handle()
    {
        $this->info('Updating sprint statuses...');

        $sprints = Sprint::whereIn('status', ['upcoming', 'active'])->get();
        $updated = 0;

        foreach ($sprints as $sprint) {
            if ($sprint->updateStatus()) {
                $updated++;
                $this->info("Sprint #{$sprint->id}: {$sprint->title} -> {$sprint->status}");
            }
        }

        $this->info("Updated {$updated} sprint(s).");
        return 0;
    }
}
