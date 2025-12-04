<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Notification settings
            $table->boolean('email_notifications')->default(true)->after('email');
            $table->boolean('sprint_updates_notifications')->default(true)->after('email_notifications');
            $table->boolean('comment_notifications')->default(true)->after('sprint_updates_notifications');
            $table->boolean('reaction_notifications')->default(true)->after('comment_notifications');
            $table->boolean('sprint_completion_notifications')->default(true)->after('reaction_notifications');
            
            // Privacy settings
            $table->boolean('profile_public')->default(true)->after('sprint_completion_notifications');
            $table->boolean('show_email')->default(false)->after('profile_public');
            $table->boolean('show_stats')->default(true)->after('show_email');
            
            // Preferences
            $table->string('theme')->default('light')->after('show_stats'); // light, dark, auto
            $table->string('language')->default('en')->after('theme'); // en, fr
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'email_notifications',
                'sprint_updates_notifications',
                'comment_notifications',
                'reaction_notifications',
                'sprint_completion_notifications',
                'profile_public',
                'show_email',
                'show_stats',
                'theme',
                'language',
            ]);
        });
    }
};
