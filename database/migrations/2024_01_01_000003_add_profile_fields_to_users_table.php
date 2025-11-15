<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->nullable()->after('email');
            $table->text('bio')->nullable()->after('avatar');
            $table->string('location')->nullable()->after('bio');
            $table->string('website')->nullable()->after('location');
            $table->integer('sprints_completed')->default(0)->after('website');
            $table->integer('current_streak')->default(0)->after('sprints_completed');
            $table->integer('longest_streak')->default(0)->after('current_streak');
            $table->integer('total_likes')->default(0)->after('longest_streak');
            $table->integer('followers_count')->default(0)->after('total_likes');
            $table->integer('following_count')->default(0)->after('followers_count');
            $table->timestamp('last_update_at')->nullable()->after('following_count');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'avatar', 'bio', 'location', 'website',
                'sprints_completed', 'current_streak', 'longest_streak',
                'total_likes', 'followers_count', 'following_count', 'last_update_at'
            ]);
        });
    }
};
