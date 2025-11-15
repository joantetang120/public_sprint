<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Who receives the notification
            $table->foreignId('actor_id')->nullable()->constrained('users')->onDelete('cascade'); // Who triggered it
            $table->string('type'); // comment, reaction, follower, sprint_milestone, etc.
            $table->text('message');
            $table->json('data')->nullable(); // Additional data (sprint_id, update_id, etc.)
            $table->boolean('read')->default(false);
            $table->timestamps();
            
            $table->index(['user_id', 'read', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
