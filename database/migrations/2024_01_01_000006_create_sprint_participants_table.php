<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sprint_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sprint_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamp('joined_at');
            $table->integer('updates_posted')->default(0);
            $table->integer('reactions_received')->default(0);
            $table->integer('comments_made')->default(0);
            $table->integer('score')->default(0);
            $table->integer('rank')->nullable();
            $table->json('badges')->nullable(); // ['top_contributor', 'daily_streak', 'most_helpful']
            $table->timestamps();
            
            $table->unique(['sprint_id', 'user_id']);
            $table->index('score');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sprint_participants');
    }
};
